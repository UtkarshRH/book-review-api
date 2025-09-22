const express = require("express");
const router = express.Router();
const reviewsController = require("../controllers/reviews.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", reviewsController.getAllReviews);
router.post("/", authMiddleware, reviewsController.createReview);
router.get("/:id", reviewsController.getReview);
router.put("/:id", authMiddleware, reviewsController.updateReview);
router.delete("/:id", authMiddleware, reviewsController.deleteReview);

module.exports = router;
