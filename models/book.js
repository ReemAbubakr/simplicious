const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userName: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 50 
  },
  text: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 500 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const ratingSchema = new mongoose.Schema({
  value: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const bookSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100 
  },
  imagePath: { 
    type: String, 
    required: true 
  },
  altText: { 
    type: String,
    trim: true,
    maxlength: 100 
  },
  description: { 
    type: String,
    trim: true,
    maxlength: 2000 
  },
  price: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        // Validate that the string can be parsed to a number
        return !isNaN(parseFloat(v)) && isFinite(v);
      },
      message: props => `${props.value} is not a valid price!`
    }
  },
  ratingCount: { 
    type: Number, 
    default: 0 
  },
  averageRating: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 5 
  },
  ratings: [ratingSchema],
  comments: [commentSchema],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  collection: 'books',  // Correct place to set collection name
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted creation date
bookSchema.virtual('createdAtFormatted').get(function() {
  if (!this.createdAt) return '';
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for parsed price (number)
bookSchema.virtual('priceNumber').get(function() {
  return parseFloat(this.price);
});

// Calculate average rating when ratings change
bookSchema.pre('save', function(next) {
  if (this.ratings && this.ratings.length > 0) {
    const sum = this.ratings.reduce((total, rating) => total + rating.value, 0);
    this.averageRating = parseFloat((sum / this.ratings.length).toFixed(1));
    this.ratingCount = this.ratings.length;
  } else {
    this.averageRating = 0;
    this.ratingCount = 0;
  }
  next();
});

// Indexes for better performance
bookSchema.index({ title: 'text' });
bookSchema.index({ averageRating: -1 });
bookSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Book', bookSchema);