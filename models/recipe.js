const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
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
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  pageLink: {
    type: String, 
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'dinner', 'dessert', 'keto', 'cocktails'],
    lowercase: true,
    trim: true
  },
  ingredients: {
    type: [String],

  },
  instructions: {
    type: [String],
    
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'recipes',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

recipeSchema.virtual('createdAtFormatted').get(function () {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

recipeSchema.index({ title: 'text', description: 'text' }); 
recipeSchema.index({ type: 1 }); 
recipeSchema.index({ createdAt: -1 });

module.exports = mongoose.models.recipe || mongoose.model('recipe', recipeSchema);
