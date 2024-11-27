// models/Cart.js

const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  items: [
    {
      book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  totalPrice: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Cart', CartSchema);
