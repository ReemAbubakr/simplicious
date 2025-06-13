exports.getChefItUpPage = async(req, res) => {
    try {
        const ingredients = await mongoose.model('recipe').distinct('ingredients');
        res.render('chef-it-up', { ingredients });
    } catch (err) {
        res.status(500).render('error');
    }
};

exports.findRecipes = async(req, res) => {
    try {
        const recipes = await mongoose.model('recipe').find({
            ingredients: { $all: req.body.ingredients }
        }).limit(5);
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};