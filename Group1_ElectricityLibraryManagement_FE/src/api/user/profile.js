// src/api/user/profile.js
import axiosClient from '../axiosClient';

const profileApi = {
  // GET profile
  get: async () => {
    const res = await axiosClient.get('/api/v1/profile/me');
    return res?.data;
  },

  // PUT update profile
  update: async (data) => {
    // data: payload update (sẽ làm sau)
    const res = await axiosClient.put('/api/v1/profile/edit', data);
    return res?.data;
  },

  // PUT change password
  changePassword: async (data) => {
    // data: { oldPassword, newPassword }
    const res = await axiosClient.put('/api/v1/profile/change-password', data);
    return res?.data;
  },
};

export default profileApi;
