import axiosClient from "../axiosClient";

// GỌI ĐÚNG ENDPOINT TỪ BE: /api/v1/admin/...
const accountManagementApi = {
  // === LIST (Page<AccountDto>) ===
  // Readers = role_id = 3
  findReaders: async ({ full_name = "", status = "", page = 0, size = 10 } = {}) => {
    const params = { page, size, role_id: 3 };
    if (full_name?.trim()) params.full_name = full_name.trim();
    if (status?.trim()) params.status = status.trim();
    return await axiosClient.get("/api/v1/admin/accounts", { params });
  },

  // Staff = role_id = 2
  findStaff: async ({ full_name = "", status = "", page = 0, size = 10 } = {}) => {
    const params = { page, size, role_id: 2 };
    if (full_name?.trim()) params.full_name = full_name.trim();
    if (status?.trim()) params.status = status.trim();
    return await axiosClient.get("/api/v1/admin/accounts", { params });
  },

  // === CREATE STAFF (201 Created -> CreateStaffResponse) ===
  createStaff: async (data) => {
    return await axiosClient.post("/api/v1/admin/accounts/create", data);
  },

  // === UPDATE ACCOUNT (staff hoặc reader) ===
  updateAccount: async (id, data) => {
    return await axiosClient.put(`/api/v1/admin/accounts/update/${id}`, data);
  },

  // === DELETE ACCOUNT (204 No Content) ===
  deleteAccount: async (id) => {
    return await axiosClient.delete(`/api/v1/admin/accounts/delete/${id}`);
  },
};

export default accountManagementApi;
