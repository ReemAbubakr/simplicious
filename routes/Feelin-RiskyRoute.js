const express = require('express');
const {
    getRiskyPage,
    getRandomRecipe
} = require('controllers\Feelin-RiskyController.js');
const router = express.Router();

// Display game page
router.get('/', getRiskyPage);

// API endpoint for random recipe (used by frontend JS)
router.get('/random', getRandomRecipe);

module.exports = router;