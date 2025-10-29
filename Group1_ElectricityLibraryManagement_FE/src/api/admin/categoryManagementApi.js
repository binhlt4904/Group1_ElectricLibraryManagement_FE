import axiosClient from "../axiosClient";

const categoryManagementApi = {
  // GET /api/v1/admin/categories?keyword=&isDeleted=
  getAll: async ({ keyword = "", isDeleted = null } = {}) => {
    const params = {};
    if (keyword?.trim()) params.keyword = keyword.trim();
    if (isDeleted !== null && isDeleted !== undefined) params.isDeleted = isDeleted;
    return await axiosClient.get("/api/v1/admin/categories", { params });
  },

  // POST /api/v1/admin/categories/create
  create: async (data) => {
    // data: { name: string }
    return await axiosClient.post("/api/v1/admin/categories/create", data);
  },

  // PUT /api/v1/admin/categories/update
  update: async (data) => {
    // data: { id: number, name: string }
    return await axiosClient.put("/api/v1/admin/categories/update", data);
  },

  // DELETE /api/v1/admin/categories/delete/{id}
  remove: async (id) => {
    return await axiosClient.delete(`/api/v1/admin/categories/delete/${id}`);
  },

  // PUT /api/v1/admin/categories/restore/{id}
  restore: async (id) => {
    return await axiosClient.put(`/api/v1/admin/categories/restore/${id}`);
  }
};

export default categoryManagementApi;
