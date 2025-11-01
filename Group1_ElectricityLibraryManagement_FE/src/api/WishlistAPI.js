import axiosClient from "./axiosClient";

export const WishlistAPI = {
  getAll: (readerId) => axiosClient.get(`/api/v1/wishlist/${readerId}`),
  toggle: (readerId, bookId) =>
    axiosClient.post(`/api/v1/wishlist/${readerId}/toggle/${bookId}`),
};
