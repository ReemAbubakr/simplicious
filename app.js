const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();

// Initialize Express app
const app = express();


//settings logic
const upload = require('./middleware/SettingsMiddleware'); // Middleware for file uploads
const settingsController = require('./controllers/settingsController');




// Database Connection
const DB = process.env.MONGODB_URI.replace('<PASSWORD>', process.env.MONGODB_PASSWORD);
mongoose.connect(DB)
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import Models
const Book = require('./models/book');
const User = require('./models/user'); 
const recipeController = require('./controllers/recipeController');
const Recipe = require('./models/Recipes'); // Assuming you have a Recipe model
const usersController = require('./controllers/usersController');


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(flash());

// Static Files Configuration
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Recipe Generator
const generateRecipe = require('./recipeGenerator');

// Routes

// Home Route
app.get('/', (req, res) => {
  res.render('pages/Home', { 
    title: 'Home Page',
    currentPage: 'Home', 
    recipe: generateRecipe() 
  });
});

// Random Recipe API
app.get('/random-recipe', (req, res) => {
  res.json(generateRecipe());
});

// About Route
app.get('/About', (req, res) => {
  res.render('pages/About', { 
    title: 'About Us',
    currentPage: 'About',
    contactEmail: 'support@example.com',
    pressEmail: 'press@example.com'
  });
});

const bookRouter = require('./controllers/bookController');
app.use('/Books', bookRouter);
// Update cart quantity
// Simple Cart Route (for viewing only)
app.get('/cart', (req, res) => {
    res.render('pages/cart', { 
        title: 'Your Cart',
        currentPage: 'Cart'
    });
});

// Error handlers (with corrected paths)
app.use((req, res) => {
  res.status(404).render('pages/404', { 
    title: 'Page Not Found' 
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('pages/500', { 
    title: 'Server Error', 
    errorDetails: err.message 
  });
});


// SearchBAR Route
const { searchRecipes } = require('./controllers/SearchController');
app.get('/search', searchRecipes);
module.exports = app;

// Manage Recipes Route

app.get('/manage-recipes', recipeController.getAllRecipes);// Show Manage Recipes page

app.post('/recipes/:id/approve', recipeController.approveRecipe);// Approve recipe

app.post('/recipes/:id/delete', recipeController.deleteRecipe);// Delete recipe

app.get('/recipes/:id/edit', recipeController.showEditForm);// Show edit recipe form

app.post('/recipes/:id/edit', recipeController.updateRecipe);// Handle edit recipe form submission


// Settings Route
app.get('/Settings', (req, res) => {
  res.render('Settings', { settings });
});

app.get('/Settings', settingsController.getSettingsPage);
app.post('/save-settings', upload.single('logo'), settingsController.saveSettings);


// users route
app.get('/Users', async (req, res) => {
  try {
    const users = await User.find(); // fetch all users from MongoDB
    res.render('Users', { users }); // pass users array to EJS
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get('/Users', usersController.getUsers);
app.post('/users/:id/ban', usersController.banUser);
app.post('/users/:id/unban', usersController.unbanUser);
app.post('/users/:id/edit', usersController.editUser);

// Admin Dashboard Route
app.get('/AdminDashboard', async (req, res) => {
  // Fetch counts dynamically from DB, for example:
  const totalRecipes = await Recipe.countDocuments();
  const totalUsers = await User.countDocuments();

  res.render('AdminDashboard', { totalRecipes, totalUsers });
});



// Server Startup
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});