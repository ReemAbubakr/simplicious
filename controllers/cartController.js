const Cart = require('../models/cart');
const Book = require('../models/book');
const mongoose = require('mongoose');

// Middleware to get or create cart
exports.getCart = async (req, res, next) => {
  try {
    const sessionId = req.sessionID;
    
    // Atomic operation to find or create cart
    let cart = await Cart.findOneAndUpdate(
      { sessionId },
      { 
        $setOnInsert: { 
          items: [], 
          createdAt: new Date() 
        } 
      },
      { 
        upsert: true, 
        new: true,
        populate: 'items.bookId',
        // Prevent adding userId field accidentally
        projection: { userId: 0 } 
      }
    ).lean().exec();
    
    // Convert back to Mongoose document if needed for modifications
    req.cart = cart ? new Cart(cart) : cart;
    next();
  } catch (err) {
    console.error('Error getting cart:', err);
    if (err.code === 11000) {
      // Handle duplicate key error gracefully
      const existingCart = await Cart.findOne({ sessionId }).populate('items.bookId');
      if (existingCart) {
        req.cart = existingCart;
        return next();
      }
    }
    next(err);
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { bookId } = req.params;
    let { quantity = 1 } = req.body;

    // Validate inputs
    quantity = parseInt(quantity);
    if (isNaN(quantity) || quantity < 1) {
      await session.abortTransaction();
      return res.status(400).json({ 
        success: false, 
        message: 'Quantity must be at least 1' 
      });
    }

    // Validate book exists and is available
    const book = await Book.findById(bookId).session(session);
    if (!book || !book.available) {
      await session.abortTransaction();
      return res.status(404).json({ 
        success: false, 
        message: 'Book not available' 
      });
    }

    // Check stock if applicable
    if (book.stockQuantity && quantity > book.stockQuantity) {
      await session.abortTransaction();
      return res.status(400).json({ 
        success: false, 
        message: `Only ${book.stockQuantity} items available` 
      });
    }

    // Find existing item index
    const existingItemIndex = req.cart.items.findIndex(
      item => item.bookId.toString() === bookId
    );

    if (existingItemIndex >= 0) {
      // Update quantity if already in cart
      req.cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      req.cart.items.push({ 
        bookId, 
        quantity,
        addedAt: new Date()
      });
    }

    // Save with transaction
    await req.cart.save({ session });
    await session.commitTransaction();
    
    // Return updated cart with populated data
    const updatedCart = await Cart.findById(req.cart._id)
      .populate('items.bookId')
      .lean();

    res.json({ 
      success: true, 
      cart: updatedCart,
      totalItems: updatedCart.items.reduce((sum, item) => sum + item.quantity, 0)
    });
  } catch (err) {
    await session.abortTransaction();
    console.error('Error adding to cart:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error adding to cart',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  } finally {
    session.endSession();
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { bookId } = req.params;
    let { quantity } = req.body;

    // Validate inputs
    quantity = parseInt(quantity);
    if (isNaN(quantity) || quantity < 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Quantity must be a number at least 1' 
      });
    }

    // Check book availability
    const book = await Book.findById(bookId);
    if (!book || !book.available) {
      return res.status(404).json({ 
        success: false, 
        message: 'Book not available' 
      });
    }

    // Check stock if applicable
    if (book.stockQuantity && quantity > book.stockQuantity) {
      return res.status(400).json({ 
        success: false, 
        message: `Only ${book.stockQuantity} items available` 
      });
    }

    // Find and update item
    const itemIndex = req.cart.items.findIndex(
      item => item.bookId.toString() === bookId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found in cart' 
      });
    }

    req.cart.items[itemIndex].quantity = quantity;
    await req.cart.save();

    // Get fresh cart data
    const updatedCart = await Cart.findById(req.cart._id)
      .populate('items.bookId')
      .lean();

    res.json({ 
      success: true, 
      cart: updatedCart,
      totalItems: updatedCart.items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: updatedCart.items.reduce(
        (sum, item) => sum + (item.bookId.price * item.quantity), 0
      )
    });
  } catch (err) {
    console.error('Error updating cart:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating cart',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { bookId } = req.params;

    // Filter out the item
    req.cart.items = req.cart.items.filter(
      item => item.bookId.toString() !== bookId
    );

    await req.cart.save();

    // Get fresh cart data
    const updatedCart = await Cart.findById(req.cart._id)
      .populate('items.bookId')
      .lean();

    res.json({ 
      success: true, 
      cart: updatedCart,
      totalItems: updatedCart.items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: updatedCart.items.reduce(
        (sum, item) => sum + (item.bookId.price * item.quantity), 0
      )
    });
  } catch (err) {
    console.error('Error removing from cart:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error removing from cart',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Get cart details (for rendering view)
exports.getCartDetails = async (req, res) => {
  try {
    const cart = await Cart.findById(req.cart._id)
      .populate({
        path: 'items.bookId',
        select: 'title price imageUrl slug', // Only select needed fields
        options: { lean: true }
      })
      .lean();

    if (!cart) {
      req.flash('error', 'Your cart is empty');
      return res.redirect('/books');
    }

    res.render('pages/cart/view', {
      title: 'Your Shopping Cart',
      cart,
      currentPage: 'cart',
      flashMessages: req.flash(),
      currentUrl: req.originalUrl,
      // Calculate totals
      totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: cart.items.reduce(
        (sum, item) => sum + (item.bookId.price * item.quantity), 0
      )
    });
  } catch (err) {
    console.error('Error getting cart details:', err);
    req.flash('error', 'Error loading your cart');
    res.redirect('/');
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    req.cart.items = [];
    await req.cart.save({ session });
    await session.commitTransaction();
    
    res.json({ 
      success: true, 
      message: 'Cart cleared successfully',
      cart: {
        items: [],
        totalItems: 0,
        totalPrice: 0
      }
    });
  } catch (err) {
    await session.abortTransaction();
    console.error('Error clearing cart:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error clearing cart',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  } finally {
    session.endSession();
  }
};