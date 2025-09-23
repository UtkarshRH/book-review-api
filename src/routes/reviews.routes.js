const express = require("express");
const router = express.Router({ mergeParams: true }); // Add mergeParams to access book ID
const reviewsController = require("../controllers/reviews.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Routes for /api/reviews
router.get("/", reviewsController.getAllReviews);
router.get("/:id", reviewsController.getReview);
router.put("/:id", authMiddleware, reviewsController.updateReview);
router.delete("/:id", authMiddleware, reviewsController.deleteReview);

// Route for /api/books/:bookId/reviews
router.post("/", authMiddleware, reviewsController.createReview);

module.exports = router;
