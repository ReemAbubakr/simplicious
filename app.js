require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');

const app = express();

connectDB();



// =============================================
// Application Middleware
// =============================================
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Session configuration
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

app.use(session(sessionConfig));
app.use(flash());

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
}));

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

// Cart Route
app.get('/cart', (req, res) => {
  res.render('pages/cart', { 
    title: 'Your Cart',
    currentPage: 'cart',
    cart: req.session.cart || []
  });
});

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
  console.error('🚨 Error:', err.stack);
  res.status(500).render('pages/500', {
    title: 'Server Error',
    currentPage: '',
    errorDetails: process.env.NODE_ENV === 'development' ? err.stack : null,
    layout: 'error'
  });
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