const Recipe = require('../models/recipe');

const searchRecipes = async(req, res) => {
    try {
        const query = (req.query.q || '').toLowerCase();
        const isCategorySearch = req.query.isCategory === 'true'; // New flag

        const allowedCategories = ['breakfast', 'lunch', 'dinner', 'dessert', 'keto', 'cocktails'];

        // Handle category search (for home page)
        if (isCategorySearch) {
            const matchedCategories = allowedCategories.filter(cat => cat.includes(query));

            if (matchedCategories.length > 0) {
                // Return category redirect information along with recipes
                const recipes = await Recipe.find({
                        type: { $in: matchedCategories }
                    })
                    .limit(5)
                    .select('title type _id');

                return res.json({
                    recipes,
                    redirect: `/recipes?category=${matchedCategories[0]}` // Add redirect URL for exact category match
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