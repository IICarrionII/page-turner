// app.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const sessionSecret = process.env.SESSION_SECRET || 'default_secret_key';
// Load Config
require('dotenv').config();

// Passport Config
require('./config/passport')(passport);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// View Engine
app.set('view engine', 'ejs');

// Express Session Middleware
app.use(
    session({
      secret: sessionSecret,
      resave: true,
      saveUninitialized: true,
    })
  );

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global Variables for Flash Messages and User
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null; // Pass user data to all views
  next();
});

// Connect to MongoDB
// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost/page_turner')
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));


// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
