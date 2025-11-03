import axiosClient from './axiosClient';

const libraryCardAPI = {
  // Get current user's library card
  getMyCard: () => {
    return axiosClient.get('/api/v1/users/me/library-card');
  },

  // Request card renewal
  requestRenewal: (data) => {
    return axiosClient.post('/api/v1/users/me/library-card/renew', data);
  }
};

export default libraryCardAPI;
