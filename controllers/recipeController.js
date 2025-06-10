const Recipe = require('../models/recipe');
const generateFullRecipe = require('../recipeGenerator');

// Get all recipes
exports.getAllRecipes = async (req, res) => {
  try {
    // Find all recipes
    const recipes = await Recipe.find();
    
    // Send response
    res.status(200).json({
      status: 'success',
      message: 'Recipes retrieved successfully',
      count: recipes.length,
      recipes
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: 'Error retrieving recipes'
    });
  }
};

// Get random recipe
exports.getRandomRecipe = async (req, res) => {
  try {
    // Generate a random recipe
    const recipe = generateFullRecipe();
    
    // Send response
    res.status(200).json({
      status: 'success',
      message: 'Random recipe generated successfully',
      recipe
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: 'Error generating random recipe'
    });
  }
};

// Create recipe
exports.saveRecipe = async (req, res) => {
  try {
    // Use only req.body for recipe data
    const recipeData = req.body;
    // Create new recipe
    const recipe = await Recipe.create(recipeData);
    // Send response
    res.status(201).json({
      status: 'success',
      message: 'Recipe saved successfully',
      recipe
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: 'Error saving recipe'
    });
  }
};

// Update recipe
exports.updateRecipe = async (req, res) => {
  try {
    // Find recipe by ID
    const recipe = await Recipe.findById(req.params.id);
    
    // Check if recipe exists
    if (!recipe) {
      return res.status(404).json({
        status: 'error',
        message: 'Recipe not found'
      });
    }
    
    // Check if user owns the recipe
    if (recipe.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only update your own recipes'
      });
    }
    
    // Update recipe
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    // Send response
    res.status(200).json({
      status: 'success',
      message: 'Recipe updated successfully',
      recipe: updatedRecipe
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: 'Error updating recipe'
    });
  }
};

// Delete recipe
exports.deleteRecipe = async (req, res) => {
  try {
    // Find recipe by ID
    const recipe = await Recipe.findById(req.params.id);
    
    // Check if recipe exists
    if (!recipe) {
      return res.status(404).json({
        status: 'error',
        message: 'Recipe not found'
      });
    }
    
    // Check if user owns the recipe
    if (recipe.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only delete your own recipes'
      });
    }
    
    // Delete recipe
    await Recipe.findByIdAndDelete(req.params.id);
    
    // Send response
    res.status(200).json({
      status: 'success',
      message: 'Recipe deleted successfully'
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: 'Error deleting recipe'
    });
  }
};

// Toggle favorite status
exports.toggleFavorite = async (req, res) => {
  try {
    // Find recipe by ID
    const recipe = await Recipe.findById(req.params.id);
    
    // Check if recipe exists
    if (!recipe) {
      return res.status(404).json({
        status: 'error',
        message: 'Recipe not found'
      });
    }
    
    // Toggle favorite status
    recipe.isFavorite = !recipe.isFavorite;
    await recipe.save();
    
    // Send response
    res.status(200).json({
      status: 'success',
      message: recipe.isFavorite ? 'Recipe added to favorites' : 'Recipe removed from favorites',
      recipe
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: 'Error updating favorite status'
    });
  }
};

// Get user's favorite recipes
exports.getFavoriteRecipes = async (req, res) => {
  try {
    // Find user's favorite recipes
    const recipes = await Recipe.find({
      createdBy: req.user.id,
      isFavorite: true
    });
    
    // Send response
    res.status(200).json({
      status: 'success',
      message: 'Favorite recipes retrieved successfully',
      count: recipes.length,
      recipes
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: 'Error retrieving favorite recipes'
    });
  }
}; 