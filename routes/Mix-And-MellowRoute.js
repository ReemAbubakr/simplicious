const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { protect } = require('../middleware/authMiddleware');
const {
    getRecipes,
    getUserMealPlans,
    saveMealPlan
} = require('../controllers/Mix-And-MellowController');

// Display planner
router.get('/', protect, async(req, res) => {
    try {
        const meals = await mongoose.model('recipe').aggregate([
            { $match: { type: { $in: ['breakfast', 'lunch', 'dinner'] } } },
            { $sample: { size: 7 } }
        ]);
        res.render('pages/Mix-And-Mellow', {
            title: 'Mix & Mellow',
            meals,
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            mealTypes: ['Breakfast', 'Lunch', 'Dinner'],
            user: req.user
        });
    } catch (err) {
        res.status(500).render('error');
    }
});

// Get user's saved meal plans
router.get('/plans', protect, getUserMealPlans);

// Save plan
router.post('/save', protect, saveMealPlan);

module.exports = router;