const Cart = require('../models/cart');
const Book = require('../models/book');
const Coupon = require('../models/coupon');
const AppError = require('../utils/AppError');
const mongoose = require('mongoose');

class CartController {
  // Middleware to get or create cart
 static async getCart(req, res, next) {
  try {
    const filter = { sessionId: req.sessionID };
    let cart;

    if (req.user) {
      filter.$or = [
        { sessionId: req.sessionID },
        { userId: req.user._id }
      ];

      cart = await Cart.findOne({ sessionId: req.sessionID });
      if (cart && !cart.userId) {
        cart.userId = req.user._id;
        await cart.save();
      }
    }

    cart = await Cart.findOne(filter).populate({
      path: 'items.bookId',
      select: 'title price coverImage stockCount'
    });

    if (!cart) {
      cart = new Cart({ 
        sessionId: req.sessionID,
        userId: req.user?._id,
        items: [] 
      });
      await cart.save();
    }

    req.cart = cart;
    next();
  } catch (err) {
    console.error('Error in getCart:', err); // <— ADD THIS to debug the real issue
    next(new AppError('Failed to retrieve shopping cart', 500));
  }
}


  // Add item to cart
  static async addToCart(req, res, next) {
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            const { bookId } = req.params;
            const { quantity = 1 } = req.body;

            // Validate book ID
            if (!mongoose.Types.ObjectId.isValid(bookId)) {
                throw new AppError('Invalid book ID', 400);
            }

            // Validate quantity
            const parsedQuantity = parseInt(quantity);
            if (isNaN(parsedQuantity) || parsedQuantity < 1) {
                throw new AppError('Quantity must be a positive number', 400);
            }

            // Find book with price validation
            const book = await Book.findById(bookId)
                .select('title price priceNumber coverImage stockCount')
                .session(session);
            
            if (!book) {
                throw new AppError('Book not found', 404);
            }
            
            if (!book.price || isNaN(parseFloat(book.price))) {
                throw new AppError('Invalid book price', 400);
            }

            // Check stock availability
            if (book.stockCount < parsedQuantity) {
                throw new AppError(`Only ${book.stockCount} items available in stock`, 400);
            }

            // Get or create cart
            let cart = await Cart.findOne({
                $or: [
                    { sessionId: req.sessionID },
                    { userId: req.user?._id }
                ]
            }).session(session);

            if (!cart) {
                cart = new Cart({
                    sessionId: req.sessionID,
                    userId: req.user?._id,
                    items: [],
                    totalItems: 0,
                    totalPrice: 0
                });
            }

            // Find existing item or add new one
            const existingItemIndex = cart.items.findIndex(
                item => item.bookId && item.bookId.toString() === bookId
            );

            if (existingItemIndex >= 0) {
                const newQuantity = cart.items[existingItemIndex].quantity + parsedQuantity;
                if (book.stockCount < newQuantity) {
                    throw new AppError(`Only ${book.stockCount} items available in stock`, 400);
                }
                cart.items[existingItemIndex].quantity = newQuantity;
            } else {
                cart.items.push({
                    bookId,
                    quantity: parsedQuantity,
                    priceAtAddition: book.priceNumber || parseFloat(book.price),
                    addedAt: new Date()
                });
            }

            // Recalculate totals
            cart.totalItems = cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
            cart.totalPrice = cart.items.reduce(
                (sum, item) => sum + ((item.priceAtAddition || 0) * (item.quantity || 0)), 
                0
            );

            await cart.save({ session });

            // Update book stock
            if (book.stockCount !== undefined) {
                book.stockCount -= parsedQuantity;
                await book.save({ session });
            }
        });

        // After transaction succeeds, get populated cart for response
        const cart = await Cart.findOne({
            $or: [
                { sessionId: req.sessionID },
                { userId: req.user?._id }
            ]
        }).populate({
            path: 'items.bookId',
            select: 'title price priceNumber coverImage'
        });

        res.status(200).json({
            status: 'success',
            data: {
                cart: {
                    ...cart.toObject(),
                    items: cart.items.map(item => ({
                        ...item,
                        book: item.bookId.toObject(),
                        bookId: undefined
                    }))
                },
                totalItems: cart.totalItems,
                totalPrice: cart.totalPrice
            }
        });

    } catch (err) {
        console.error('Error in addToCart:', err);
        next(err instanceof AppError ? err : new AppError('Failed to add item to cart', 500));
    } finally {
        session.endSession();
    }
}

static async updateCartItem(req, res, next) {
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            const { bookId } = req.params;
            const { quantity } = req.body;

            if (!mongoose.Types.ObjectId.isValid(bookId)) {
                throw new AppError('Invalid book ID', 400);
            }

            const parsedQuantity = parseInt(quantity);
            if (isNaN(parsedQuantity) || parsedQuantity < 1) {
                throw new AppError('Quantity must be at least 1', 400);
            }

            const book = await Book.findById(bookId).session(session);
            if (!book) {
                throw new AppError('Book not found', 404);
            }

            const cart = await Cart.findOne({ 
                $or: [
                    { sessionId: req.sessionID },
                    { userId: req.user?._id }
                ]
            }).session(session);
            
            if (!cart) {
                throw new AppError('Cart not found', 404);
            }

            const itemIndex = cart.items.findIndex(
                item => item.bookId.toString() === bookId
            );

            if (itemIndex === -1) {
                throw new AppError('Item not found in cart', 404);
            }

            // Calculate stock difference
            const currentQuantity = cart.items[itemIndex].quantity;
            const quantityDifference = parsedQuantity - currentQuantity;

            if (book.stockCount < quantityDifference) {
                throw new AppError(`Only ${book.stockCount + currentQuantity} items available in stock`, 400);
            }

            // Update cart item
            cart.items[itemIndex].quantity = parsedQuantity;
            
            // Recalculate totals
            cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
            cart.totalPrice = cart.items.reduce(
                (sum, item) => sum + (item.priceAtAddition * item.quantity), 
                0
            );

            // Reapply coupon if exists
            if (cart.appliedCoupon) {
                const coupon = await Coupon.findById(cart.appliedCoupon).session(session);
                if (coupon) {
                    let discountAmount;
                    if (coupon.discountType === 'percentage') {
                        discountAmount = (cart.totalPrice * coupon.discountValue) / 100;
                    } else {
                        discountAmount = coupon.discountValue;
                    }
                    cart.discountAmount = discountAmount;
                }
            }

            // Update book stock
            if (book.stockCount !== undefined) {
                book.stockCount -= quantityDifference;
                await book.save({ session });
            }

            await cart.save({ session });
        });

        // After transaction succeeds, get updated cart
        const cart = await Cart.findOne({
            $or: [
                { sessionId: req.sessionID },
                { userId: req.user?._id }
            ]
        }).populate({
            path: 'items.bookId',
            select: 'title price coverImage'
        });

        res.status(200).json({
            status: 'success',
            data: {
                cart,
                totalItems: cart.totalItems,
                totalPrice: cart.totalPrice
            }
        });

    } catch (err) {
        console.error('Error in updateCartItem:', err);
        next(err instanceof AppError ? err : new AppError('Failed to update cart item', 500));
    } finally {
        session.endSession();
    }
}

  // Remove item from cart
  static async removeFromCart(req, res, next) {
    try {
      const { bookId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return next(new AppError('Invalid book ID', 400));
      }

      const cart = req.cart || await Cart.findOne({ sessionId: req.sessionID });
      if (!cart) {
        return next(new AppError('Cart not found', 404));
      }

      const initialLength = cart.items.length;
      cart.items = cart.items.filter(
        item => item.bookId.toString() !== bookId
      );

      if (cart.items.length === initialLength) {
        return next(new AppError('Item not found in cart', 404));
      }

      // Recalculate totals
      cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
      cart.totalPrice = cart.items.reduce(
        (sum, item) => sum + (item.priceAtAddition * item.quantity), 
        0
      );

      // Reapply coupon if exists
      if (cart.appliedCoupon) {
        const coupon = await Coupon.findById(cart.appliedCoupon);
        if (coupon) {
          let discountAmount;
          if (coupon.discountType === 'percentage') {
            discountAmount = (cart.totalPrice * coupon.discountValue) / 100;
          } else {
            discountAmount = coupon.discountValue;
          }
          cart.discountAmount = discountAmount;
        }
      }

      await cart.save();

      res.status(200).json({
        status: 'success',
        data: {
          cart,
          totalItems: cart.totalItems,
          totalPrice: cart.totalPrice
        }
      });
    } catch (err) {
      next(new AppError('Failed to remove item from cart', 500));
    }
  }

  // Get cart details
  static async getCartDetails(req, res, next) {
    try {
      const cart = req.cart || await Cart.findOne({ sessionId: req.sessionID })
        .populate({
          path: 'items.bookId',
          select: 'title price coverImage slug'
        });

      const cartData = cart || { items: [], totalItems: 0, totalPrice: 0 };

      res.status(200).render('pages/cart', {
        title: 'Your Shopping Cart',
        cart: cartData,
        currentPage: 'cart'
      });
    } catch (err) {
      next(new AppError('Failed to retrieve cart details', 500));
    }
  }

  // Clear cart
  static async clearCart(req, res, next) {
    try {
      const cart = req.cart || await Cart.findOne({ sessionId: req.sessionID });
      if (!cart) {
        return next(new AppError('Cart not found', 404));
      }

      cart.items = [];
      cart.totalItems = 0;
      cart.totalPrice = 0;
      cart.appliedCoupon = null;
      cart.couponCode = null;
      cart.discountAmount = 0;

      await cart.save();

      res.status(200).json({
        status: 'success',
        message: 'Cart cleared successfully',
        data: {
          cart,
          totalItems: 0,
          totalPrice: 0
        }
      });
    } catch (err) {
      next(new AppError('Failed to clear cart', 500));
    }
  }

  // Get cart status for a specific book
  static async getCartStatus(req, res, next) {
    try {
      const { bookId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return next(new AppError('Invalid book ID', 400));
      }

      const cart = req.cart || await Cart.findOne({ sessionId: req.sessionID });
      
      const inCart = cart?.items.some(item => 
        item.bookId.toString() === bookId
      ) || false;

      res.status(200).json({
        status: 'success',
        data: { inCart }
      });
    } catch (err) {
      next(new AppError('Failed to check cart status', 500));
    }
  }

  // Apply coupon to cart
  static async applyCoupon(req, res, next) {
    try {
      const { couponCode } = req.body;
      
      if (!couponCode) {
        return next(new AppError('Coupon code is required', 400));
      }

      const cart = req.cart || await Cart.findOne({ sessionId: req.sessionID });
      if (!cart) {
        return next(new AppError('Cart not found', 404));
      }

      if (cart.appliedCoupon) {
        return next(new AppError('A coupon is already applied to this cart', 400));
      }

      const coupon = await Coupon.findOne({ 
        code: couponCode,
        validFrom: { $lte: Date.now() },
        validUntil: { $gte: Date.now() }
      });

      if (!coupon) {
        return next(new AppError('Invalid or expired coupon code', 400));
      }

      if (cart.totalPrice < coupon.minimumCartValue) {
        return next(new AppError(`Coupon requires minimum cart value of ${coupon.minimumCartValue}`, 400));
      }

      let discountAmount;
      if (coupon.discountType === 'percentage') {
        discountAmount = (cart.totalPrice * coupon.discountValue) / 100;
      } else {
        discountAmount = coupon.discountValue;
      }

      cart.appliedCoupon = coupon._id;
      cart.couponCode = coupon.code;
      cart.discountAmount = discountAmount;
      cart.totalPrice -= discountAmount;

      await cart.save();

      res.status(200).json({
        status: 'success',
        message: 'Coupon applied successfully',
        data: {
          cart,
          discountAmount,
          totalPrice: cart.totalPrice
        }
      });
    } catch (err) {
      next(new AppError('Failed to apply coupon', 500));
    }
  }

  // Remove coupon from cart
  static async removeCoupon(req, res, next) {
    try {
      const cart = req.cart || await Cart.findOne({ sessionId: req.sessionID });
      if (!cart) {
        return next(new AppError('Cart not found', 404));
      }

      if (!cart.appliedCoupon) {
        return next(new AppError('No coupon applied to this cart', 400));
      }

      // Restore original total price
      cart.totalPrice += cart.discountAmount;
      cart.appliedCoupon = null;
      cart.couponCode = null;
      cart.discountAmount = 0;

      await cart.save();

      res.status(200).json({
        status: 'success',
        message: 'Coupon removed successfully',
        data: {
          cart,
          totalPrice: cart.totalPrice
        }
      });
    } catch (err) {
      next(new AppError('Failed to remove coupon', 500));
    }
  }
}

module.exports = CartController;