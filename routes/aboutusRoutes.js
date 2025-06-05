const express = require('express');
const router = express.Router();

router.get('/about', (req, res) => {
    res.render('/pages/about', {
        contactEmail: 'contact@simplicious.com',
        pressEmail: 'press@simplicious.com'
    });
});

module.exports = router;