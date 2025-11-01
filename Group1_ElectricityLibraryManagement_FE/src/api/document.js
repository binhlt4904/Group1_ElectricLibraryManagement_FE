import axiosClient from './axiosClient';

const documentAPI = {
  /**
   * Upload a document file
   * @param {File} file - File to upload
   * @returns {Promise} Upload response with file path
   */
  uploadDocument: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return axiosClient.post('/api/v1/admin/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  /**
   * Create a new document with metadata
   * @param {Object} data - Document metadata
   * @returns {Promise} Created document
   */
  createDocument: (data) => {
    return axiosClient.post('/api/v1/admin/documents', data);
  },

  /**
   * Get all documents with pagination and filters
   * @param {Object} params - Query parameters
   * @param {string} params.title - Document title filter
   * @param {string} params.categoryName - Category filter
   * @param {number} params.page - Page number (default: 0)
   * @param {number} params.size - Page size (default: 10)
   * @returns {Promise} Paginated documents
   */
  getAllDocuments: (params = {}) => {
    return axiosClient.get('/api/v1/admin/documents', { params });
  },

  /**
   * Get a specific document by ID
   * @param {number} id - Document ID
   * @returns {Promise} Document details
   */
  getDocumentById: (id) => {
    return axiosClient.get(`/api/v1/admin/documents/${id}`);
  },

  /**
   * Update a document
   * @param {number} id - Document ID
   * @param {Object} data - Updated document data
   * @returns {Promise} Updated document
   */
  updateDocument: (id, data) => {
    return axiosClient.put(`/api/v1/admin/documents/${id}`, data);
  },

  /**
   * Delete a document
   * @param {number} id - Document ID
   * @returns {Promise} Response
   */
  deleteDocument: (id) => {
    return axiosClient.delete(`/api/v1/admin/documents/${id}`);
  },

  /**
   * Download a document file
   * @param {string} filePath - File path from server
   * @param {string} fileName - File name for download
   * @returns {Promise} File blob
   */
  downloadDocument: (filePath, fileName) => {
    return axiosClient.get(`/api/v1/admin/documents/download`, {
      params: { filePath },
      responseType: 'blob'
    }).then(response => {
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
  },

  /**
   * Get public documents (for users)
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 0)
   * @param {number} params.size - Page size (default: 10)
   * @returns {Promise} Public documents
   */
  getPublicDocuments: (params = {}) => {
    return axiosClient.get('/api/v1/public/documents', { params });
  },

  /**
   * Get document by category
   * @param {string} category - Category name
   * @param {Object} params - Query parameters
   * @returns {Promise} Documents in category
   */
  getDocumentsByCategory: (category, params = {}) => {
    return axiosClient.get(`/api/v1/documents/category/${category}`, { params });
  }
};

export default documentAPI;

