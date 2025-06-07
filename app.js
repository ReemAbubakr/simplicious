const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

// Initialize Express app
const app = express();

// Database Connection
const DB = process.env.MONGODB_URI.replace('<PASSWORD>', process.env.MONGODB_PASSWORD);
mongoose.connect(DB)
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import Book model (assuming you have this in models/Book.js)
const Book = require('./models/book');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files Configuration (unchanged)
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Recipe Generator (unchanged)
const generateRecipe = require('./recipeGenerator');

// Routes (keeping your exact rendering logic but fetching from DB)

// Home Route (unchanged)
app.get('/', (req, res) => {
  res.render('pages/Home', { 
    title: 'Home Page',
    currentPage: 'Home', 
    recipe: generateRecipe() 
  });
});

// Random Recipe API (unchanged)
app.get('/random-recipe', (req, res) => {
  res.json(generateRecipe());
});

// About Route (unchanged)
app.get('/About', (req, res) => {
  res.render('pages/About', { 
    title: 'About Us',
    currentPage: 'About',
    contactEmail: 'support@example.com',
    pressEmail: 'press@example.com'
  });
});

// Updated Cart Route - Now fetches from MongoDB
app.get('/Cart', async (req, res) => {
  try {
    const books = await Book.find().lean(); // Fetch books from DB
    res.render('pages/Cart', { 
      title: 'Your Cart',
      currentPage: 'Cart',
      books 
    });
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).render('pages/500', { 
      title: 'Server Error', 
      errorDetails: 'Failed to load books' 
    });
  }
});

// Error Handlers (unchanged)
app.use((req, res) => {
  res.status(404).render('pages/404', { 
    title: 'Page Not Found' 
  });
});

app.use((err, req, res, next) => {
  res.status(500).render('pages/500', { 
    title: 'Server Error', 
    errorDetails: err.message 
  });
});

// Server Startup
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});