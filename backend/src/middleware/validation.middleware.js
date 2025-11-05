const Joi = require('joi');
const config = require('../config/app.config');

/**
 * Validate file upload
 */
const validateFileUpload = (req, res, next) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided. Please upload a file with the field name "image"'
      });
    }

    const file = req.files.image;

    // Check file size
    if (file.size > config.maxFileSize) {
      return res.status(400).json({
        success: false,
        error: `File size exceeds limit. Maximum size: ${config.maxFileSize / 1024 / 1024}MB`
      });
    }

    // Check file format
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!config.allowedFormats.includes(fileExtension)) {
      return res.status(400).json({
        success: false,
        error: `Invalid file format. Allowed formats: ${config.allowedFormats.join(', ')}`
      });
    }

    // Validate mimetype
    const validMimetypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml'
    ];

    if (!validMimetypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid file type. Please upload an image file.'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'File validation failed'
    });
  }
};

/**
 * Validate upload options
 */
const validateUploadOptions = (req, res, next) => {
  const schema = Joi.object({
    folder: Joi.string().max(100).optional(),
    publicId: Joi.string().max(100).optional(),
    tags: Joi.alternatives().try(
      Joi.string(),
      Joi.array().items(Joi.string())
    ).optional(),
    optimize: Joi.boolean().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }

  next();
};

/**
 * Validate public ID parameter
 */
const validatePublicId = (req, res, next) => {
  const schema = Joi.object({
    publicId: Joi.string().required()
  });

  const { error } = schema.validate(req.params);
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Invalid public ID'
    });
  }

  next();
};

/**
 * Validate list query parameters
 */
const validateListQuery = (req, res, next) => {
  const schema = Joi.object({
    maxResults: Joi.number().integer().min(1).max(500).optional(),
    nextCursor: Joi.string().optional(),
    prefix: Joi.string().optional(),
    tags: Joi.boolean().optional()
  });

  const { error } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }

  next();
};

/**
 * Validate search query parameters
 */
const validateSearchQuery = (req, res, next) => {
  const schema = Joi.object({
    expression: Joi.string().required(),
    maxResults: Joi.number().integer().min(1).max(500).optional(),
    nextCursor: Joi.string().optional()
  });

  const { error } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }

  next();
};

/**
 * Validate bulk delete request
 */
const validateBulkDelete = (req, res, next) => {
  const schema = Joi.object({
    publicIds: Joi.array().items(Joi.string()).min(1).max(100).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }

  next();
};

module.exports = {
  validateFileUpload,
  validateUploadOptions,
  validatePublicId,
  validateListQuery,
  validateSearchQuery,
  validateBulkDelete
};
