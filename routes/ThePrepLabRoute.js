const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Add this line

router.get('/', async(req, res) => { // Make async
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
                path: "/mix-mellow",
                image: "/images/meal-planner.jpg",
                alt: "Weekly meal planner"
            }
        ];

        // Add featured recipes (optional)
        const featuredRecipes = await mongoose.model('recipe').find().limit(3);

        res.render('home', {
            title: 'The Prep Lab',
            features,
            featuredRecipes // Pass to EJS
        });
    } catch (err) {
        res.status(500).render('error');
    }
});

module.exports = router;