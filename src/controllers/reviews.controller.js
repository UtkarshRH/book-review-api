const Review = require("../models/Review");
const Book = require("../models/Book");
const paginate = require("../utils/paginate");

// Helper function to update book's average rating
const updateBookAverageRating = async (bookId) => {
  try {
    const stats = await Review.aggregate([
      { $match: { book: bookId } },
      {
        $group: {
          _id: "$book",
          averageRating: { $avg: "$rating" },
          numberOfReviews: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      await Book.findByIdAndUpdate(bookId, {
        averageRating: Math.round(stats[0].averageRating * 10) / 10,
        numberOfReviews: stats[0].numberOfReviews,
      });
    } else {
      await Book.findByIdAndUpdate(bookId, {
        averageRating: 0,
        numberOfReviews: 0,
      });
    }
  } catch (error) {
    console.error("Error updating book average rating:", error);
  }
};

// Get all reviews with pagination
exports.getAllReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, bookId } = req.query;

    // Base query
    let query = {};

    // If bookId is provided, filter reviews for that book
    if (bookId) {
      query.book = bookId;
    }

    const reviews = await Review.find(query)
      .populate("user", "username")
      .populate("book", "title author")
      .sort("-createdAt");

    const result = await paginate(reviews, {
      page: parseInt(page),
      limit: parseInt(limit),
    });

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Create a new review
exports.createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const bookId = req.params.id; // Get book ID from URL params

    // First check if the book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        status: "error",
        message: "Book not found"
      });
    }

    // Check if user has already reviewed this book
    const existingReview = await Review.findOne({
      user: req.user._id,
      book: bookId
    });

    if (existingReview) {
      return res.status(400).json({
        status: "error",
        message: "You have already reviewed this book"
      });
    }

    // Create the review
    const review = await Review.create({
      book: bookId,
      user: req.user._id,
      rating,
      comment
    });

    // Populate user and book information
    await review.populate("user", "username");
    await review.populate("book", "title author");

    // Update book's average rating
    await updateBookAverageRating(bookId);

    res.status(201).json({
      status: "success",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single review
exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("user", "username")
      .populate("book", "title author");

    if (!review) {
      return res.status(404).json({
        status: "error",
        message: "Review not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// Update a review
exports.updateReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { rating, comment },
      { new: true, runValidators: true }
    )
      .populate("user", "username")
      .populate("book", "title author");

    if (!review) {
      return res.status(404).json({
        status: "error",
        message:
          "Review not found or you are not authorized to update this review",
      });
    }

    // Update book's average rating
    await updateBookAverageRating(review.book);

    res.status(200).json({
      status: "success",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found or not authorized",
      });
    }

    const bookId = review.book;
    await review.remove();

    // Update book's average rating
    await updateBookAverageRating(bookId);

    res.status(204).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
