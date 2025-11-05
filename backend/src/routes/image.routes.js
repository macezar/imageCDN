const express = require('express');
const router = express.Router();
const imageService = require('../services/image.service');
const { asyncHandler } = require('../middleware/error.middleware');
const {
  validateFileUpload,
  validateUploadOptions,
  validatePublicId,
  validateListQuery,
  validateSearchQuery,
  validateBulkDelete
} = require('../middleware/validation.middleware');

/**
 * @route   POST /api/images/upload
 * @desc    Upload a new image
 * @access  Public
 */
router.post(
  '/upload',
  validateFileUpload,
  validateUploadOptions,
  asyncHandler(async (req, res) => {
    const file = req.files.image;
    const options = {
      folder: req.body.folder,
      publicId: req.body.publicId,
      tags: req.body.tags ? (Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags]) : [],
      optimize: req.body.optimize !== 'false'
    };

    const result = await imageService.uploadImage(file, options);
    res.status(201).json(result);
  })
);

/**
 * @route   GET /api/images/:publicId
 * @desc    Get image details by public ID
 * @access  Public
 */
router.get(
  '/:publicId',
  validatePublicId,
  asyncHandler(async (req, res) => {
    // Decode the public ID (may contain slashes)
    const publicId = decodeURIComponent(req.params.publicId);
    const result = await imageService.getImage(publicId);
    res.json(result);
  })
);

/**
 * @route   DELETE /api/images/:publicId
 * @desc    Delete an image by public ID
 * @access  Public
 */
router.delete(
  '/:publicId',
  validatePublicId,
  asyncHandler(async (req, res) => {
    const publicId = decodeURIComponent(req.params.publicId);
    const result = await imageService.deleteImage(publicId);
    res.json(result);
  })
);

/**
 * @route   GET /api/images
 * @desc    List all images with pagination
 * @access  Public
 */
router.get(
  '/',
  validateListQuery,
  asyncHandler(async (req, res) => {
    const options = {
      maxResults: parseInt(req.query.maxResults) || 30,
      nextCursor: req.query.nextCursor,
      prefix: req.query.prefix,
      tags: req.query.tags === 'true'
    };

    const result = await imageService.listImages(options);
    res.json(result);
  })
);

/**
 * @route   GET /api/images/search
 * @desc    Search images
 * @access  Public
 */
router.get(
  '/search/query',
  validateSearchQuery,
  asyncHandler(async (req, res) => {
    const options = {
      expression: req.query.expression,
      maxResults: parseInt(req.query.maxResults) || 30,
      nextCursor: req.query.nextCursor
    };

    const result = await imageService.searchImages(options);
    res.json(result);
  })
);

/**
 * @route   POST /api/images/bulk-delete
 * @desc    Delete multiple images
 * @access  Public
 */
router.post(
  '/bulk-delete',
  validateBulkDelete,
  asyncHandler(async (req, res) => {
    const { publicIds } = req.body;
    const result = await imageService.bulkDelete(publicIds);
    res.json(result);
  })
);

/**
 * @route   GET /api/images/stats/usage
 * @desc    Get image storage statistics
 * @access  Public
 */
router.get(
  '/stats/usage',
  asyncHandler(async (req, res) => {
    const result = await imageService.getStats();
    res.json(result);
  })
);

module.exports = router;
