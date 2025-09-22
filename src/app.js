const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/auth.routes");
const booksRoutes = require("./routes/books.routes");
const reviewsRoutes = require("./routes/reviews.routes");

const app = express();

// Connect to MongoDB
connectDB();

// Security Middlewares
app.use(helmet()); // Add security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/reviews", reviewsRoutes);

// Search endpoint
app.get("/api/search", require("./controllers/books.controller").searchBooks);

// Handle undefined routes
app.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

// Error handling middleware
app.use(require("./middlewares/error.middleware"));

module.exports = app;
