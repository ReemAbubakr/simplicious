const express = require('express');
const router = express.Router();

// Home Page
router.get('/', (req, res) => {
    res.render('pages/home', { 
        title: 'Cooking Recipes' 
    });
});

module.exports = router;