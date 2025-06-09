const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true // Keep this unique for session-based carts
  },
  items: [cartItemSchema],
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Cart expires after 1 day (in seconds)
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
    strict: 'throw'
});

// Virtual for total items in cart
cartSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for total price (requires population of book details)
cartSchema.virtual('totalPrice').get(function() {
  if (!this.items || this.items.length === 0) return 0;
  return this.items.reduce((total, item) => {
    // Make sure to populate bookId.price before using this virtual
    return total + (item.bookId.price * item.quantity);
  }, 0);
});

module.exports = mongoose.model('Cart', cartSchema);