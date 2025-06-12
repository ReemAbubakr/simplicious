const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Create JWT token
const createToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '24h' // Token expires in 24 hours
    });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
    try {
        // Debug: Log the request body
        console.log('🚀 Signup function called');
        console.log('📦 Request body:', req.body);
        console.log('📦 Content-Type:', req.headers['content-type']);

        // Check if req.body exists
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'No data received. Please check your request format.'
            });
        }

        // Get user data from request with fallback
        const { 
            username = req.body.name, // fallback to 'name' if 'username' not found
            email, 
            password, 
            passwordConfirm = req.body.confirmPassword // fallback to 'confirmPassword'
        } = req.body;

        // Basic validation
        if (!username || !email || !password || !passwordConfirm) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide all required fields',
                received: {
                    username: !!username,
                    email: !!email,
                    password: !!password,
                    passwordConfirm: !!passwordConfirm
                },
                bodyKeys: Object.keys(req.body)
            });
        }

        if (password !== passwordConfirm) {
            return res.status(400).json({
                status: 'error',
                message: 'Passwords do not match'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'Email already in use'
            });
        }

        // Create new user
        const newUser = await User.create({
            username,
            email,
            password,
            passwordConfirm
        });

        // Create token
        const token = createToken(newUser._id);

        // Send response
        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(400).json({
            status: 'error',
            message: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        // Debug: Log the request body
        console.log('🔐 Login function called');
        console.log('📦 Request body:', req.body);

        // Check if req.body exists
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'No data received. Please check your request format.'
            });
        }

        // Get login data
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide email and password',
                received: {
                    email: !!email,
                    password: !!password
                },
                bodyKeys: Object.keys(req.body)
            });
        }

        // Find user and include password
        const user = await User.findOne({ email }).select('+password');
        
        // Check if user exists
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordCorrect = await user.correctPassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }

        // Create token
        const token = createToken(user._id);

        // Send response
        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(400).json({
            status: 'error',
            message: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ message: 'Error getting user data' });
    }
};

// Middleware to protect routes
exports.protect = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 'error',
                message: 'Please log in to access this resource'
            });
        }

        // Get token
        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'User no longer exists'
            });
        }

        // Add user to request
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({
            status: 'error',
            message: 'Please log in again'
        });
    }
};