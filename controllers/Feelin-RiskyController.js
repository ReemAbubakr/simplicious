const Recipe = require('../models/recipe');

exports.getRiskyPage = async(req, res) => {
    try {
        res.render('pages/Feelin-Risky', {
            title: 'Feelin\' Risky'
        });
    } catch (err) {
        console.error('Error in Feelin-Risky:', err);
        res.status(500).render('pages/500', {
            title: 'Server Error',
            errorDetails: err.message
        });
    }
};

exports.getRandomRecipe = async(req, res) => {
    try {
        const recipe = await Recipe.aggregate([
            { $sample: { size: 1 } },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    imagePath: 1,
                    ingredients: 1,
                    instructions: 1,
                    type: 1,
                    description: 1
                }
            }
        ]);

        if (!recipe.length) {
            return res.status(404).json({ error: 'No recipes found' });
        }

        res.json(recipe[0]);
    } catch (err) {
        console.error('Error getting random recipe:', err);
        res.status(500).json({ error: 'Server error' });
    }
};