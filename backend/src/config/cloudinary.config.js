const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Validate configuration
const validateConfig = () => {
  const { cloud_name, api_key, api_secret } = cloudinary.config();

  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      'Cloudinary configuration is incomplete. Please check your environment variables.'
    );
  }
};

// Test connection to Cloudinary
const testConnection = async () => {
  try {
    await cloudinary.api.ping();
    console.log('✓ Successfully connected to Cloudinary');
    return true;
  } catch (error) {
    console.error('✗ Failed to connect to Cloudinary:', error.message);
    return false;
  }
};

module.exports = {
  cloudinary,
  validateConfig,
  testConnection
};
