// Centralized error handling middleware

function handleValidationError(err, res) {
  return res.status(400).json({ success: false, error: err.message, message: 'Validation Error' });
}

function handleStatusError(err, res) {
  return res.status(err.status).json({ success: false, error: err.message });
}

function handleInternalError(err, res) {
  return res.status(500).json({ success: false, error: 'Internal Server Error', message: err.message || 'Unexpected error' });
}

export function errorHandler(err, _, res, next) {
  console.error(err);
  if (res.headersSent) return next(err);

  if (err.name === 'ValidationError') {
    return handleValidationError(err, res);
  }

  if (err.status && err.message) {
    return handleStatusError(err, res);
  }

  return handleInternalError(err, res);
}
