const mongoose = require('mongoose');

// Recipe Schema
const recipeSchema = new mongoose.Schema({
  // Basic recipe information
  title: {
    type: String,
    required: [true, 'Recipe must have a title'],
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  
  // Recipe details
  ingredients: [{
    type: String,
    required: [true, 'Recipe must have ingredients']
  }],
  instructions: [{
    type: String,
    required: [true, 'Recipe must have instructions']
  }],
  
  // Time and servings
  prepTime: {
    type: String,
    required: [true, 'Recipe must have prep time']
  },
  totalTime: {
    type: String,
    required: [true, 'Recipe must have total time']
  },
  serves: {
    type: String,
    required: [true, 'Recipe must specify servings']
  },
  
  // Categories and tags
  tags: [{
    type: String
  }],
  
  // User relationship
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Recipe must belong to a user']
  },
  
  // Favorite status
  isFavorite: {
    type: Boolean,
    default: false
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better search performance
recipeSchema.index({ title: 'text', tags: 'text' });

// Create Recipe model
const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe; 