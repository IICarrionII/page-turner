// seeds.js

const mongoose = require('mongoose');
const Book = require('./models/Book');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/page_turner', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const books = [
  {
    title: 'The Great Adventure',
    author: 'Jane Doe',
    genre: 'Adventure',
    description: 'An epic journey of discovery.',
    price: 19.99,
    image: '/images/book1.jpg',
    bestseller: true,
  },
  {
    title: 'Mystery of the Old House',
    author: 'John Smith',
    genre: 'Mystery',
    description: 'A thrilling mystery that keeps you on the edge of your seat.',
    price: 14.99,
    image: '/images/book2.jpg',
    bestseller: false,
  },
  {
    title: 'Learning JavaScript',
    author: 'Alex Johnson',
    genre: 'Education',
    description: 'An in-depth guide to modern JavaScript programming.',
    price: 29.99,
    image: '/images/book3.jpg',
    bestseller: true,
  },
  {
    title: 'The Science of Everything',
    author: 'Dr. Emily Carter',
    genre: 'Science',
    description: 'An exploration into the wonders of science.',
    price: 24.99,
    image: '/images/book4.jpg',
    bestseller: false,
  },
  {
    title: 'Historical Journeys',
    author: 'Michael Brown',
    genre: 'History',
    description: 'A deep dive into significant historical events.',
    price: 18.99,
    image: '/images/book5.jpg',
    bestseller: true,
  },// Add more book objects here
];

// Insert books into the database
Book.insertMany(books)
  .then(() => {
    console.log('Sample books inserted into the database!');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Failed to insert books:', err);
  });
