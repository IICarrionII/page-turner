// routes/index.js

const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Cart = require('../models/Cart');
const nodemailer = require('nodemailer');

// Middleware to Ensure Authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Please log in to view that resource');
  res.redirect('/users/login');
}

// Home Page
router.get('/', async (req, res) => {
  try {
    const featuredBooks = await Book.find({ bestseller: true }).limit(3);
    res.render('index', { featuredBooks });
  } catch (err) {
    console.log(err);
    res.render('index', { featuredBooks: [] });
  }
});

// Browse Books
router.get('/browse', async (req, res) => {
  try {
    const books = await Book.find({});
    res.render('browse', { books });
  } catch (err) {
    console.log(err);
    res.render('browse', { books: [] });
  }
});

// Best Sellers
router.get('/best-sellers', async (req, res) => {
  try {
    const bestSellers = await Book.find({ bestseller: true });
    res.render('best-sellers', { bestSellers });
  } catch (err) {
    console.log(err);
    res.render('best-sellers', { bestSellers: [] });
  }
});

// Contact Us Page
router.get('/contact', (req, res) => {
  res.render('contact');
});

// Contact Form Submission
router.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  // Create Transporter
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password or app password
    },
  });

  // Email Options
  let mailOptions = {
    from: email,
    to: process.env.EMAIL_USER, // Your email address
    subject: `Contact Form: ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  // Send Email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      req.flash('error_msg', 'An error occurred. Please try again later.');
      res.redirect('/contact');
    } else {
      req.flash('success_msg', 'Your message has been sent successfully!');
      res.redirect('/contact');
    }
  });
});

// Book Details
router.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.render('book-details', { book });
  } catch (err) {
    console.log(err);
    req.flash('error_msg', 'Book not found');
    res.redirect('/browse');
  }
});

// Search Books
router.get('/search', async (req, res) => {
  const query = req.query.q;
  try {
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
      ],
    });
    res.render('search-results', { books, query });
  } catch (err) {
    console.log(err);
    res.render('search-results', { books: [], query });
  }
});

// Add to Cart
router.post('/add-to-cart/:id', ensureAuthenticated, async (req, res) => {
  const bookId = req.params.id;
  const userId = req.user.id;

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({ user: userId, items: [], totalPrice: 0 });
  }

  const book = await Book.findById(bookId);

  const existingItem = cart.items.find((item) => item.book.equals(bookId));

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.items.push({ book: bookId, quantity: 1 });
  }

  cart.totalPrice += book.price;

  await cart.save();

  req.flash('success_msg', 'Book added to cart');
  res.redirect('/browse');
});

// View Cart
router.get('/cart', ensureAuthenticated, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.book');
    res.render('cart', { cart });
  } catch (err) {
    console.log(err);
    req.flash('error_msg', 'Unable to retrieve cart');
    res.redirect('/');
  }
});
// Checkout Page
router.get('/checkout', ensureAuthenticated, async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.user.id }).populate('items.book');
      res.render('checkout', { cart });
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Unable to proceed to checkout');
      res.redirect('/cart');
    }
  });
  
  // Process Checkout
  router.post('/checkout', ensureAuthenticated, async (req, res) => {
    try {
      // Here you can simulate order processing
      // For example, clear the cart and show a success message
      await Cart.findOneAndDelete({ user: req.user.id });
      req.flash('success_msg', 'Your order has been placed successfully!');
      res.redirect('/');
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Unable to process your order');
      res.redirect('/cart');
    }
  });
// Export the router
module.exports = router;
