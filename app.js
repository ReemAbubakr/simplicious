require('dotenv').config();
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

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI.replace(
      '<PASSWORD>', 
      encodeURIComponent(process.env.MONGODB_PASSWORD)
    ),
    dbName: 'codebookDB',
    ttl: 24 * 60 * 60 // 1 day
  }),
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax'
  }
}));
//app.use(session(sessionConfig)); ////////////////////undo comment here this line shouldn't be a comment
app.use(flash());

// Cart initialization (must come after session middleware)
app.use((req, res, next) => {
  req.session.cart = req.session.cart || {
    items: [],
    totalQty: 0,
    totalPrice: 0
  };
  next();
});

// Make flash messages available to all views
app.use((req, res, next) => {
  res.locals.flashMessages = {
    error: req.flash('error'),
    success: req.flash('success'),
    info: req.flash('info')
  };
  next();
});

// Security headers
app.use((req, res, next) => {
  res.removeHeader('X-Powered-By');
  res.set('X-Content-Type-Options', 'nosniff');
  next();
});

// =============================================
// Static Files and View Engine
// =============================================
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1y',
  immutable: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// =============================================
// Route Imports and Configuration
// =============================================
const generateRecipe = require('./recipeGenerator');
const bookRouter = require('./routes/books');

// Database status endpoint
app.get('/db-status', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const booksCount = await db.collection('books').countDocuments();
    
    res.json({
      status: 'connected',
      database: db.databaseName,
      collections: collections.map(c => c.name),
      booksCount,
      connectionState: mongoose.connection.readyState
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      error: err.message
    });
  }
});

// Home Route
app.get('/', (req, res) => {
  res.render('pages/Home', { 
    title: 'Home Page',
    currentPage: 'home', 
    recipe: generateRecipe(),
    flashMessages: req.flash()
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

// Book Routes
app.use('/books', bookRouter);

// Cart Route
app.get('/cart', (req, res) => {
  res.render('pages/cart', { 
    title: 'Your Cart',
    currentPage: 'cart',
    cart: req.session.cart || []
  });
});


// SearchBAR Route
const { searchRecipes } = require('./controllers/SearchController');
app.get('/search', searchRecipes);
module.exports = app;

// routes
// Admin Dashboard Route (updated)
app.get('/AdminDashboard', async (req, res) => {
  const [totalRecipes, totalUsers] = await Promise.all([
    Recipe.countDocuments(),
    User.countDocuments()
  ]);
  res.render('pages/AdminDashboard', {  // Note: 'pages/AdminDashboard'
    totalRecipes, 
    totalUsers 
  });
});

// Manage Recipes Route

app.get('/manage-recipes', recipeController.getAllRecipes);// Show Manage Recipes page

app.post('/recipes/:id/approve', recipeController.approveRecipe);// Approve recipe

app.post('/recipes/:id/delete', recipeController.deleteRecipe);// Delete recipe

app.get('/recipes/:id/edit', recipeController.showEditForm);// Show edit recipe form

app.post('/recipes/:id/edit', recipeController.updateRecipe);// Handle edit recipe form submission


// Settings Route
app.get('/Settings', settingsController.getSettingsPage);
app.post('/save-settings', upload.single('logo'), settingsController.saveSettings);

// Users Route (updated)
app.get('/Users', async (req, res) => {
  try {
    const users = await User.find();
    res.render('pages/Users', { users });  // Note: 'pages/Users'
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.post('/Users/:id/ban', usersController.banUser);
app.post('/Users/:id/unban', usersController.unbanUser);
app.post('/Users/:id/edit', usersController.editUser);


// =============================================
// Error Handlers
// =============================================
app.use((req, res, next) => {
  res.status(404).render('pages/404', {
    title: 'Page Not Found',
    currentPage: '',
    layout: 'error'
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

// Show categories
app.get('/recipes', recipeController.showCategories);

// Show recipes for a category
app.get('/recipes/category/:type', recipeController.showRecipesByCategory);

// Show individual recipe detail
app.get('/recipes/:id', recipeController.showRecipeDetails);


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



// =============================================
// Server Startup
// =============================================
const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 DB Status: http://localhost:${PORT}/db-status`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('Server and MongoDB connection closed');
      process.exit(0);
    });
  });
});