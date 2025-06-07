const express = require('express');
const Book = require('../models/book');
const router = express.Router();

// GET all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().lean();
    res.render('pages/book', {
      title: 'Our Books',
      currentPage: 'Books',
      books
    });
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).render('pages/500', {
      title: 'Server Error',
      errorDetails: 'Failed to load books'
    });
  }
});

module.exports = router;