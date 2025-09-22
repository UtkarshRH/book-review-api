const express = require("express");
const router = express.Router();
const booksController = require("../controllers/books.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", booksController.getAllBooks);
router.post("/", authMiddleware, booksController.createBook);
router.get("/:id", booksController.getBook);
router.put("/:id", authMiddleware, booksController.updateBook);
router.delete("/:id", authMiddleware, booksController.deleteBook);

module.exports = router;
