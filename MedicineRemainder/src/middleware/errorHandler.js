import multer from 'multer';

/**
 * Centralized error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Application Error:', err);

  // Handle Multer upload errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size limit exceeded. Maximum allowed size is 15MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`
    });
  }

  // Handle custom upload filter errors
  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  // Generic server error
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};
