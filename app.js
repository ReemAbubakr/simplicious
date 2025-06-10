require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');

const app = express();


// Database Connection
const DB = process.env.MONGODB_URI.replace('<PASSWORD>', process.env.MONGODB_PASSWORD);
mongoose.connect(DB)
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Session Configuration
const sessionConfig = {
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
};

// ========== MIDDLEWARE SETUP ========== //

// Standard middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware (must come before any middleware that uses session)
app.use(session(sessionConfig));

// Flash messages
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
  res.set('X-Frame-Options', 'DENY');
  res.set('X-XSS-Protection', '1; mode=block');
  next();
});

// Static files
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1y',
  immutable: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ========== ROUTE IMPORTS ========== //
const generateRecipe = require('./recipeGenerator');

const bookRouter = require('./routes/books');
const { searchRecipes } = require('./controllers/SearchController');
const upload = require('./middleware/SettingsMiddleware');
const cartController = require('./controllers/cartController');
const settingsController = require('./controllers/settingsController');
const recipeController = require('./controllers/recipeController');
const usersController = require('./controllers/usersController');
const checkoutController = require('./controllers/checkoutController');
const User = require('./models/user');
const Recipe = require('./models/Recipe');
const Order = require('./models/order');



// ========== ROUTES ========== //

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
    recipe: generateRecipe()
  });
});

// About Route
app.get('/about', (req, res) => {
  res.render('pages/About', { 
    title: 'About Us',
    currentPage: 'about',
    contactEmail: process.env.CONTACT_EMAIL || 'support@example.com'
  });
});

// Book Routes
app.use('/books', bookRouter);

// Cart Routes
app.get('/cart/status/:bookId', (req, res) => {
  try {
    const bookId = req.params.bookId;
    const inCart = req.session.cart.items.some(item => 
      item.bookId.toString() === bookId
    ) || false;
    
    res.json({ inCart });
  } catch (err) {
    console.error('Error checking cart status:', err);
    res.status(500).json({ error: 'Error checking cart status' });
  }
});

app.get('/cart', cartController.getCartDetails);
app.post('/cart/add/:bookId', cartController.addToCart);
app.post('/cart/update/:bookId', cartController.updateCartItem);
app.post('/cart/remove/:bookId', cartController.removeFromCart);
app.post('/cart/clear', cartController.clearCart);


app.get('/checkout', checkoutController.getCheckoutPage);

app.post('/checkout', checkoutController.processCheckout);
app.get('/order-confirmation/:orderId', checkoutController.getOrderConfirmation);

app.get('/api/orders/:orderId', checkoutController.getOrderDetails);

app.post('/cart/apply-coupon', cartController.getCart, cartController.applyCoupon);
app.delete('/cart/remove-coupon', cartController.getCart, cartController.removeCoupon);



// Order confirmation
app.get('/order-confirmation/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('user', 'name email')
      .populate('items.book', 'title coverImage');

    if (!order) {
      req.flash('error', 'Order not found');
      return res.redirect('/');
    }
    
    res.render('pages/orderConfirmation', {
      title: 'Order Confirmation',
      currentPage: '',
      order
    });
  } catch (err) {
    console.error('Order confirmation error:', err);
    req.flash('error', 'Error retrieving order details');
    res.redirect('/');
  }
});


// Search Route
app.get('/search', searchRecipes);

// Recipe Management Routes
app.get('/manage-recipes', recipeController.getAllRecipes);
app.post('/recipes/:id/approve', recipeController.approveRecipe);
app.post('/recipes/:id/delete', recipeController.deleteRecipe);
app.get('/recipes/:id/edit', recipeController.showEditForm);
app.post('/recipes/:id/edit', recipeController.updateRecipe);

// Settings Route
app.get('/Settings', settingsController.getSettingsPage);
app.post('/save-settings', upload.single('logo'), settingsController.saveSettings);

// Users Route
app.get('/Users', usersController.getUsers);
app.post('/users/:id/ban', usersController.banUser);
app.post('/users/:id/unban', usersController.unbanUser);
app.post('/users/:id/edit', usersController.editUser);

// Admin Dashboard Route
app.get('/AdminDashboard', async (req, res) => {
  try {
    const totalRecipes = await Recipe.countDocuments();
    const totalUsers = await User.countDocuments();
    res.render('AdminDashboard', { 
      totalRecipes, 
      totalUsers,
      title: 'Admin Dashboard',
      currentPage: 'admin'
    });
  } catch (err) {
    req.flash('error', 'Failed to load dashboard data');
    res.redirect('/');
  }
});

// ========== ERROR HANDLERS ========== //
app.use((req, res, next) => {
  res.status(404).render('pages/404', {
    title: 'Page Not Found',
    currentPage: '',
    layout: 'error'
  });
});

app.use((err, req, res, next) => {
  console.error('🚨 Error:', err.stack);
  res.status(500).render('pages/500', {
    title: 'Server Error',
    currentPage: '',
    errorDetails: process.env.NODE_ENV === 'development' ? err.stack : null,
    layout: 'error'
  });
});

// ========== SERVER STARTUP ========== //
const PORT = process.env.PORT || 5555
;

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

module.exports = app;