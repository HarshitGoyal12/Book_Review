const express = require('express');
const { 
  createBook, 
  getBooks, 
  getBook,
  searchBooks
} = require('../controllers/bookController');

const { addReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Search route
router.get('/search', searchBooks);

// Book routes
router.route('/')
  .get(getBooks)
  .post(protect, createBook);

router.route('/:id')
  .get(getBook);

// Review routes for a book
router.route('/:bookId/reviews')
  .post(protect, addReview);

module.exports = router;