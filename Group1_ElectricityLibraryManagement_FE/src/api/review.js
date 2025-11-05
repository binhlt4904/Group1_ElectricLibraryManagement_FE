import axiosClient from "./axiosClient";

const reviewApi = {
  // 🔹 Lấy danh sách review theo bookId
  findByBookId: async (bookId) => {
    return await axiosClient.get(`/api/v1/public/books/${bookId}/reviews`);
  },

  // 🔹 Thêm review mới
  create: async (data) => {
  return await axiosClient.post(
    `/api/v1/public/books/${data.bookId}/reviews`,
    {
      readerId: data.readerId,
      note: data.note,
      rate: data.rate,
      roleName: data.roleName,
    }
  );
},


  // 🔹 Sửa review (người viết hoặc staff)
  update: async (bookId, reviewId, data, userId, role) => {
  return await axiosClient.put(
    `/api/v1/public/books/${bookId}/reviews/${reviewId}?requesterId=${userId}&role=${role}`,
    data
  );
},




  // 🔹 Xoá review (người viết hoặc staff)
  remove: async (bookId, reviewId, userId, roleName = "USER") => {
  return await axiosClient.delete(
    `/api/v1/public/books/${bookId}/reviews/${reviewId}?requesterId=${userId}&role=${roleName}`
  );
},

};

export default reviewApi;
