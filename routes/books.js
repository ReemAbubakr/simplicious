const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const cartController = require('../controllers/cartController');
const Book = require('../models/book');
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


// Render the booksmanaging page
router.get('/booksmanaging', async (req, res) => {
  try {
    const books = await Book.find(); // fetch books from MongoDB
    res.render('pages/booksmanaging', { books }); // PASS books to the EJS file
  } catch (error) {
    console.error('Error loading books:', error);
    res.status(500).send('Server Error');
  }
});

// GET Edit Page
router.get('/books/:id/edit', async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).send('Book not found');
  res.render('pages/edit-book', { book });
});

// POST Update Book
router.post('/books/:id/update', async (req, res) => {
  const { title, price } = req.body;
  await Book.findByIdAndUpdate(req.params.id, { title, price });
  res.redirect('/booksmanaging');
});

// Dynamic route for book details MUST come after more specific routes like '/cart'
router.get('/:id', bookController.getBookDetails); 
//router.post('/:id/rating', bookController.addRating);
//router.post('/:id/comments', bookController.addComment);

module.exports = router;