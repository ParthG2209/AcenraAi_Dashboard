// catch-all error handler
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);

  let error = { ...err };
  error.message = err.message;

  // mongo ObjectId error
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // duplicate key error
  if (err.code === 11000) {
    const message = 'Duplicate field value';
    error = { message, statusCode: 400 };
  }

  // validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server error',
  });
};

module.exports = errorHandler;