const express = require('express');
const {
    getChefItUpPage,
    findRecipes
} = require('../controllers/ChefItUpcontroller');
const router = express.Router();

// Display ingredient selection page
router.get('/', getChefItUpPage);

// Handle recipe search (used by frontend JS)
router.post('/find', findRecipes);

module.exports = router;