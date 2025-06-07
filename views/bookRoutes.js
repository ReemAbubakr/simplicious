const express = require('express');
const bookController = require('../controllers/bookController');
const authController = require('../controllers/authController');

const router = express.Router();

// Public routes
router.get('/', bookController.getAllBooks);
router.get('/chef-recommended', bookController.getChefRecommendedBooks);

// Protected routes (require authentication)
router.use(authController.protect);

router.post('/', 
  authController.restrictTo('admin', 'chef'),
  bookController.createBook);

router.post('/:id/add-to-cart', bookController.addToCart);

module.exports = router;