const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const { protect } = require('./middleware/authMiddleware');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const recipeRoutes = require('./routes/recipe.routes');
const usersRoutes = require('./routes/users');

// Create Express app
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60 // 1 day
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API routes prefix
const api = '/api';

// Auth Routes
app.use(`${api}/auth`, authRoutes);

// User Routes
app.use(`${api}/users`, usersRoutes);

// Recipe Routes
app.use(`${api}/recipes`, recipeRoutes);

// Home Page Route
app.get('/', (req, res) => {
  res.render('pages/Home', {
    title: 'Home',
    currentPage: 'home',
    recipe: {
      title: 'Sample Recipe',
      tags: ['Vegan', 'Quick', 'Healthy'],
      // add other properties as needed
    }
  });
});

// Login Page Route
app.get('/login', (req, res) => {
  res.render('pages/login', {
    title: 'Login',
    currentPage: 'login'
  });
});

// Signup Page Route
app.get('/signup', (req, res) => {
  res.render('pages/signup', {
    title: 'Sign Up',
    currentPage: 'signup'
  });
});

// Profile Page Route
app.get('/about', protect, (req, res) => {
  res.render('pages/about', {
    title: 'About',
    currentPage: 'about'
  });
});

// Error handling middleware


// 404 handler
app.use((req, res) => {
  res.status(404).render('pages/404', {
    title: 'Page Not Found',
    currentPage: '404'
  });
});

// Start server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


