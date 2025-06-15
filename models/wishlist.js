const express = require('express');
const router = express.Router();

router.post('/toggle', (req, res) => {
    const { bookId } = req.body;
    if (!bookId) {
        return res.status(400).json({ message: 'No bookId provided' });
    }

    // Initialize wishlist in session if not present
    if (!req.session.wishlist) {
        req.session.wishlist = [];
    }

    // Add or remove bookId
    const index = req.session.wishlist.indexOf(bookId);
    let action = '';
    if (index === -1) {
        req.session.wishlist.push(bookId);
        action = 'added';
    } else {
        req.session.wishlist.splice(index, 1);
        action = 'removed';
    }

    res.json({ message: `Book ${action} to wishlist`, wishlist: req.session.wishlist });
});

module.exports = router;