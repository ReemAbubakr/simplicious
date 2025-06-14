const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {
    getRecipes,
    generateMealPlan
} = require('../controllers/Mix-And-MellowController');

// Display planner
router.get('/', async(req, res) => {
    try {
        const meals = await mongoose.model('recipe').aggregate([
            { $match: { type: { $in: ['breakfast', 'lunch', 'dinner'] } } },
            { $sample: { size: 7 } }
        ]);
        res.render('pages/Mix-And-Mellow', {
            title: 'Mix & Mellow',
            meals
        });
    } catch (error) {
        res.status(500).render('pages/500', {
            title: 'Server Error',
            errorDetails: error.message
        });
    }
});

// API Routes
router.get('/recipes', getRecipes);
router.post('/generate-plan', generateMealPlan);

module.exports = router;