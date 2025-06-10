// File: routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Cart = require('../models/cart');
const Book = require('../models/book');
const AppError = require('../utils/AppError');

// Middleware to get or create cart for session/user
const getCart = async (req, res, next) => {
  try {
    let cart;
    const filter = { sessionId: req.sessionID };

    // For authenticated users
    if (req.user) {
      filter.$or = [
        { sessionId: req.sessionID },
        { userId: req.user._id }
      ];
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

    // If user logged in, update cart ownership
    if (req.user && !cart.userId) {
      cart.userId = req.user._id;
      await cart.save();
    }

    req.cart = cart;
    next();
  } catch (err) {
    next(new AppError('Error processing cart', 500));
  }
};

// Apply cart middleware to all cart routes
router.use(getCart);

// View cart page
router.get('/cart', async (req, res, next) => {
  try {
    res.render('pages/cart', {
      title: 'Shopping Cart',
      cart: req.cart,
      currentPage: 'cart',
      flashMessages: req.flash()
    });
  } catch (err) {
    next(new AppError('Failed to load cart', 500));
  }
});

// Checkout page
router.get('/checkout', async (req, res, next) => {
  try {
    // Validate cart has items
    if (!req.cart.items.length) {
      req.flash('error', 'Your cart is empty');
      return res.redirect('/cart');
    }

    res.render('pages/checkout', {
      title: 'Checkout',
      cart: req.cart,
      currentPage: 'checkout',
      user: req.user || null
    });
  } catch (err) {
    next(new AppError('Failed to load checkout page', 500));
  }
});

// Process checkout
router.post('/checkout', async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { name, email, address, paymentMethod } = req.body;

    // Validate required fields
    if (!name || !email || !address) {
      await session.abortTransaction();
      req.flash('error', 'Please fill in all required fields');
      return res.redirect('/checkout');
    }

    // Verify cart contents
    const cart = await Cart.findById(req.cart._id)
      .populate('items.bookId')
      .session(session);

    if (!cart.items.length) {
      await session.abortTransaction();
      req.flash('error', 'Your cart is empty');
      return res.redirect('/cart');
    }

    // Validate stock and update inventory
    const bulkOps = [];
    for (const item of cart.items) {
      if (item.bookId.stockCount < item.quantity) {
        await session.abortTransaction();
        req.flash('error', `${item.bookId.title} is out of stock`);
        return res.redirect('/cart');
      }
      bulkOps.push({
        updateOne: {
          filter: { _id: item.bookId._id },
          update: { $inc: { stockCount: -item.quantity } }
        }
      });
    }

    await Book.bulkWrite(bulkOps, { session });

    // Create order (pseudo-code - implement your Order model)
    const orderData = {
      items: cart.items.map(item => ({
        book: item.bookId._id,
        title: item.bookId.title,
        quantity: item.quantity,
        price: item.priceAtAddition
      })),
      total: cart.totalPrice,
      shippingAddress: address,
      paymentMethod,
      email,
      ...(req.user ? { user: req.user._id } : { guestName: name })
    };

    // Save order to database
    // const order = await Order.create([orderData], { session });
    
    // Clear cart
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save({ session });

    await session.commitTransaction();

    // Send confirmation email (pseudo-code)
    // await sendConfirmationEmail(email, orderData);

    req.flash('success', 'Order placed successfully!');
    res.redirect('/order-confirmation');
  } catch (err) {
    await session.abortTransaction();
    console.error('Checkout error:', err);
    req.flash('error', 'Checkout failed. Please try again.');
    res.redirect('/checkout');
  } finally {
    session.endSession();
  }
});

module.exports = router;
