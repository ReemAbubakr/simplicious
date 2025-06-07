const mongoose = require('mongoose');
const newLocal = '../models/book';
const dotenv = require('dotenv');

// Configure environment variables
dotenv.config({ path: './config.env' });

// Replace password in connection string
const DB = process.env.MONGODB_URI.replace('<PASSWORD>', process.env.MONGODB_PASSWORD);

// Sample book data
const books = [
  {
    title: 'Mastering the Art of French Cooking',
    author: 'Julia Child',
    price: 35.99,
    coverImage: 'french-cooking-cover.jpg'
  },
  // Add more books here as needed
];

// Connect and seed database
async function seedDatabase() {
  try {
    await mongoose.connect(DB);
    console.log('DB connection successful!');
    
    // Clear existing books
    await Book.deleteMany();
    console.log('Deleted existing books');
    
    // Insert new books
    await Book.insertMany(books);
    console.log('Successfully seeded books!');
    
    // Close connection
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

seedDatabase();