const Recipe = require('../models/recipe');

exports.getChefItUp = async(req, res) => {
    try {
        const ingredients = [
            { name: 'flour', emoji: '🍗' },
            { name: 'eggs', emoji: '🍅' },
            { name: 'milk', emoji: '🧅' },
            { name: 'sugar', emoji: '🧄' },
            { name: 'ice', emoji: '🍚' },
            { name: 'Pasta', emoji: '🍝' },
            { name: 'parmesan', emoji: '🫑' },
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
        console.log('Selected ingredients:', selectedIngredients);

        // Find all recipes
        const recipes = await Recipe.find({}).select('title ingredients imagePath type _id');
        console.log('Total recipes found:', recipes.length);

        // Calculate matching ingredients for each recipe
        const recipesWithMatches = recipes.map(recipe => {
            // Normalize ingredients for comparison
            const recipeIngredients = recipe.ingredients.map(ing => ing.toLowerCase().trim());
            const selectedNormalized = selectedIngredients.map(ing => ing.toLowerCase().trim());

            console.log('Recipe:', recipe.title);
            console.log('Recipe ingredients:', recipeIngredients);

            const matchingIngredients = recipeIngredients.filter(ingredient =>
                selectedNormalized.some(selected =>
                    ingredient.includes(selected) || selected.includes(ingredient)
                )
            );

            console.log('Matching ingredients:', matchingIngredients);

            return {
                recipe,
                matchCount: matchingIngredients.length,
                matchingIngredients
            };
        });

        // Filter recipes with 2 or more matching ingredients
        const goodMatches = recipesWithMatches.filter(item => item.matchCount >= 2);
        console.log('Good matches found:', goodMatches.length);

        if (goodMatches.length === 0) {
            return res.json({
                success: false,
                message: 'No recipes found with these ingredients.\n\nTry selecting different ingredients!'
            });
        }

        // Sort by number of matching ingredients (highest first)
        goodMatches.sort((a, b) => b.matchCount - a.matchCount);

        // Get the best matching recipe
        const bestMatch = goodMatches[0];
        console.log('Best match:', {
            title: bestMatch.recipe.title,
            matchCount: bestMatch.matchCount,
            matchingIngredients: bestMatch.matchingIngredients
        });

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