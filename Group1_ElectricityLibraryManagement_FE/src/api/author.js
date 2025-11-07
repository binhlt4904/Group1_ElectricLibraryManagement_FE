import axiosClient from "./axiosClient";

const authorApi = {
  // ✅ Danh sách tác giả
  getPaged: (page = 0, size = 10, search = "") => {
    let url = `/api/v1/public/authors?page=${page}&size=${size}`;
    if (search.trim() !== "") {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    return axiosClient.get(url);
  },

  // ✅ Lấy 1 tác giả
  getById: (id) => axiosClient.get(`/api/v1/public/authors/${id}`),

  // ✅ Thêm mới
  create: (data) => axiosClient.post("/api/v1/public/authors", data),

  // ✅ Cập nhật
  update: (id, data) => axiosClient.put(`/api/v1/public/authors/${id}`, data),

  // ✅ Xóa
  delete: (id) => axiosClient.delete(`/api/v1/public/authors/${id}`),

  // ✅ Upload avatar
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post("/api/v1/upload/author-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  findAll: async () => { return await axiosClient.get('/api/v1/public/authors/') },

};

export default authorApi;
