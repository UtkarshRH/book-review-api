const express = require("express");
const router = express.Router();
const booksController = require("../controllers/books.controller");
const reviewsController = require("../controllers/reviews.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Book routes
router.get("/", booksController.getAllBooks);
router.post("/", authMiddleware, booksController.createBook);
router.get("/:id", booksController.getBook);
router.put("/:id", authMiddleware, booksController.updateBook);
router.delete("/:id", authMiddleware, booksController.deleteBook);

// Nested review routes
router.post("/:id/reviews", authMiddleware, reviewsController.createReview);
router.get("/:id/reviews", reviewsController.getAllReviews);

module.exports = router;
