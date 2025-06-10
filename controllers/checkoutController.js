const Cart = require('../models/cart');
const Order = require('../models/order');
const Book = require('../models/book');
const AppError = require('../utils/AppError');
const mongoose = require('mongoose');

let emailService;
try {
  emailService = require('../services/emailService');
} catch (err) {
  console.warn('Email service not available:', err.message);
  emailService = {
    sendOrderConfirmationEmail: () => {
      console.log('Email service would send confirmation here');
      return Promise.resolve();
    }
  };
}

class CheckoutController {
  static async getCheckoutPage(req, res, next) {
    try {
      const cart = await Cart.findOne({
        $or: [
          { sessionId: req.sessionID },
          { userId: req.user?._id }
        ]
      }).populate({
        path: 'items.bookId',
        select: 'title price coverImage'
      });

      if (!cart || cart.items.length === 0) {
        req.flash('info', 'Your cart is empty');
        return res.redirect('/cart');
      }

      const subtotal = cart.items.reduce((sum, item) => sum + (item.priceAtAddition * item.quantity), 0);
      const discount = cart.items.reduce((sum, item) => sum + (item.discountAmount || 0), 0);
      const total = subtotal - discount;

      res.render('pages/checkout', {
        title: 'Checkout',
        cart,
        pricing: {
          subtotal,
          discount,
          total
        },
        currentPage: 'checkout',
        user: req.user || null,
        flashMessages: req.flash()
      });
    } catch (err) {
      console.error('Checkout page error:', err);
      next(new AppError('Failed to load checkout page', 500));
    }
  }

  static async processCheckout(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { shippingAddress, paymentMethod, notes, email, name, cartItems } = req.body;

      if (!shippingAddress || !paymentMethod) {
        throw new AppError('Shipping address and payment method are required', 400);
      }

      if (!req.user && (!email || !name)) {
        throw new AppError('Email and name are required for guest checkout', 400);
      }

      let itemsToProcess = [];
      let cart = null;

      if (cartItems && Array.isArray(cartItems) && cartItems.length > 0) {
        const validItems = cartItems.filter(item => item?._id && item?.quantity && item?.price);
        if (validItems.length !== cartItems.length) {
          throw new AppError('Some cart items are invalid', 400);
        } 
        itemsToProcess = validItems;
      } else {
        cart = await Cart.findOne({
          $or: [
            { sessionId: req.sessionID },
            { userId: req.user?._id }
          ]
        }).populate({
          path: 'items.bookId',
          select: 'title price stock'
        }).session(session);

        if (!cart || cart.items.length === 0) {
          throw new AppError('Your cart is empty', 400);
        }

        itemsToProcess = cart.items.map(item => ({
          _id: item.bookId._id,
          title: item.bookId.title,
          price: item.bookId.price,
          quantity: item.quantity,
          bookId: item.bookId
        }));
      }

      const validatedItems = itemsToProcess.map(item => {
        const priceStr = String(item.price || '').trim();
        const price = parseFloat(priceStr.replace(/[^0-9.-]/g, ''));
        const quantity = parseInt(item.quantity, 10);

        if (isNaN(price) || price <= 0) {
          throw new AppError(`Invalid price for item: ${item.title || item._id}`, 400);
        }
        if (isNaN(quantity) || quantity <= 0) {
          throw new AppError(`Invalid quantity for item: ${item.title || item._id}`, 400);
        }

        if (item.bookId && item.bookId.stock < quantity) {
          throw new AppError(`Insufficient stock for item: ${item.title || item._id}`, 400);
        }

        return {
          book: item._id,
          title: item.title,
          quantity,
          price,
          subtotal: price * quantity
        };
      });

      const subtotal = validatedItems.reduce((sum, item) => sum + item.subtotal, 0);

      const orderData = {
        items: validatedItems,
        subtotal,
        shippingAddress,
        paymentMethod,
        notes,
        status: 'processing',
        email: req.user?.email || email,
        ...(req.user ? { user: req.user._id } : { guestName: name })
      };

      const order = new Order(orderData);
      await order.save({ session });

      if (!cartItems && cart) {
        for (const item of itemsToProcess) {
          if (item.bookId) {
            item.bookId.stock -= item.quantity;
            await item.bookId.save({ session });
          }
        }

        await Cart.findByIdAndDelete(cart._id, { session });
      }

      await session.commitTransaction();

      const recipientEmail = req.user?.email || email;
      if (recipientEmail) {
        emailService.sendOrderConfirmationEmail({
          email: recipientEmail,
          orderId: order._id,
          items: order.items,
          total: order.subtotal,
          name: req.user?.name || name
        }).catch(err => {
          console.error('Failed to send email:', err);
        });
      }

      res.redirect(`/order-confirmation/${order._id}`);
    } catch (err) {
      await session.abortTransaction();
      console.error('Checkout error:', err);

      if (err instanceof AppError) {
        req.flash('error', err.message);
      } else {
        req.flash('error', 'Checkout failed. Please try again.');
      }

      res.redirect('/checkout');
    } finally {
      session.endSession();
    }
  }

  static async getOrderConfirmation(req, res, next) {
    try {
      const { orderId } = req.params;

      const order = await Order.findById(orderId)
        .populate('user', 'name email')
        .populate('items.book', 'title coverImage');

      if (!order) {
        req.flash('error', 'Order not found');
        return res.redirect('/');
      }

      if (!req.user) {
        req.session.guestOrders = req.session.guestOrders || [];
        if (!req.session.guestOrders.includes(orderId)) {
          req.session.guestOrders.push(orderId);
        }
      }

      const isAuthorized = req.user
        ? order.user && order.user._id.equals(req.user._id)
        : req.session.guestOrders.includes(orderId);

      if (!isAuthorized) {
        req.flash('error', 'You are not authorized to view this order');
        return res.redirect('/');
      }

      res.render('pages/order-confirmation', {
        title: 'Order Confirmation',
        currentPage: '',
        order,
        isGuest: !req.user,
        email: order.email
      });
    } catch (err) {
      next(new AppError('Failed to load order confirmation', 500));
    }
  }

  static async getOrderDetails(req, res, next) {
    try {
      const { orderId } = req.params;

      const order = await Order.findById(orderId)
        .populate('user', 'name email')
        .populate('items.book', 'title price coverImage');

      if (!order) {
        return next(new AppError('Order not found', 404));
      }

      const isAuthorized = req.user
        ? order.user && order.user._id.equals(req.user._id)
        : req.session.guestOrders?.includes(orderId);

      if (!isAuthorized) {
        return next(new AppError('Unauthorized to view this order', 403));
      }

      res.status(200).json({
        status: 'success',
        data: {
          order
        }
      });
    } catch (err) {
      next(new AppError('Failed to retrieve order details', 500));
    }
  }
}

module.exports = CheckoutController;
