const express = require('express');
const recipeController = require('../controllers/recipeController');
// const authController = require('../controllers/authController');

const router = express.Router();

// Remove protection for all recipe routes
// router.use(authController.protect);
// Home page
router.get('/random-recipe', recipeController.getRandomRecipe);
// Recipe routes
router.get('/', recipeController.getAllRecipes);
router.get('/random', recipeController.getRandomRecipe);
router.post('/', recipeController.saveRecipe);
router.get('/favorites', recipeController.getFavoriteRecipes);
// Category pages (e.g., /recipes/breakfast)
router.get('/:type', recipeController.getRecipesByType);
router.get('/:type/:id', recipeController.getRecipeDetails);



// Recipe routes with ID
router.patch('/:id', recipeController.updateRecipe);
router.delete('/:id', recipeController.deleteRecipe);
router.patch('/:id/favorite', recipeController.toggleFavorite);

module.exports = router; 