// models/Book.js

const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  description: String,
  price: Number,
  image: String,
  bestseller: Boolean,
});

module.exports = mongoose.model('Book', BookSchema);
