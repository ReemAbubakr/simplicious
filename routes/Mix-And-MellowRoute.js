const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Display planner
router.get('/', async(req, res) => {
    try {
        const meals = await mongoose.model('recipe').aggregate([
            { $match: { type: { $in: ['breakfast', 'lunch', 'dinner'] } } },
            { $sample: { size: 7 } }
        ]);

        res.render('mix-and-mellow', {
            meals,
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            mealTypes: ['Breakfast', 'Lunch', 'Dinner']
        });
    } catch (err) {
        res.status(500).render('error');
    }
});

// Save plan
router.post('/save', async(req, res) => {
    try {
        // Implement your save logic here
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save plan' });
    }
});

module.exports = router;