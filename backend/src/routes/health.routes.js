const express = require('express');
const router = express.Router();
const { testConnection } = require('../config/cloudinary.config');
const { asyncHandler } = require('../middleware/error.middleware');

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/', asyncHandler(async (req, res) => {
  const cloudinaryConnected = await testConnection();

  const health = {
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      api: 'OK',
      cloudinary: cloudinaryConnected ? 'OK' : 'ERROR'
    }
  };

  const statusCode = cloudinaryConnected ? 200 : 503;
  res.status(statusCode).json(health);
}));

module.exports = router;
