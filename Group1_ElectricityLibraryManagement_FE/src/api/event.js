import axiosClient from './axiosClient';

const eventAPI = {
  // Public endpoints - no authentication required
  getPublicEvents: (params = {}) => {
    return axiosClient.get('/api/v1/public/events', { params });
  },

  getEventById: (id) => {
    return axiosClient.get(`/api/v1/public/events/${id}`);
  },

  // Admin endpoints - authentication required
  createEvent: (data) => {
    return axiosClient.post('/api/v1/admin/events', data);
  },

  updateEvent: (id, data) => {
    return axiosClient.put(`/api/v1/admin/events/${id}`, data);
  },

  deleteEvent: (id) => {
    return axiosClient.delete(`/api/v1/admin/events/${id}`);
  }
};

export default eventAPI;
