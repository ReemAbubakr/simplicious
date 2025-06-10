const Recipe = require('../models/Recipe');

const searchRecipes = async (req, res) => {
  try {
    const query = req.query.q?.toLowerCase() || '';

    const recipes = await Recipe.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Server error during search' });
  }
};

module.exports = { searchRecipes };
