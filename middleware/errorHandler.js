/**
 * Centralized error handler
 */
export function errorHandler(err, _req, res, next) {
  console.error(err);
  if (res.headersSent) return next(err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, error: err.message, message: 'Validation Error' });
  }

  if (err.status && err.message) {
    return res.status(err.status).json({ success: false, error: err.message });
  }

  res.status(500).json({ success: false, error: 'Internal Server Error', message: err.message || 'Unexpected error' });
}
