const User = require('../models/user');

// Render edit user page
exports.getEditUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.render('pages/edit-user', { 
      user,
      title: 'Edit User',
      currentPage: 'users'
    });
  } catch (error) {
    req.flash('error', 'User not found');
    res.redirect('/Users');
  }
};

// Render Users page
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -passwordConfirm -__v');
    res.render('pages/Users', { 
      users,
      title: 'User Management',
      currentPage: 'users'
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    req.flash('error', 'Failed to load users');
    res.redirect('/');
  }
};
// Ban user (set active to false)
exports.banUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { 
      active: false 
    });
    req.flash('success', 'User banned successfully');
    res.redirect('/Users');
  } catch (error) {
    console.error('Ban error:', error);
    req.flash('error', 'Failed to ban user');
    res.redirect('/Users');
  }
};

// Unban user (set active to true)
exports.unbanUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { 
      active: true 
    });
    req.flash('success', 'User unbanned successfully');
    res.redirect('/Users');
  } catch (error) {
    console.error('Unban error:', error);
    req.flash('error', 'Failed to unban user');
    res.redirect('/Users');
  }
};

// Edit user (update email/username/isAdmin)
exports.editUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, isAdmin } = req.body;

  try {
    // Validate email if provided
    if (email && !validator.isEmail(email)) {
      req.flash('error', 'Please provide a valid email');
      return res.redirect('/Users');
    }

    await User.findByIdAndUpdate(id, { 
      username,
      email,
      isAdmin: isAdmin === 'true'  // Convert checkbox value to boolean
    });

    req.flash('success', 'User updated successfully');
    res.redirect('/Users');
  } catch (error) {
    console.error('Edit error:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      req.flash('error', 'Email already exists');
    } else {
      req.flash('error', 'Error updating user');
    }
    
    res.redirect('/Users');
  }
};