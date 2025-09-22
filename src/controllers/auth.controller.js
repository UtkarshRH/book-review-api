const Review = require("../models/Review");
const Book = require("../models/Book");
const paginate = require("../utils/paginate");

// Helper function to update book's average rating
const updateBookAverageRating = async (bookId) => {
  const stats = await Review.aggregate([
    { $match: { book: bookId } },
    {
      $group: {
        _id: "$book",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Book.findByIdAndUpdate(bookId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews,
    });
  } else {
    await Book.findByIdAndUpdate(bookId, {
      averageRating: 0,
      totalReviews: 0,
    });
  }
};

exports.getAllReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const reviews = Review.find()
      .populate("user", "username")
      .populate("book", "title author");

    const result = await paginate(reviews, { page, limit });
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

exports.createReview = async (req, res, next) => {
  try {
    const { book: bookId } = req.body;

    // Check if user has already reviewed this book
    const existingReview = await Review.findOne({
      user: req.user._id,
      book: bookId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this book",
      });
    }

    // Create review
    const review = await Review.create({
      ...req.body,
      user: req.user._id,
    });

    // Update book's average rating
    await updateBookAverageRating(bookId);

    await review.populate("user", "username");
    await review.populate("book", "title author");

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("user", "username")
      .populate("book", "title author");

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    )
      .populate("user", "username")
      .populate("book", "title author");

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found or not authorized",
      });
    }

    // Update book's average rating
    await updateBookAverageRating(review.book);

    res.json({
      success: true,
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
