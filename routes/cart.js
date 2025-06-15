const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Check if book is in cart
router.get('/api/status/:bookId', cartController.getCartStatus);

// API Endpoints
router.post('/api/add', cartController.addToCart);
router.get('/', cartController.getCartContents);
router.post('/api/remove', cartController.removeFromCart);

router.post('/clear', cartController.clearCart);


router.post('/clear', cartController.clearCart);



module.exports = router;