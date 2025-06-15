const Recipe = require('../models/recipe');

exports.getRecipes = async(req, res) => {
    try {
        const recipes = await Recipe.find({ approved: true })
            .select('name ingredients imageUrl prepTime');
        res.json(recipes);
    } catch (error) {
        res.status(500).json({
            error: "Failed to load recipes",
            details: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
};

exports.saveMealPlan = async(req, res) => {
    try {
        const { plan } = req.body; // Format: { "monday-lunch": "recipeId123", ... }

        // Validate recipe IDs
        const recipeIds = Object.values(plan);
        const validRecipes = await Recipe.countDocuments({
            _id: { $in: recipeIds }
        });

        if (validRecipes !== recipeIds.length) {
            return res.status(400).json({ error: "Invalid recipe IDs" });
        }

        // Save to database (example using session)
        req.session.mealPlan = plan;

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({
            error: "Failed to save plan",
            details: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
};