import axiosClient from "./axiosClient";

const publisherApi = {
  /** 🔹 Lấy danh sách tất cả nhà xuất bản */
  getAll: async () => {
    return await axiosClient.get("/api/v1/public/publishers");
  },

  getPaged: (page = 0, size = 10, search = "") => {
    let url = `/api/v1/public/publishers?page=${page}&size=${size}`;
    if (search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    return axiosClient.get(url);
  },
  /** 🔹 Lấy chi tiết 1 nhà xuất bản theo ID */
  getById: async (id) => {
    return await axiosClient.get(`/api/v1/public/publishers/${id}`);
  },

  /** 🔹 Tạo mới nhà xuất bản */
  create: async (publisherRequest) => {
    return await axiosClient.post("/api/v1/public/publishers", publisherRequest);
  },

  /** 🔹 Cập nhật nhà xuất bản */
  update: async (id, publisherRequest) => {
    return await axiosClient.put(`/api/v1/public/publishers/${id}`, publisherRequest);
  },

  /** 🔹 Xóa mềm nhà xuất bản */
  delete: async (id) => {
    return await axiosClient.delete(`/api/v1/public/publishers/${id}`);
  },
};

export default publisherApi;
