const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const cartController = require('../controllers/cartController');

// Apply cart middleware to all routes that need it
router.use(cartController.getCart);

// --- Static routes should come BEFORE dynamic routes ---

// Cart routes
router.get('/cart', cartController.getCartDetails);
router.post('/cart/add/:bookId', cartController.addToCart);
router.delete('/cart/:bookId', cartController.removeFromCart);
router.delete('/cart', cartController.clearCart);

// API endpoint to get books for cart
//router.get('/api/books/cart', bookController.getBooksForCart);


// --- Book routes (static first, then dynamic) ---

// This handles the root of the router, e.g., GET /books/
router.get('/', bookController.getAllBooks); 

// Dynamic route for book details MUST come after more specific routes like '/cart'
router.get('/:id', bookController.getBookDetails); 
//router.post('/:id/rating', bookController.addRating);
//router.post('/:id/comments', bookController.addComment);

module.exports = router;
