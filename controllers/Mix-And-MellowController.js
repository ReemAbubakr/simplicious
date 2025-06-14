const Recipe = require('../models/recipe');
const User = require('../models/user');

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

exports.getUserMealPlans = async(req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Please log in to view your meal plans" });
        }

        const user = await User.findById(req.user._id).select('mealPlans');
        res.json(user.mealPlans || []);
    } catch (error) {
        res.status(500).json({
            error: "Failed to load meal plans",
            details: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
};

exports.saveMealPlan = async(req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Please log in to save meal plans" });
        }

        const { plan, name = 'Weekly Meal Plan' } = req.body;

        // Validate and format the plan
        const formattedPlan = new Map();
        for (const [dayMeal, mealData] of Object.entries(plan)) {
            if (mealData.mealId) {
                formattedPlan.set(dayMeal, {
                    mealId: mealData.mealId,
                    mealName: mealData.mealName,
                    mealEmoji: mealData.mealEmoji,
                    mealTime: mealData.mealTime
                });
            }
        }

        // Save to user's account
        const user = await User.findById(req.user._id);
        user.mealPlans.push({
            name,
            plan: formattedPlan
        });
        await user.save();

        res.json({
            success: true,
            message: "Meal plan saved successfully"
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to save plan",
            details: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
};