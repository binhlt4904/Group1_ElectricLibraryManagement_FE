import axiosClient from './axiosClient';

const eventRegistrationAPI = {
  // Register for an event
  registerForEvent: (eventId, data) => {
    return axiosClient.post(`/api/v1/events/${eventId}/register`, data);
  },

  // Cancel registration for an event
  cancelRegistration: (eventId) => {
    return axiosClient.delete(`/api/v1/events/${eventId}/register`);
  },

  // Get all registrations for an event (admin only)
  getEventRegistrations: (eventId, params = {}) => {
    return axiosClient.get(`/api/v1/events/${eventId}/registrations`, { params });
  },

  // Check if user is registered for an event
  isUserRegistered: (eventId) => {
    return axiosClient.get(`/api/v1/events/${eventId}/is-registered`);
  },

  // Get registration details
  getRegistration: (eventId) => {
    return axiosClient.get(`/api/v1/events/${eventId}/registration`);
  }
};

export default eventRegistrationAPI;
