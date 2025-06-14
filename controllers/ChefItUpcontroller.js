const mongoose = require('mongoose');

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
        // Import your recipes data here
        const recipes = require('../public/js/RecipesData');

        const matchingRecipes = recipes.filter(recipe => {
            const matchCount = recipe.ingredients.filter(ingredient =>
                selectedIngredients.some(selected =>
                    ingredient.toLowerCase().includes(selected.toLowerCase())
                )
            ).length;
            return matchCount > 0;
        });

        if (matchingRecipes.length === 0) {
            return res.json({
                success: false,
                message: 'No recipes found with these ingredients.'
            });
        }

        // Sort recipes by number of matching ingredients
        matchingRecipes.sort((a, b) => {
            const aMatches = a.ingredients.filter(ingredient =>
                selectedIngredients.some(selected =>
                    ingredient.toLowerCase().includes(selected.toLowerCase())
                )
            ).length;
            const bMatches = b.ingredients.filter(ingredient =>
                selectedIngredients.some(selected =>
                    ingredient.toLowerCase().includes(selected.toLowerCase())
                )
            ).length;
            return bMatches - aMatches;
        });

        res.json({
            success: true,
            recipes: matchingRecipes.slice(0, 3) // Return top 3 matches
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error finding recipes.'
        });
    }
};