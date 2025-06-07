const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'A book must have a title'],
    trim: true,
    unique: true
  },
  author: {
    type: String,
    required: [true, 'A book must have an author']
  },
  description: String,
  price: {
    type: Number,
    required: [true, 'A book must have a price'],
    min: [0, 'Price must be above 0']
  },
  coverImage: {
    type: String,
    required: [true, 'A book must have a cover image']
  },
  categories: [{
    type: String,
    enum: ['French', 'Italian', 'Science', 'Techniques', 'Fundamentals', 'American']
  }],
  chefRecommended: {
    type: Boolean,
    default: false
  },
  stockQuantity: {
    type: Number,
    default: 10,
    min: [0, 'Stock cannot be negative']
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: val => Math.round(val * 10) / 10
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
bookSchema.index({ price: 1, ratingsAverage: -1 });
bookSchema.index({ title: 'text' });

// Virtual populate reviews (if you add reviews later)
bookSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'book',
  localField: '_id'
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;