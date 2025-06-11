
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

// Approve a recipe
exports.approveRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    await Recipe.findByIdAndUpdate(recipeId, { status: 'Approved' });
    res.redirect('/manage-recipes');
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
  res.render('pages/recipes/categories', { categories });
};

// Show recipes by category (e.g., Breakfast)
exports.showRecipesByCategory = async (req, res) => {
  try {
    const type = req.params.type;
    const recipes = await Recipe.find({ type });
    res.render('pages/recipes/recipesByCategory', { type, recipes });
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
    res.render('pages/recipes/recipeDetail', { recipe });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading recipe');
  }
};
