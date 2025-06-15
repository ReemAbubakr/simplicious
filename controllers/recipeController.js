
const Recipe = require('../models/recipe');

// Get all recipes (for manage-recipes page)
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.render('pages/manage-recipes', { recipes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Delete a recipe
exports.deleteRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    await Recipe.findByIdAndDelete(recipeId);
    res.redirect('/manage-recipes');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Show edit form for a recipe
exports.showEditForm = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).send('Recipe not found');
    }
    res.render('pages/edit-recipe', { recipe }); // You’ll create this view
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Handle recipe update from edit form
exports.updateRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const { title, description, ingredients, steps } = req.body;

    await Recipe.findByIdAndUpdate(recipeId, {
      title,
      description,
      ingredients: ingredients.split(',').map(i => i.trim()),  // if comma-separated input
      steps: steps.split(',').map(s => s.trim()),
    });

    res.redirect('/manage-recipes');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};// Show category selection page
exports.showCategories = (req, res) => {
  const categories = ['breakfast', 'lunch', 'dinner', 'dessert', 'keto', 'cocktails'];
  res.render('pages/RECIPES/recipebycat', { categories });
};

// Show recipes by category (e.g., Breakfast)
exports.showRecipesByCategory = async (req, res) => {
  try {
    const type = req.params.type;
    const recipes = await Recipe.find({ type });
    res.render('pages/recipes/recipesByCategory', { 
      type, 
      recipes, 
      currentPage: 'recipes',
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Recipes`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading category');
  }
};

// Show individual recipe details
exports.showRecipeDetails = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).send('Recipe not found');
    res.render('pages/recipes/recipeDetail', { 
      recipe,
      currentPage: 'recipes',
      title: recipe.title
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading recipe');
  }
};

// Create recipe
exports.saveRecipe = async (req, res) => {
  try {
    
    const newRecipe = new Recipe({
      title: req.body.title,
      imagePath: req.body.imagePath,
      description: req.body.description,
      type: req.body.type,
      // Validating the input as a string to safely apply the split() function and avoid errors.
      ingredients: typeof req.body.ingredients === 'string'
        ? req.body.ingredients.split(',').map(i => i.trim()).filter(i => i)
        : req.body.ingredients,
      instructions: typeof req.body.instructions === 'string'
        ? req.body.instructions.split(',').map(s => s.trim()).filter(s => s)
        : req.body.instructions,
    });

    await newRecipe.save();
    
    // Send response
    res.status(201).json({
      status: 'success',
      message: 'Recipe saved successfully',
    });

    res.redirect('/manage-recipes');
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: 'Error saving recipe',
      error: err.message
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