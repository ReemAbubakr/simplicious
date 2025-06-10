const express = require('express');
const Book = require('../models/book');
const router = express.Router();

// GET all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().lean();
    res.render('pages/book', {
      title: 'Our Books',
      currentPage: 'Books',
      books
    });
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).render('pages/500', {
      title: 'Server Error',
      errorDetails: 'Failed to load books'
    });
  }
};

// Create a new book
exports.createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        book
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

module.exports = exports;