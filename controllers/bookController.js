const Book = require('../models/book');

// Helper function to calculate average rating
const calculateAverageRating = (ratings) => {
  if (!Array.isArray(ratings)) return 0;
  const validRatings = ratings.filter(r => typeof r.value === 'number' && r.value >= 1 && r.value <= 5);
  if (validRatings.length === 0) return 0;
  const sum = validRatings.reduce((acc, rating) => acc + rating.value, 0);
  return parseFloat((sum / validRatings.length).toFixed(1));
};

// Helper function to sort by date (newest first)
const sortByNewest = (items) => {
  if (!Array.isArray(items)) return [];
  return [...items].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0);
    const dateB = new Date(b.createdAt || 0);
    return dateB - dateA;
  });
};

const bookController = {
  // GET all books
  getAllBooks: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [books, total] = await Promise.all([
        Book.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Book.countDocuments()
      ]);

      const totalPages = Math.ceil(total / limit);

      res.render('pages/books/list', {
        title: 'All Books',
        books,
        currentPage: 'books',
        flashMessages: req.flash(),
        currentUrl: req.originalUrl,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      });
    } catch (err) {
      console.error('Error fetching books:', err);
      req.flash('error', 'Failed to load books');
      res.status(500).render('pages/500', {
        title: 'Server Error',
        currentPage: '',
        flashMessages: req.flash(),
        currentUrl: req.originalUrl,
        errorDetails: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    }
  },
addRating :async (req, res) => {
  try {
    const { value } = req.body;
    const ratingValue = parseFloat(value);

    // Enhanced validation
    if (isNaN(ratingValue)) {
      req.flash('error', 'Invalid rating format');
      return res.redirect(`/books/${req.params.id}#ratings`);
    }

    if (ratingValue < 1 || ratingValue > 5) {
      req.flash('error', 'Rating must be between 1 and 5');
      return res.redirect(`/books/${req.params.id}#ratings`);
    }

    // Find and update in one operation with atomic updates
    const updatedBook = await Book.findOneAndUpdate(
      { _id: req.params.id },
      { 
        $push: { 
          ratings: { 
            value: ratingValue,
            createdAt: new Date()
          } 
        }
      },
      { 
        new: true, 
        runValidators: true,
        projection: { ratings: 1 } // Only return ratings to save bandwidth
      }
    );

    if (!updatedBook) {
      req.flash('error', 'Book not found');
      return res.redirect('/books');
    }

    // Recalculate average rating
    const averageRating = calculateAverageRating(updatedBook.ratings);
    await Book.updateOne(
      { _id: req.params.id },
      { $set: { averageRating } }
    );

    req.flash('success', 'Thank you for your rating!');
    res.redirect(`/books/${req.params.id}#ratings`);
  } catch (err) {
    console.error('Error in addRating:', err);
    req.flash('error', err.name === 'ValidationError' 
      ? 'Invalid rating value' 
      : 'Failed to add rating');
    res.redirect(`/books/${req.params.id}#ratings`);
  }
},
 
  getBookDetails: async (req, res) => {
    try {
      const book = await Book.findById(req.params.id).lean();

      if (!book) {
        req.flash('error', 'Book not found');
        return res.status(404).render('pages/404', {
          title: 'Book Not Found',
          currentUrl: req.originalUrl,
          currentPage: '',
          flashMessages: req.flash()
        });
      }

      const ratings = Array.isArray(book.ratings) 
        ? book.ratings.filter(r => r.value && r.value >= 1 && r.value <= 5)
        : [];

      const comments = Array.isArray(book.comments) 
        ? book.comments.filter(c => c.text && c.text.trim().length > 0)
        : [];

      const averageRating = calculateAverageRating(ratings);
      const sortedComments = sortByNewest(comments);
      const ratingDistribution = [1, 2, 3, 4, 5].map(star => ({
        star,
        count: ratings.filter(r => Math.round(r.value) === star).length,
        percentage: ratings.length > 0 
          ? Math.round((ratings.filter(r => Math.round(r.value) === star).length / ratings.length) * 100)
          : 0
      }));

      res.render('pages/books/details', {
        title: book.title,
        book: {
          ...book,
          ratings,
          comments: sortedComments,
          averageRating,
          ratingCount: ratings.length,
          ratingDistribution
        },
        currentPage: 'books',
        flashMessages: req.flash(),
        error: req.flash('error')[0] || null,
        currentUrl: req.originalUrl,
        showAddToCart: true
      });
    } catch (err) {
      console.error('Error fetching book details:', err);
      req.flash('error', 'Failed to load book details');
      res.status(500).render('pages/500', {
        title: 'Server Error',
        currentPage: 'books',
        currentUrl: req.originalUrl,
        flashMessages: req.flash(),
        errorDetails: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    }
  },

  // Create a new book
  createBook: async (req, res) => {
    try {
      const book = await Book.create(req.body);
      res.status(201).json({
        status: 'success',
        data: {
          book
        }
      });
    } catch (err) {
      res.status(400).json({
        status: 'error',
        message: err.message
      });
    }
  }
};

module.exports = bookController;