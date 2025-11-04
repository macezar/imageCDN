const { cloudinary } = require('../config/cloudinary.config');
const sharp = require('sharp');

class ImageService {
  /**
   * Upload an image to Cloudinary
   * @param {Object} file - File object from express-fileupload
   * @param {Object} options - Additional upload options
   * @returns {Promise<Object>} Upload result with image details
   */
  async uploadImage(file, options = {}) {
    try {
      // Validate file
      if (!file) {
        throw new Error('No file provided');
      }

      // Optional: Optimize image before upload using sharp
      let buffer = file.data;
      if (options.optimize !== false) {
        buffer = await this.optimizeImage(file.data, file.mimetype);
      }

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: options.folder || 'uploads',
            public_id: options.publicId,
            transformation: options.transformation,
            resource_type: 'auto',
            tags: options.tags || [],
            context: options.context,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        uploadStream.end(buffer);
      });

      return {
        success: true,
        data: {
          publicId: result.public_id,
          url: result.secure_url,
          format: result.format,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
          createdAt: result.created_at,
          resourceType: result.resource_type,
          type: result.type,
          thumbnail: this.getThumbnailUrl(result.public_id, result.format)
        }
      };
    } catch (error) {
      throw new Error(`Image upload failed: ${error.message}`);
    }
  }

  /**
   * Optimize image before upload
   * @param {Buffer} buffer - Image buffer
   * @param {String} mimetype - Image mimetype
   * @returns {Promise<Buffer>} Optimized image buffer
   */
  async optimizeImage(buffer, mimetype) {
    try {
      // Skip optimization for SVG
      if (mimetype === 'image/svg+xml') {
        return buffer;
      }

      // Use sharp to optimize
      let sharpInstance = sharp(buffer);

      // Get metadata
      const metadata = await sharpInstance.metadata();

      // Resize if too large (max 4096px on longest side)
      if (metadata.width > 4096 || metadata.height > 4096) {
        sharpInstance = sharpInstance.resize(4096, 4096, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }

      // Optimize based on format
      if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
        sharpInstance = sharpInstance.jpeg({ quality: 85, progressive: true });
      } else if (metadata.format === 'png') {
        sharpInstance = sharpInstance.png({ quality: 85, compressionLevel: 9 });
      } else if (metadata.format === 'webp') {
        sharpInstance = sharpInstance.webp({ quality: 85 });
      }

      return await sharpInstance.toBuffer();
    } catch (error) {
      // If optimization fails, return original buffer
      console.warn('Image optimization failed, using original:', error.message);
      return buffer;
    }
  }

  /**
   * Get an image by public ID
   * @param {String} publicId - Cloudinary public ID
   * @param {Object} options - Transformation options
   * @returns {Promise<Object>} Image details
   */
  async getImage(publicId, options = {}) {
    try {
      const resource = await cloudinary.api.resource(publicId, {
        resource_type: options.resourceType || 'image'
      });

      return {
        success: true,
        data: {
          publicId: resource.public_id,
          url: resource.secure_url,
          format: resource.format,
          width: resource.width,
          height: resource.height,
          bytes: resource.bytes,
          createdAt: resource.created_at,
          resourceType: resource.resource_type,
          type: resource.type,
          thumbnail: this.getThumbnailUrl(resource.public_id, resource.format),
          // Apply transformations if requested
          transformedUrl: options.transformation
            ? this.getTransformedUrl(publicId, options.transformation)
            : resource.secure_url
        }
      };
    } catch (error) {
      if (error.error?.http_code === 404) {
        throw new Error('Image not found');
      }
      throw new Error(`Failed to retrieve image: ${error.message}`);
    }
  }

  /**
   * Delete an image from Cloudinary
   * @param {String} publicId - Cloudinary public ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteImage(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);

      if (result.result === 'ok' || result.result === 'not found') {
        return {
          success: true,
          message: result.result === 'ok'
            ? 'Image deleted successfully'
            : 'Image not found',
          publicId
        };
      }

      throw new Error('Deletion failed');
    } catch (error) {
      throw new Error(`Image deletion failed: ${error.message}`);
    }
  }

  /**
   * List all images with pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} List of images
   */
  async listImages(options = {}) {
    try {
      const {
        maxResults = 30,
        nextCursor,
        prefix,
        tags,
        resourceType = 'image'
      } = options;

      const queryOptions = {
        resource_type: resourceType,
        max_results: Math.min(maxResults, 500),
        type: 'upload'
      };

      if (nextCursor) queryOptions.next_cursor = nextCursor;
      if (prefix) queryOptions.prefix = prefix;
      if (tags) queryOptions.tags = true;

      const result = await cloudinary.api.resources(queryOptions);

      return {
        success: true,
        data: {
          images: result.resources.map(resource => ({
            publicId: resource.public_id,
            url: resource.secure_url,
            format: resource.format,
            width: resource.width,
            height: resource.height,
            bytes: resource.bytes,
            createdAt: resource.created_at,
            thumbnail: this.getThumbnailUrl(resource.public_id, resource.format)
          })),
          totalCount: result.total_count,
          nextCursor: result.next_cursor
        }
      };
    } catch (error) {
      throw new Error(`Failed to list images: ${error.message}`);
    }
  }

  /**
   * Search images by tag or expression
   * @param {Object} options - Search options
   * @returns {Promise<Object>} Search results
   */
  async searchImages(options = {}) {
    try {
      const {
        expression,
        maxResults = 30,
        nextCursor
      } = options;

      if (!expression) {
        throw new Error('Search expression is required');
      }

      const result = await cloudinary.search
        .expression(expression)
        .max_results(Math.min(maxResults, 500))
        .next_cursor(nextCursor)
        .execute();

      return {
        success: true,
        data: {
          images: result.resources.map(resource => ({
            publicId: resource.public_id,
            url: resource.secure_url,
            format: resource.format,
            width: resource.width,
            height: resource.height,
            bytes: resource.bytes,
            createdAt: resource.created_at,
            thumbnail: this.getThumbnailUrl(resource.public_id, resource.format)
          })),
          totalCount: result.total_count,
          nextCursor: result.next_cursor
        }
      };
    } catch (error) {
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  /**
   * Get image statistics
   * @returns {Promise<Object>} Usage statistics
   */
  async getStats() {
    try {
      const usage = await cloudinary.api.usage();

      return {
        success: true,
        data: {
          used: {
            credits: usage.credits?.used || 0,
            storage: usage.storage?.used || 0,
            bandwidth: usage.bandwidth?.used || 0,
            transformations: usage.transformations?.used || 0
          },
          limit: {
            credits: usage.credits?.limit || 0,
            storage: usage.storage?.limit || 0,
            bandwidth: usage.bandwidth?.limit || 0,
            transformations: usage.transformations?.limit || 0
          },
          percentage: {
            credits: usage.credits?.used_percent || 0,
            storage: usage.storage?.used_percent || 0,
            bandwidth: usage.bandwidth?.used_percent || 0
          }
        }
      };
    } catch (error) {
      throw new Error(`Failed to get statistics: ${error.message}`);
    }
  }

  /**
   * Generate thumbnail URL
   * @param {String} publicId - Image public ID
   * @param {String} format - Image format
   * @returns {String} Thumbnail URL
   */
  getThumbnailUrl(publicId, format) {
    return cloudinary.url(publicId, {
      transformation: [
        { width: 200, height: 200, crop: 'fill' },
        { quality: 'auto', fetch_format: 'auto' }
      ],
      format: format
    });
  }

  /**
   * Generate transformed URL
   * @param {String} publicId - Image public ID
   * @param {Object} transformation - Transformation options
   * @returns {String} Transformed URL
   */
  getTransformedUrl(publicId, transformation) {
    return cloudinary.url(publicId, {
      transformation: transformation
    });
  }

  /**
   * Bulk delete images
   * @param {Array<String>} publicIds - Array of public IDs
   * @returns {Promise<Object>} Deletion results
   */
  async bulkDelete(publicIds) {
    try {
      if (!Array.isArray(publicIds) || publicIds.length === 0) {
        throw new Error('Invalid public IDs array');
      }

      const result = await cloudinary.api.delete_resources(publicIds);

      return {
        success: true,
        data: {
          deleted: result.deleted,
          deletedCount: Object.keys(result.deleted).length,
          partial: result.partial
        }
      };
    } catch (error) {
      throw new Error(`Bulk deletion failed: ${error.message}`);
    }
  }
}

module.exports = new ImageService();
