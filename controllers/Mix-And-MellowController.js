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

exports.generateMealPlan = async(req, res) => {
    try {
        const { plan } = req.body;

        // Validate and format the plan
        const formattedPlan = {};
        for (const [dayMeal, mealData] of Object.entries(plan)) {
            if (mealData.mealId) {
                formattedPlan[dayMeal] = {
                    mealId: mealData.mealId,
                    mealName: mealData.mealName,
                    mealEmoji: mealData.mealEmoji,
                    mealTime: mealData.mealTime
                };
            }
        }

        res.json({
            success: true,
            plan: formattedPlan
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to generate plan",
            details: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
};