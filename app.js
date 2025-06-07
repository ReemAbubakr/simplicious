const express = require('express');
const path = require('path');
require('dotenv').config();



const app = express();
app.listen(5005);
app.set('views', path.join(__dirname, 'views'));
// Configuration
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Routes (with titles and corrected paths)
app.get('/', (req, res) => {
  res.render('pages/Home', { title: 'Home Page',currentPage: 'Home' }); // Fixed case + added title
});

app.get('/About', (req, res) => {
  res.render('pages/About', { title: 'About Us',currentPage: 'About',
      contactEmail: 'support@example.com',  // Replace with actual email
    pressEmail: 'press@example.com'
   });
});

app.get('/Cart', (req, res) => {
   const books = [
    { id: 1, title: 'Mastering the Art of French Cooking', image: '/images/book1.jpg' },
    { id: 2, title: 'The Joy of Cooking', image: '/images/book2.jpg' },
    { id: 3, title: 'Salt, Fat, Acid, Heat', image: '/images/book3.jpg' },
    { id: 4, title: 'Essentials of Classic Italian Cooking', image: '/images/book4.jpg' },
    { id: 5, title: 'On Food and Cooking', image: '/images/book5.jpg' },
    { id: 6, title: 'The Food Lab', image: '/images/book6.jpg' }
  ];
  res.render('pages/Cart', { title: 'Your Cart',currentPage: 'Cart',books });
});

// Error handlers (with corrected paths)
app.use((req, res) => {
  res.status(404).render('pages/404', { title: 'Page Not Found' });
});

app.use((err, req, res, next) => {
  res.status(500).render('pages/500', { 
    title: 'Server Error', 
    errorDetails: err.message // Pass the error details
  });
});

