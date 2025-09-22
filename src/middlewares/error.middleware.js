// Global error handling middleware
module.exports = (err, req, res, next) => {
  console.error(err.stack);

  // Default error
  let error = {
    status: "error",
    message: err.message || "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
  };

  // Mongoose validation error
  if (err.name === "ValidationError") {
    error = {
      status: "error",
      message: "Invalid input data",
      code: "VALIDATION_ERROR",
      errors: Object.values(err.errors).map((e) => ({
        field: e.path,
        message: e.message,
      })),
    };
    return res.status(400).json(error);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    error = {
      status: "error",
      message: `Duplicate ${field}. This ${field} is already in use.`,
      code: "DUPLICATE_ERROR",
    };
    return res.status(400).json(error);
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    error = {
      status: "error",
      message: "Resource not found",
      code: "NOT_FOUND",
    };
    return res.status(404).json(error);
  }

  // JWT Authentication error
  if (err.name === "JsonWebTokenError") {
    error = {
      status: "error",
      message: "Invalid token",
      code: "AUTH_ERROR",
    };
    return res.status(401).json(error);
  }

  // JWT Token expired error
  if (err.name === "TokenExpiredError") {
    error = {
      status: "error",
      message: "Token expired",
      code: "AUTH_ERROR",
    };
    return res.status(401).json(error);
  }

  // Development error - include stack trace
  if (process.env.NODE_ENV === "development") {
    error.stack = err.stack;
  }

  // Send error response
  res.status(err.statusCode || 500).json(error);
};
