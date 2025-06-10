const express = require('express');
const recipeController = require('../controllers/recipeController');
// const authController = require('../controllers/authController');

const router = express.Router();

// Remove protection for all recipe routes
// router.use(authController.protect);

// Recipe routes
router.get('/', recipeController.getAllRecipes);
router.get('/random', recipeController.getRandomRecipe);
router.post('/', recipeController.saveRecipe);
router.get('/favorites', recipeController.getFavoriteRecipes);

// Recipe routes with ID
router.patch('/:id', recipeController.updateRecipe);
router.delete('/:id', recipeController.deleteRecipe);
router.patch('/:id/favorite', recipeController.toggleFavorite);

module.exports = router; 