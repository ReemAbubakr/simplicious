const User = require('../models/user');

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Create and save user (password is auto-hashed by pre-save hook)
    const user = new User({ username, email, password });
    await user.save();

    // Return user without password
    const userResponse = { 
      id: user._id,
      username: user.username,
      email: user.email
    };
    
    res.status(201).json({ message: 'User created', user: userResponse });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Return user without password
    const userResponse = { 
      id: user._id,
      username: user.username,
      email: user.email
    };
    
    res.json({ message: 'Login successful', user: userResponse });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};