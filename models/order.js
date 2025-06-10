const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    title: String,
    quantity: Number,
    price: Number,
    subtotal: Number
  }],
  subtotal: Number,
  shippingAddress: Object,
  paymentMethod: String,
  status: { type: String, default: 'processing' },
  createdAt: { type: Date, default: Date.now }
});

// Prevent model overwrite error
module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);