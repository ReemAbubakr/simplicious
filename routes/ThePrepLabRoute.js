const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async(req, res) => {
    try {
        const features = [{
                title: "Chef It Up",
                path: "/chef-it-up",
                image: "/images/chef-it-up.jpg",
                alt: "Find recipes with your ingredients"
            },
            {
                title: "Feelin' Risky",
                path: "/feelin-risky",
                image: "/images/mystery-dish.jpg",
                alt: "Random recipe generator"
            },
            {
                title: "Mix & Mellow",
                path: "/mix-and-mellow",
                image: "/images/meal-planner.jpg",
                alt: "Weekly meal planner"
            }
        ];

        const featuredRecipes = await mongoose.model('recipe').find().limit(3);

        res.render('pages/ThePrepLab', {
            title: 'The Prep Lab',
            features,
            featuredRecipes
        });
    } catch (err) {
        console.error('❌ Error loading features:', err);
        res.status(500).render('pages/500', {
            title: 'Server Error',
            errorDetails: err.message
        });
    }
});

module.exports = router;