const Book = require("../models/Book");
const Review = require("../models/Review");
const paginate = require("../utils/paginate");

// Get all books with filters and pagination
exports.getAllBooks = async (req, res, next) => {
  try {
    const { author, genre, page = 1, limit = 10 } = req.query;
    const query = {};

    // Apply filters if provided
    if (author) {
      query.author = { $regex: author, $options: "i" };
    }
    if (genre) {
      query.genre = { $in: Array.isArray(genre) ? genre : [genre] };
    }

    const result = await paginate(Book, query, { page, limit });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Search books by title or author
exports.searchBooks = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        status: 'error',
        message: "Please provide a search query using the 'q' parameter"
      });
    }

    const query = {
      $or: [
        { title: { $regex: q, $options: "i" } },
        { author: { $regex: q, $options: "i" } },
      ]
    };

    const result = await paginate(Book, query, { page, limit });

    res.json({
      status: 'success',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

// Create new book (authenticated users only)
exports.createBook = async (req, res, next) => {
  try {
    const book = await Book.create({
      ...req.body,
      user: req.user._id, // Track who added the book
    });

    res.status(201).json({
      success: true,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

// Get single book with reviews
exports.getBook = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Get book details
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        status: 'error',
        message: "Book not found"
      });
    }

    // Get paginated reviews for this book
    const reviewsResult = await paginate(
      Review,
      { book: req.params.id },
      { page, limit }
    );

    // If there are reviews, populate the user information
    if (reviewsResult.data.length > 0) {
      await Review.populate(reviewsResult.data, {
        path: 'user',
        select: 'username'
      });
    }

    res.json({
      status: 'success',
      data: {
        book: {
          ...book.toObject(),
          reviews: reviewsResult
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update book
exports.updateBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.json({
      success: true,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

// Delete book
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Delete all reviews for this book
    await Review.deleteMany({ book: req.params.id });
    await book.remove();

    res.status(204).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
