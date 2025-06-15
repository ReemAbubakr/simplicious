const Recipe = require('../models/recipe');

const searchRecipes = async(req, res) => {
    try {
        const query = (req.query.q || '').toLowerCase();
        const isCategorySearch = req.query.isCategory === 'true';

        const allowedCategories = ['breakfast', 'lunch', 'dinner', 'dessert', 'keto', 'cocktails'];

        // Handle category search (for home page)
        if (isCategorySearch) {
            // Check for exact match first
            const exactMatch = allowedCategories.find(cat => cat === query);
            if (exactMatch) {
                return res.json({
                    redirect: `/recipes?category=${exactMatch}`
                });
            }

            // Then check for partial matches
            const matchedCategories = allowedCategories.filter(cat => cat.includes(query));
            if (matchedCategories.length > 0) {
                const recipes = await Recipe.find({
                        type: { $in: matchedCategories }
                    })
                    .limit(5)
                    .select('title type _id');

                return res.json({
                    recipes,
                    redirect: `/recipes?category=${matchedCategories[0]}`
                });
            }
            return res.json({ recipes: [] });
        }

        // Original general search functionality
        const recipes = await Recipe.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        }).limit(10);

        res.json({ recipes });
    } catch (error) {
        res.status(500).json({ message: 'Server error during search' });
    }
};

module.exports = { searchRecipes };