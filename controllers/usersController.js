const User = require('../models/user');

// Render Users page
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.render('pages/Users', { users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Server Error');
  }
};

// Ban user
exports.banUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { active: false });
    res.redirect('/Users');
  } catch (error) {
    res.status(500).send('Failed to ban user');
  }
};

// Unban user
exports.unbanUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { active: true });
    res.redirect('/Users');
  } catch (error) {
    res.status(500).send('Failed to unban user');
  }
};

// Edit user 
exports.editUser = async (req, res) => {
  const { id } = req.params;
  const { email, role } = req.body;

  try {
    await User.findByIdAndUpdate(id, { email, role });
    res.redirect('/Users');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating user');
  }
};