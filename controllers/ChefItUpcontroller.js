const Recipe = require('../models/recipe');

exports.getChefItUp = async(req, res) => {
    try {
        const ingredients = [
            { name: 'Chicken', emoji: '🍗' },
            { name: 'Tomatoes', emoji: '🍅' },
            { name: 'Onions', emoji: '🧅' },
            { name: 'Garlic', emoji: '🧄' },
            { name: 'Rice', emoji: '🍚' },
            { name: 'Pasta', emoji: '🍝' },
            { name: 'Bell Peppers', emoji: '🫑' },
            { name: 'Cheese', emoji: '🧀' },
            { name: 'Beef', emoji: '🥩' },
            { name: 'Eggs', emoji: '🥚' },
            { name: 'Carrots', emoji: '🥕' }
        ];

        res.render('pages/ChefItUp', {
            title: 'Chef It Up',
            currentPage: 'features',
            ingredients: ingredients
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('pages/500', {
            currentPage: 'error'
        });
    }
};

exports.findRecipes = async(req, res) => {
    try {
        const selectedIngredients = req.body.ingredients;

        // Find all recipes
        const recipes = await Recipe.find({}).select('title ingredients imagePath type _id');

        // Calculate matching ingredients for each recipe
        const recipesWithMatches = recipes.map(recipe => {
            const matchingIngredients = recipe.ingredients.filter(ingredient =>
                selectedIngredients.some(selected =>
                    ingredient.toLowerCase().includes(selected.toLowerCase())
                )
            );
            return {
                recipe,
                matchCount: matchingIngredients.length,
                matchingIngredients
            };
        });

        // Filter recipes with 2 or more matching ingredients
        const goodMatches = recipesWithMatches.filter(item => item.matchCount >= 2);

        if (goodMatches.length === 0) {
            return res.json({
                success: false,
                message: 'No recipes found with at least 2 matching ingredients. Try different ingredients!'
            });
        }

        // Sort by number of matching ingredients (highest first)
        goodMatches.sort((a, b) => b.matchCount - a.matchCount);

        // Get the best matching recipe
        const bestMatch = goodMatches[0];

        res.json({
            success: true,
            matchCount: bestMatch.matchCount,
            redirect: `/recipes/${bestMatch.recipe._id}`,
            recipe: {
                title: bestMatch.recipe.title,
                type: bestMatch.recipe.type,
                ingredients: bestMatch.recipe.ingredients,
                imagePath: bestMatch.recipe.imagePath,
                matchingIngredients: bestMatch.matchingIngredients
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error finding recipes.'
        });
    }
};