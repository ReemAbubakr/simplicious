const express = require('express');
const router = express.Router();
const BookController = require('../controllers/bookController');
const Book = require('../models/book');
const upload = require('../middleware/SettingsMiddleware');


// Get all books
router.get('/', BookController.getAllBooks);

// Get single book details
router.get('/:id', BookController.getBookDetails);



// POST /books/:id/comments - Add a new comment
router.post('/:id/comments', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const { user, text } = req.body;
        
        if (!text) {
            return res.status(400).json({ message: 'Comment text is required' });
        }

        const newComment = {
            user: user?user : 'Guest', // Default to 'Guest' if no user provided
            text,
            createdAt: new Date()
        };

        book.comments.unshift(newComment); // Add to beginning of array
        await book.save();

        res.status(201).json({ 
            message: 'Comment added successfully',
            comment: newComment
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Server error while adding comment' });
    }
});

// POST a new rating
router.post('/:id/ratings', async (req, res) => {
  try {
    const { value } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Add the new rating (your schema enforces min/max values)
    book.ratings.push({ value });
    await book.save(); // This triggers your `pre('save')` hook to update averageRating

    res.json({
      success: true,
      averageRating: book.averageRating,
      ratingCount: book.ratingCount
    });

  } catch (err) {
    console.error('Error adding rating:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

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

module.exports = router;
router.post('/:id/rating', BookController.addRating);


// Add rating
//  router.post('/:id/rating', bookController.addRating);

// // Add comment
// // router.post('/:id/comments', bookController.addComment);
// router.get('/cart', cartController.getCartDetails);
// router.post('/cart/add/:bookId', cartController.addToCart);
// router.put('/cart/:bookId', cartController.updateCartItem);
// router.delete('/cart/:bookId', cartController.removeFromCart);
// router.delete('/cart', cartController.clearCart);

// // API endpoint to get books for cart
// //router.get('/api/books/cart', bookController.getBooksForCart);


module.exports = router;