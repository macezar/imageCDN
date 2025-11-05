import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.error || error.message || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

const imageAPI = {
  /**
   * Upload an image
   */
  uploadImage: async (file, options = {}) => {
    const formData = new FormData();
    formData.append('image', file);

    if (options.folder) formData.append('folder', options.folder);
    if (options.publicId) formData.append('publicId', options.publicId);
    if (options.tags) {
      if (Array.isArray(options.tags)) {
        options.tags.forEach(tag => formData.append('tags', tag));
      } else {
        formData.append('tags', options.tags);
      }
    }
    if (options.optimize !== undefined) {
      formData.append('optimize', options.optimize);
    }

    const response = await api.post('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: options.onUploadProgress,
    });

    return response.data;
  },

  /**
   * Get image by public ID
   */
  getImage: async (publicId) => {
    const response = await api.get(`/images/${encodeURIComponent(publicId)}`);
    return response.data;
  },

  /**
   * Delete an image
   */
  deleteImage: async (publicId) => {
    const response = await api.delete(`/images/${encodeURIComponent(publicId)}`);
    return response.data;
  },

  /**
   * List all images
   */
  listImages: async (options = {}) => {
    const params = new URLSearchParams();
    if (options.maxResults) params.append('maxResults', options.maxResults);
    if (options.nextCursor) params.append('nextCursor', options.nextCursor);
    if (options.prefix) params.append('prefix', options.prefix);
    if (options.tags) params.append('tags', options.tags);

    const response = await api.get(`/images?${params.toString()}`);
    return response.data;
  },

  /**
   * Search images
   */
  searchImages: async (expression, options = {}) => {
    const params = new URLSearchParams();
    params.append('expression', expression);
    if (options.maxResults) params.append('maxResults', options.maxResults);
    if (options.nextCursor) params.append('nextCursor', options.nextCursor);

    const response = await api.get(`/images/search/query?${params.toString()}`);
    return response.data;
  },

  /**
   * Bulk delete images
   */
  bulkDelete: async (publicIds) => {
    const response = await api.post('/images/bulk-delete', { publicIds });
    return response.data;
  },

  /**
   * Get usage statistics
   */
  getStats: async () => {
    const response = await api.get('/images/stats/usage');
    return response.data;
  },

  /**
   * Health check
   */
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default imageAPI;
