const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Check if book is in cart
router.get('/api/status/:bookId', cartController.getCartStatus);

// API Endpoints
router.post('/api/add', cartController.addToCart);
router.get('/', cartController.getCartContents);
router.post('/api/remove', cartController.removeFromCart);

// View Endpoint
// router.get('/cart', cartController.viewCart);

module.exports = router;
