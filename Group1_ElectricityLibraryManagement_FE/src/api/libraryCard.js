import axiosClient from './axiosClient';

const libraryCardAPI = {
  /**
   * Get current user's library card
   * GET /api/v1/users/me/library-card
   */
  getMyCard: async () => {
    return await axiosClient.get('/api/v1/users/me/library-card');
  },

  /**
   * Request library card renewal
   * POST /api/v1/users/me/library-card/renew
   */
  requestRenewal: async (data) => {
    return await axiosClient.post('/api/v1/users/me/library-card/renew', data);
  },

  // ==================== ADMIN ENDPOINTS ====================

  /**
   * Create library card for a reader (Admin)
   * POST /api/v1/admin/library-cards
   */
  createCard: async (data) => {
    return await axiosClient.post('/api/v1/admin/library-cards', data);
  },

  /**
   * Get all library cards (Admin)
   * GET /api/v1/admin/library-cards
   */
  getAllCards: async (params = {}) => {
    return await axiosClient.get('/api/v1/admin/library-cards', { params });
  },

  /**
   * Get library card by reader ID (Admin)
   * GET /api/v1/admin/library-cards/reader/{readerId}
   */
  getCardByReaderId: async (readerId) => {
    return await axiosClient.get(`/api/v1/admin/library-cards/reader/${readerId}`);
  },

  /**
   * Update card status (Admin)
   * PUT /api/v1/admin/library-cards/{cardId}/status
   */
  updateCardStatus: async (cardId, status) => {
    return await axiosClient.put(`/api/v1/admin/library-cards/${cardId}/status`, null, {
      params: { status }
    });
  },

  /**
   * Approve renewal request (Admin)
   * POST /api/v1/admin/library-cards/renewals/{renewalId}/approve
   */
  approveRenewal: async (renewalId) => {
    return await axiosClient.post(`/api/v1/admin/library-cards/renewals/${renewalId}/approve`);
  }
};

export default libraryCardAPI;
