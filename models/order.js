const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  sessionId: { type: String, required: true }, // session-based!
  books: [
    {
      book: String,
      imagePath: String,
      quantity: Number,
      price: String
    }
  ],
  name: String,
  email: String,
  address: String,
  payment: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);