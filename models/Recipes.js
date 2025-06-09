const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  ingredients: [String],
  steps: [String],
  image: String 
});

module.exports = mongoose.models.Recipe || mongoose.model('Recipe', recipeSchema);
