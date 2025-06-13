exports.getRiskyPage = async(req, res) => {
    try {
        const recipes = await mongoose.model('recipe').aggregate([
            { $sample: { size: 2 } },
            { $project: { title: 1, imagePath: 1, pageLink: 1 } }
        ]);
        res.render('feelin-risky', { recipes });
    } catch (err) {
        res.status(500).render('error');
    }
};

exports.getRandomRecipe = async(req, res) => {
    try {
        const recipe = await mongoose.model('recipe').aggregate([
            { $sample: { size: 1 } },
            { $project: { title: 1, imagePath: 1, pageLink: 1 } }
        ]);
        res.json(recipe[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};