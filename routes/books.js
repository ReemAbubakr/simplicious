const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const cartController = require('../controllers/cartController');
router.use(cartController.getCart)
// Get all books
router.get('/', bookController.getAllBooks);

// Get single book details
router.get('/:id', bookController.getBookDetails);

// Add rating
// router.post('/:id/rating', bookController.addRating);

// Add comment
// router.post('/:id/comments', bookController.addComment);
router.get('/cart', cartController.getCartDetails);
router.post('/cart/add/:bookId', cartController.addToCart);
router.put('/cart/:bookId', cartController.updateCartItem);
router.delete('/cart/:bookId', cartController.removeFromCart);
router.delete('/cart', cartController.clearCart);

// API endpoint to get books for cart
//router.get('/api/books/cart', bookController.getBooksForCart);


module.exports = router;