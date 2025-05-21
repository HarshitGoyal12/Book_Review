const Book = require('../models/Book');
const Review = require('../models/Review');

// @desc    Create new book
// @route   POST /api/v1/books
// @access  Private
exports.createBook = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all books
// @route   GET /api/v1/books
// @access  Public
exports.getBooks = async (req, res, next) => {
  try {
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['page', 'limit', 'sort'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Finding resources
    let query = Book.find(JSON.parse(queryStr));

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Book.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const books = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: books.length,
      pagination,
      data: books
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single book
// @route   GET /api/v1/books/:id
// @access  Public
exports.getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book not found with id of ${req.params.id}`
      });
    }

    // Get reviews for the book with pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    const reviews = await Review.find({ book: req.params.id })
      .populate('user', 'name')
      .skip(startIndex)
      .limit(limit);
    
    const reviewCount = await Review.countDocuments({ book: req.params.id });
    
    // Calculate average rating
    const averageRating = await Review.aggregate([
      { $match: { book: require('mongoose').Types.ObjectId.createFromHexString(req.params.id) } },
      { $group: { _id: null, avg: { $avg: "$rating" } } }
    ]);
    
    // Pagination
    const pagination = {};
    
    if (startIndex + limit < reviewCount) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      data: {
        ...book.toObject(),
        averageRating: averageRating.length > 0 ? averageRating[0].avg : 0,
        reviews: {
          count: reviewCount,
          pagination,
          data: reviews
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search books
// @route   GET /api/v1/books/search
// @access  Public
exports.searchBooks = async (req, res, next) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }
    
    // Search by title or author (case-insensitive)
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } }
      ]
    });
    
    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    next(error);
  }
};