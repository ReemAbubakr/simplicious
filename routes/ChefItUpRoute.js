const express = require('express');
const {
    getChefItUp,
    findRecipes
} = require('../controllers/ChefItUpcontroller');
const router = express.Router();

// Display ingredient selection page
router.get('/', getChefItUp);

// Handle recipe search (used by frontend JS)
router.post('/find', findRecipes);

module.exports = router;