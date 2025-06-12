require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');

const upload = require('./middleware/SettingsMiddleware');
const settingsController = require('./controllers/settingsController');
const recipeController = require('./controllers/recipeController');
const usersController = require('./controllers/usersController');
const authController = require('./controllers/authController');
const { searchRecipes } = require('./controllers/SearchController');
const generateRecipe = require('./recipeGenerator');
const bookRouter = require('./routes/books');
const Book = require('./models/book');
const Recipe = require('./models/recipe');
const User = require('./models/user');

const app = express();

// 1. MIDDLEWARE FIRST (before any routes)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Debug: Log all incoming requests
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.originalUrl}`);
  next();
});

// 2. THEN ROUTES (after middleware)
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// Debug: Log when routes are mounted
console.log('✅ Auth routes mounted at /api/auth');

// 3. Database Connection (can be anywhere)
const DB = process.env.MONGODB_URI.replace('<PASSWORD>', encodeURIComponent(process.env.MONGODB_PASSWORD));
mongoose.connect(DB)
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('MongoDB connection error:', err));
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: DB,
    dbName: 'codebookDB',
    ttl: 24 * 60 * 60
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax'
  }
}));
app.use(flash());

// Cart initialization
app.use((req, res, next) => {
  req.session.cart = req.session.cart || { items: [], totalQty: 0, totalPrice: 0 };
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

// Static Files and View Engine
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1y',
  immutable: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
//app.post('/api/auth/signup', authController.signup);
//app.post('/api/auth/login', authController.login);
app.post('/api/recipes', authController.protect, recipeController.saveRecipe);
app.patch('/api/recipes/:id/favorite', authController.protect, recipeController.toggleFavorite);
app.get('/api/recipes/favorites', authController.protect, recipeController.getFavoriteRecipes);

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
    res.status(500).json({ status: 'error', error: err.message });
  }
});

app.get('/', (req, res) => {
  res.render('pages/Home', {
    title: 'Home Page',
    currentPage: 'home',
    recipe: generateRecipe(),
    flashMessages: req.flash()
  });
});

app.get('/random-recipe', (req, res) => {
  res.json(generateRecipe());
});

app.get('/About', (req, res) => {
  res.render('pages/About', {
    title: 'About Us',
    currentPage: 'About',
    contactEmail: 'support@example.com',
    pressEmail: 'press@example.com'
  });
});

app.use('/books', bookRouter);

app.get('/cart', (req, res) => {
  res.render('pages/cart', {
    title: 'Your Cart',
    currentPage: 'cart',
    cart: req.session.cart || []
  });
});

app.get('/search', searchRecipes);

// Admin Dashboard
app.get('/AdminDashboard', async (req, res) => {
  const [totalRecipes, totalUsers] = await Promise.all([
    Recipe.countDocuments(),
    User.countDocuments()
  ]);
  res.render('pages/AdminDashboard', { totalRecipes, totalUsers });
});

// Recipe Routes
app.get('/recipes', recipeController.showCategories);
app.get('/recipes/category/:type', recipeController.showRecipesByCategory);
app.get('/recipes/:id', recipeController.showRecipeDetails);
app.get('/manage-recipes', recipeController.getAllRecipes);
app.post('/recipes/:id/approve', recipeController.approveRecipe);
app.post('/recipes/:id/delete', recipeController.deleteRecipe);
app.get('/recipes/:id/edit', recipeController.showEditForm);
app.post('/recipes/:id/edit', recipeController.updateRecipe);

// Settings Routes
app.get('/Settings', settingsController.getSettingsPage);
app.post('/save-settings', upload.single('logo'), settingsController.saveSettings);

// Users Routes
app.get('/Users', usersController.getUsers);
app.post('/users/:id/ban', usersController.banUser);
app.post('/users/:id/unban', usersController.unbanUser);
app.post('/users/:id/edit', usersController.editUser);

//auth pages
// Page routes (for rendering forms)
app.get('/login', (req, res) => {
  res.render('pages/login', {
    title: 'Login',
    currentPage: 'login'
  });
});

app.get('/signup', (req, res) => {
  res.render('pages/signup', {
    title: 'Sign Up',
    currentPage: 'signup'
  });
});
// Error Handlers
app.use((req, res) => {
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

// Start Server
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 DB Status: http://localhost:${PORT}/db-status`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('Server and MongoDB connection closed');
      process.exit(0);
    });
  });
});

