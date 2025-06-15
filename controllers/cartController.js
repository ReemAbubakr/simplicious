const Cart = require('../models/cart');
const Book = require('../models/book');
const Order = require('../models/order');
const mongoose = require('mongoose');
const { CurrencyCodes } = require('validator/lib/isISO4217');


exports.getCartStatus = async (req, res) => {
  const bookId = req.params.bookId;
  const cart = await Cart.findOne({ sessionId: req.sessionID });
 console.log("crat:",cart.books)

  const inCart = cart.books.findIndex(item => String(item.book) === String(bookId));


  console.log("inCart:", inCart);
  if (inCart>=0) {
    res.status(200).json({ inCart: true });
  } else {
  res.status(200).json({ inCart: false });
  }
  
};



exports.addToCart = async (req, res) => {
  const { bookId,imagePath,price } = req.body;
  const sessionId = req.sessionID;


  if (!bookId || !sessionId) {
    return res.status(400).json({ error: 'Book ID or session missing' });
  }

  try {
    // Find the book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Find or create cart
    let cart = await Cart.findOne({ sessionId });
   

    if (!cart) {
      cart = new Cart({
        sessionId,
        books: [{book:bookId,imagePath:imagePath,quantity:1,price:price}] // Changed from items to books
      });
    }else{
      const existingBook = cart.books.findIndex(item => 
       item.book === bookId
     );
     console.log("existingBook:", existingBook);
  
     if (existingBook>=0) {
      cart.books[existingBook].quantity += 1;
      
     } else {
       cart.books.push({book:bookId,imagePath:imagePath,quantity:1,price:price});
     }

    }


    await cart.save();
  

    res.status(200).json({
      message: 'Added to cart',
      cart: {
        books: cart.books,
        totalItems: cart.totalItems,
        totalPrice: cart.totalPrice
      }
    });

  } catch (err) {
    console.error('Failed to add to cart:', err);
    res.status(500).json({ 
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.removeFromCart = async (req, res) => {
  const { bookId } = req.body;
  const sessionId = req.sessionID;

  if (!bookId || !sessionId) {
    return res.status(400).json({ error: 'Book ID or session missing' });
  }

  try {
    // Find the cart
    let cart = await Cart.findOne({ sessionId });
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Find the book index in cart
    const bookIndex = cart.books.findIndex(item => 
      item.book.toString() === bookId
    );

    if (bookIndex === -1) {
      return res.status(404).json({ error: 'Book not in cart' });
    }

    // Remove the item or decrement quantity
    if (cart.books[bookIndex].quantity > 1) {
      // Decrement quantity if more than 1
      cart.books[bookIndex].quantity -= 1;
    } else {
      // Remove completely if quantity is 1
      cart.books.splice(bookIndex, 1);
    }

    // Recalculate totals
    cart.totalItems = cart.books.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.books.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    await cart.save();

    res.status(200).json({
      message: 'Removed from cart',
      cart: {
        books: cart.books,
        totalItems: cart.totalItems,
        totalPrice: cart.totalPrice
      }
    });

  } catch (err) {
    console.error('Failed to remove from cart:', err);
    res.status(500).json({ 
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.clearCart = async (req, res) => {
  try {
    // Use sessionId or userId depending on your authentication
    const sessionId = req.sessionID;
    // If you use userId: const userId = req.user._id;

    await Cart.findOneAndUpdate(
      { sessionId }, // or { userId }
      { $set: { books: [], totalPrice: 0, totalItems: 0 } }
    );

    // For API endpoint:
    // res.json({ success: true, cart: { books: [], totalPrice: 0, totalItems: 0 } });

    // For classic form POST:
    res.redirect('/cart');
  } catch (err) {
    console.error('Clear cart error:', err);
    res.status(500).send('Failed to clear cart');
  }
};
// Update cart item quantity
// exports.updateCartItem = async (req, res) => {
//   try {
//     const { bookId } = req.params;
//     let { quantity } = req.body;

//     // Validate inputs
//     quantity = parseInt(quantity);
//     if (isNaN(quantity) || quantity < 1) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Quantity must be a number at least 1' 
//       });
//     }

//     // Check book availability
//     const book = await Book.findById(bookId);
//     if (!book || !book.available) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Book not available' 
//       });
//     }

//     // Check stock if applicable
//     if (book.stockQuantity && quantity > book.stockQuantity) {
//       return res.status(400).json({ 
//         success: false, 
//         message: `Only ${book.stockQuantity} items available` 
//       });
//     }

//     // Find and update item
//     const itemIndex = req.cart.items.findIndex(
//       item => item.bookId.toString() === bookId
//     );

//     if (itemIndex === -1) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Item not found in cart' 
//       });
//     }

//     req.cart.items[itemIndex].quantity = quantity;
//     await req.cart.save();

//     // Get fresh cart data
//     const updatedCart = await Cart.findById(req.cart._id)
//       .populate('items.bookId')
//       .lean();

//     res.json({ 
//       success: true, 
//       cart: updatedCart,
//       totalItems: updatedCart.items.reduce((sum, item) => sum + item.quantity, 0),
//       totalPrice: updatedCart.items.reduce(
//         (sum, item) => sum + (item.bookId.price * item.quantity), 0
//       )
//     });
//   } catch (err) {
//     console.error('Error updating cart:', err);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Error updating cart',
//       error: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
//   }
// };

exports.checkout = async (req, res) => {
  try {
    const sessionId = req.sessionID;
    const cart = await Cart.findOne({ sessionId });
    if (!cart || cart.books.length === 0) {
      return res.status(400).send("Your cart is empty.");
    }

    // Save order (no userId)
    await Order.create({
      sessionId, // <-- just sessionId, no userId!
      books: cart.books,
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      payment: req.body.payment
    });

    // Clear the cart
    cart.books = [];
    await cart.save();

    // Redirect to confirmation page
    res.redirect('/order/confirmation');
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).send('Checkout failed. Please try again.');
  }
};

exports.getCartContents = async (req, res) => {
  try {
    const sessionId = req.sessionID;
    if (!sessionId) return res.status(400).json({ error: 'Session ID is missing' });

    const cart = await Cart.findOne({ sessionId })
      .populate({
        path: 'books.book',
        select: 'title price imagePath stock altText'
      });
      console.log("cart:", cart);
if (!cart || cart.books.length === 0) {
      return res.status(200).render('pages/Cart', {
        books: [],
        totalItems: 0,
        totalPrice: 0,
        currentPage: 'cart',
        pageTitle: 'Your Shopping Cart'
      });
    }


   res.status(200).render('pages/Cart', {books: cart.books,
      totalItems: cart.totalItems,
      totalPrice: cart.totalPrice,
      currentPage: 'cart',
      pageTitle: 'Your Shopping Cart',
  
    });
  } catch (err) {
    console.error('Failed to get cart contents:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
exports.viewCart = async (req, res) => {
  try {
    const sessionId = req.sessionID;
    let cart = await Cart.findOne({ sessionId })
      .populate('books.book');

    if (!cart) {
      cart = {
        books: [],
        totalItems: 0,
        totalPrice: 0
      };
    }

    // Calculate totals if virtuals not working
    cart.totalItems = cart.books.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.books.reduce((sum, item) => {
      return sum + (parseFloat(item.book.price) * item.quantity);
    }, 0);

    res.render('pages/Cart', {
      cart,
      currentPage: 'cart',
      pageTitle: 'Your Shopping Cart',
      formattedBooks: cart.books.map(bookItem => ({
        ...bookItem.toObject(),
        subtotal: (parseFloat(bookItem.book.price) * bookItem.quantity)
      }))
    });

  } catch (err) {
    console.error('Error loading cart:', err);
    res.status(500).render('error', {
      error: 'Internal server error',
      currentPage: 'error'
    });
  }
};

// Clear cart
// exports.clearCart = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     req.cart.items = [];
//     await req.cart.save({ session });
//     await session.commitTransaction();
    
//     res.json({ 
//       success: true, 
//       message: 'Cart cleared successfully',
//       cart: {
//         items: [],
//         totalItems: 0,
//         totalPrice: 0
//       }
//     });
//   } catch (err) {
//     await session.abortTransaction();
//     console.error('Error clearing cart:', err);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Error clearing cart',
//       error: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
//   } finally {
//     session.endSession();
//   }
// };