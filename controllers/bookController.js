const Book = require('../models/book');

// Helper function to calculate average rating
const calculateAverageRating = (ratings) => {
  if (!Array.isArray(ratings) )
    return 0;
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

// Get all books with pagination
exports.getAllBooks = async (req, res) => {
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
      title: 'Book List',
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
};

// Get single book details with enhanced data processing
exports.getBookDetails = async (req, res) => {
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

    // Process ratings and comments with additional validation
    const ratings = Array.isArray(book.ratings) 
      ? book.ratings.filter(r => r.value && r.value >= 1 && r.value <= 5)
      : [];
    
    const comments = Array.isArray(book.comments) 
      ? book.comments.filter(c => c.text && c.text.trim().length > 0)
      : [];

    // Calculate statistics
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
      // Add this for cart functionality
      showAddToCart: true
    });
  } catch (err) {
    console.error('Error in getBookDetails:', err);
    req.flash('error', 'Error loading book details');
    res.status(500).render('pages/500', { 
      title: 'Server Error',
      currentPage: '',
      flashMessages: req.flash(),
      currentUrl: req.originalUrl,
      errorDetails: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};
// Get books for cart (used when displaying cart items)
exports.getBooksForCart = async (req, res) => {
  try {
    const { bookIds } = req.query;
    
    if (!bookIds || !Array.isArray(bookIds)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid book IDs' 
      });
    }

    const books = await Book.find({
      _id: { $in: bookIds }
    }).select('title imagePath price');

    res.json({ 
      success: true, 
      books 
    });
  } catch (err) {
    console.error('Error getting books for cart:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error getting books for cart' 
    });
  }
};
// Add rating to a book with enhanced validation
exports.addRating = async (req, res) => {
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
};

// Add comment to a book with enhanced validation and sanitization
exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text || text.trim().length < 3) {
            if (req.accepts('json')) {
                return res.status(400).json({ error: 'Comment must be at least 3 characters long' });
            }
            req.flash('error', 'Comment must be at least 3 characters long');
            return res.redirect(`/books/${req.params.id}#comments`);
        }

        const user = req.session.userName || 'Anonymous';  // Example: get username from session

        const newComment = {
            text: text.trim().substring(0, 500),
            user: user.substring(0, 50),
            createdAt: new Date()
        };

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            { $push: { comments: newComment } },
            { new: true }
        );

        if (!updatedBook) {
            if (req.accepts('json')) {
                return res.status(404).json({ error: 'Book not found' });
            }
            req.flash('error', 'Book not found');
            return res.redirect('/books');
        }

        if (req.accepts('json')) {
            return res.json({ 
                success: true,
                comment: newComment
            });
        }

        req.flash('success', 'Your review has been added!');
        res.redirect(`/books/${req.params.id}#comments`);
    } catch (err) {
        console.error('Error in addComment:', err);
        if (req.accepts('json')) {
            return res.status(500).json({ error: 'Failed to add comment' });
        }
        req.flash('error', 'Failed to add comment');
        res.redirect(`/books/${req.params.id}#comments`);
    }
};
