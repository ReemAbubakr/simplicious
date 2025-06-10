// routes/checkoutRoutes.js
const express = require('express');
const router = express.Router();  // This is what was missing
const CheckoutController = require('../controllers/checkoutController');

router.get('/', CheckoutController.getCheckoutPage);
router.post('/submit', CheckoutController.processCheckout); // <-- This is important
router.get('/order-confirmation/:orderId', CheckoutController.getOrderConfirmation);
router.get('/details/:orderId', CheckoutController.getOrderDetails);

module.exports = router;

// Get order details API endpoint
router.get('/api/orders/:orderId', CheckoutController.getOrderDetails);

module.exports = router;