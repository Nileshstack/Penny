const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  let statusCode = error.statusCode || error.status || 500;
  let message = statusCode < 500 ? error.message : 'Internal server error';

  if (error.name === 'ValidationError' || error.name === 'CastError' || error.name === 'SyntaxError') {
    statusCode = 400;
    message = 'Invalid request';
  } else if (error.type === 'entity.too.large') {
    statusCode = 413;
    message = 'Request body is too large';
  } else if (error.code === 11000) {
    statusCode = 409;
    message = 'A user with this email already exists';
  }

  if (statusCode >= 500) {
    console.error('Request failed', { name: error.name || 'Error', statusCode });
  }

  res.status(statusCode).json({ success: false, message });
};

module.exports = errorHandler;
