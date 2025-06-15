require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');

// Import middleware and controllers
const upload = require('./middleware/SettingsMiddleware');
const settingsController = require('./controllers/settingsController');
const recipeController = require('./controllers/recipeController');
const usersController = require('./controllers/usersController');
const authController = require('./controllers/authController');
const feelinRiskycontroller = require('./controllers/Feelin-RiskyController');
const ChefItUpcontroller = require('./controllers/ChefItUpcontroller');
const mixmellowcontroller = require('./controllers/Mix-And-MellowController');
const preplabcontroller = require('./controllers/ThePrepLabController');
const searchRoutes = require('./routes/searchroutes');
const generateRecipe = require('./recipeGenerator');

// Import models
const Book = require('./models/book');
const Recipe = require('./models/recipe');
const User = require('./models/user');

// Import routes
const authRoutes = require('./routes/auth.routes');;
const bookRouter = require('./routes/books');
const feelinRiskyRoutes = require('./routes/FeelinRiskyRoute');
const chefItUpRoutes = require('./routes/ChefItUpRoute');
const mixmellowroutes = require('./routes/Mix-And-MellowRoute');
const preplabRoutes = require('./routes/ThePrepLabRoute');
const cartRoutes = require('./routes/cart');

const app = express();

// Database Connection
const DB = process.env.MONGODB_URI.replace('<PASSWORD>', encodeURIComponent(process.env.MONGODB_PASSWORD));

mongoose.connect(DB)
    .then(() => console.log('Connected to MongoDB!'))
    .catch(err => console.error('MongoDB connection error:', err));

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: DB,
        dbName: 'codebookDB',
        ttl: 24 * 60 * 60 // 1 day
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        sameSite: 'lax'
    }
}));

// Middleware Setup
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(flash());

// Cart initialization middleware
app.use((req, res, next) => {
    req.session.cart = req.session.cart || { items: [], totalQty: 0, totalPrice: 0 };
    next();
});

// Flash messages middleware
app.use((req, res, next) => {
    res.locals.flashMessages = {
        error: req.flash('error'),
        success: req.flash('success'),
        info: req.flash('info')
    };
    next();
});

// Security headers middleware
app.use((req, res, next) => {
    res.removeHeader('X-Powered-By');
    res.set('X-Content-Type-Options', 'nosniff');
    next();
});

// Debug logging middleware
app.use((req, res, next) => {
    console.log(`📝 ${req.method} ${req.originalUrl}`);
    next();
});

// Static files and view engine
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

app.use(express.static(path.join(__dirname, 'public')));


// Routes
app.post('/api/auth/signup', authController.signup);
app.post('/api/auth/login', authController.login);
app.post('/api/recipes', authController.protect, recipeController.saveRecipe);
app.patch('/api/recipes/:id/favorite', authController.protect, recipeController.toggleFavorite);
app.get('/api/recipes/favorites', authController.protect, recipeController.getFavoriteRecipes);

app.get('/db-status', async(req, res) => {
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



app.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.aggregate([{ $sample: { size: 1 } }]);
    res.render('pages/Home', {
      title: 'Home Page',
      currentPage: 'home',
      recipes, // send the array of recipes (can use recipes[0] in EJS)
      flashMessages: req.flash()
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
app.get('/', (req, res) => {
    res.render('pages/Home', {
        title: 'Home Page',
        currentPage: 'home',
        recipe: generateRecipe(),
        flashMessages: req.flash()
    });
});


// Handle favicon
app.get('/favicon.ico', (req, res) => res.status(204).end());


// manage books also

app.use('/books', bookRouter); 
const cartRoutes = require('./routes/cart');
app.use('/cart', cartRoutes);
const cartController = require('./controllers/cartController');
const orderController = require('./controllers/orderController');
app.post('/checkout', cartController.checkout);
app.get('/order/confirmation', orderController.confirmation);






app.get('/recipes', (req, res) => {
    res.render('pages/recipezizi', {
        title: 'Recipes',
        currentPage: 'recipes'
    });
});

app.get('/search', searchRecipes);

// Admin Dashboard
app.get('/AdminDashboard', async(req, res) => {
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
app.get('/users/:id/edit-user', usersController.getEditUser); // Render edit page
app.get('/users', usersController.getUsers);
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
const PORT = process.env.PORT || 7000;
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
}); ===
===
=
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
const searchRoutes = require('./routes/searchroutes');
const searchRecipes = require('./controllers/SearchController');
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
console.log('✅ Auth routes mounted at /api/auth');

// Feature Routes
app.use('/features', preplabRoutes);
app.use('/chef-it-up', chefItUpRoutes);
app.use('/feelin-risky', feelinRiskyRoutes);
app.use('/mix-and-mellow', mixmellowroutes);

// Book Routes
app.use('/books', bookRouter);

// Cart Routes
app.use('/cart', cartRoutes);
const cartController = require('./controllers/cartController');
const orderController = require('./controllers/orderController');
app.post('/checkout', cartController.checkout);
app.get('/order/confirmation', orderController.confirmation);

// API Endpoints
app.post('/api/auth/signup', authController.signup);
app.post('/api/auth/login', authController.login);
app.post('/recipes', recipeController.saveRecipe);
app.patch('/api/recipes/:id/favorite', authController.protect, recipeController.toggleFavorite);
app.get('/api/recipes/favorites', authController.protect, recipeController.getFavoriteRecipes);

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
        res.status(500).json({ status: 'error', error: err.message });
    }
});

app.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.aggregate([{ $sample: { size: 1 } }]);
    res.render('pages/Home', {
      title: 'Home Page',
      currentPage: 'home',
      recipes, // send the array of recipes (can use recipes[0] in EJS)
      flashMessages: req.flash()
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
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


// Recipes main page
app.get('/recipes', async (req, res) => {
    try {
        console.log('Loading recipes page...');

        // Get all recipes
        const allRecipes = await Recipe.find().select('title description type imagePath ingredients');

        // Get all unique recipe types from database
        const recipeTypes = await Recipe.distinct('type');
        console.log('Recipe types found:', recipeTypes);

        // Get total count of recipes
        const totalRecipes = await Recipe.countDocuments();
        console.log('Total recipes:', totalRecipes);

        // Get recipe count by category
        const categoryStats = await Recipe.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 } } }
        ]);
        console.log('Category stats:', categoryStats);

        // Create category mapping with proper images and stats
        const categoryImageMap = {
            'breakfast': 'breakfast(recipe).jpg',
            'lunch': 'lunch(recipe).jpg',
            'dinner': 'dinner(recipe).jpg',
            'dessert': 'desserts(recipe).jpg',
            'cocktails': 'cocktails.jpeg.jpg',
            'keto': 'keto icon.png'
        };

        // Build dynamic categories with real data
        const categories = recipeTypes.map(type => {
            const stats = categoryStats.find(stat => stat._id === type);
            return {
                name: type.charAt(0).toUpperCase() + type.slice(1),
                type: type,
                image: categoryImageMap[type] || 'CoverIMG.png', // fallback image
                recipeCount: stats ? stats.count : 0
            };
        });

        console.log('Categories built:', categories);

        const renderData = {
            title: 'Recipes',
            currentPage: 'recipes',
            categories: categories || [],
            allRecipes: allRecipes || [],
            totalRecipes: totalRecipes || 0
        };

        console.log('Rendering with data:', Object.keys(renderData));

        res.render('pages/RecipesMain', renderData);
    } catch (error) {
        console.error('Error loading recipes page:', error);

        // Fallback data if database fails
        const fallbackData = {
            title: 'Recipes',
            currentPage: 'recipes',
            categories: [],
            allRecipes: [],
            totalRecipes: 0
        };

        res.render('pages/RecipesMain', fallbackData);
    }
});

// Search routes
app.use('/search', searchRoutes);

// Admin Dashboard
app.get('/AdminDashboard', async (req, res) => {
    try {
        const [totalRecipes, totalUsers] = await Promise.all([
            Recipe.countDocuments(),
            User.countDocuments()
        ]);
        res.render('pages/AdminDashboard', { 
            totalRecipes, 
            totalUsers,
            title: 'Admin Dashboard',
            currentPage: 'admin'
        });
    } catch (error) {
        console.error('Error loading admin dashboard:', error);
        res.status(500).render('pages/500', {
            title: 'Server Error',
            errorDetails: error.message
        });
    }
});

// Recipe management routes
app.get('/recipes/category/:type', recipeController.showRecipesByCategory);
app.get('/recipes/:id', recipeController.showRecipeDetails);
app.get('/manage-recipes', recipeController.getAllRecipes);
app.post('/recipes/:id/delete', recipeController.deleteRecipe);
app.get('/recipes/:id/edit-recipe', recipeController.showEditForm);
app.post('/recipes/:id/edit-recipe', recipeController.updateRecipe);

// Settings Routes
app.get('/Settings', settingsController.getSettingsPage);
app.post('/save-settings', upload.single('logo'), settingsController.saveSettings);

// Users Routes
app.get('/users/:id/edit-user', usersController.getEditUser);
app.get('/users', usersController.getUsers);
app.post('/users/:id/ban', usersController.banUser);
app.post('/users/:id/unban', usersController.unbanUser);
app.post('/users/:id/edit', usersController.editUser);

// Authentication page routes
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

// Books management route
app.get('/booksmanaging', async (req, res) => {
    try {
        const books = await Book.find();
        res.render('pages/booksmanaging', {
            books,
            title: 'Manage Books',
            currentPage: 'booksmanaging'
        });
    } catch (error) {
        console.error('Error loading books:', error);
        req.flash('error', 'Failed to load books');
        res.redirect('/');
    }
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
const PORT = process.env.PORT || 7000;
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

module.exports = app;