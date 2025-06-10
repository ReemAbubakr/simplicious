require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

async function createTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete existing test user if exists
    await User.deleteOne({ email: 'test@example.com' });
    console.log('Deleted existing test user if any');

    // Create new test user
    const newUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      passwordConfirm: 'password123'
    });

    console.log('Created new test user:', {
      email: newUser.email,
      username: newUser.username
    });

    // Verify password
    const user = await User.findOne({ email: 'test@example.com' }).select('+password');
    const isCorrect = await user.correctPassword('password123');
    console.log('Password verification test:', isCorrect);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

createTestUser(); 