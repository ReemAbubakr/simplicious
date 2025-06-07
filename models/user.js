const mongoose = require('mongoose');
const validator = require('validator'); // For email validation

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add any additional methods or middleware you need
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  // Your password comparison logic
};

const User = mongoose.model('User', userSchema);

module.exports = User;