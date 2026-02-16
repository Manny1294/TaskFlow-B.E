function errorHandler(err, req, res, next) {
  // In development, log full error for easier debugging.
  if (process.env.NODE_ENV !== "test") {
    console.error(err);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  return res.status(statusCode).json({
    message,
  });
}

module.exports = errorHandler;
