const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const cartController = require('../controllers/cartController');
const Book = require('../models/book');
const upload = require('../middleware/SettingsMiddleware');
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

// GET Edit Page
router.get('/:id/edit', async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).send('Book not found');
  res.render('pages/edit-book', { book });
});

// POST Update Book
router.post('/:id/update', async (req, res) => {
  const { title, price } = req.body;
  await Book.findByIdAndUpdate(req.params.id, { title, price });
  res.redirect('/booksmanaging');
});

router.post('/:id/update', upload.single('image'), async (req, res) => {
  try {
    const { title, price } = req.body;
    const updateData = { title, price };

    if (req.file) {
      updateData.imagePath = req.file.filename;
    }

    await Book.findByIdAndUpdate(req.params.id, updateData);
    res.redirect('/booksmanaging');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// Dynamic route for book details MUST come after more specific routes like '/cart'
router.get('/:id', bookController.getBookDetails); 
//router.post('/:id/rating', bookController.addRating);
//router.post('/:id/comments', bookController.addComment);

module.exports = router;