const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true, // For search functionality
    },
    author: {
      type: String,
      required: true,
      index: true, // For search functionality
    },
    description: {
      type: String,
      required: true,
    },
    publishedYear: {
      type: Number,
    },
    isbn: {
      type: String,
      unique: true,
    },
    genre: {
      type: [String],
      index: true, // For filtering
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for search functionality
bookSchema.index({ title: "text", author: "text" });

module.exports = mongoose.model("Book", bookSchema);
