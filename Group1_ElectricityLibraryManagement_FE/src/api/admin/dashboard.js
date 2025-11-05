// src/api/admin/dashboard.js
import axiosClient from "../axiosClient";

const dashboardApi = {
  // GET /api/v1/admin/dashboard/total-revenue
  getTotalRevenue: async () => {
    return await axiosClient.get("/api/v1/admin/dashboard/total-revenue");
  },

  // GET /api/v1/admin/dashboard/total-books
  getTotalBooks: async () => {
    return await axiosClient.get("/api/v1/admin/dashboard/total-books");
  },

  // GET /api/v1/admin/dashboard/total-readers
  getTotalReaders: async () => {
    return await axiosClient.get("/api/v1/admin/dashboard/total-readers");
  },

  // GET /api/v1/admin/dashboard/current-borrowals
  getCurrentBorrowals: async () => {
    return await axiosClient.get("/api/v1/admin/dashboard/current-borrowals");
  },

  // GET /api/v1/admin/dashboard/overdue-items
  getOverdueItems: async () => {
    return await axiosClient.get("/api/v1/admin/dashboard/overdue-items");
  },

  // GET /api/v1/admin/dashboard/popular-books
  getPopularBooks: async () => {
    return await axiosClient.get("/api/v1/admin/dashboard/popular-books");
  },

  // GET /api/v1/admin/dashboard/recent-activities
  getRecentActivities: async () => {
    return await axiosClient.get("/api/v1/admin/dashboard/recent-activities");
  },

  // GET /api/v1/admin/dashboard/borrowing-trends (năm hiện tại)
  getBorrowingTrendsCurrentYear: async () => {
    return await axiosClient.get("/api/v1/admin/dashboard/borrowing-trends");
  },
  //Get /api/v1/admin/dashboard/export-excel
  exportReportExcel: async (params = {}) => {
    return await axiosClient.get("/api/v1/admin/dashboard/export-excel", {
      params,
      responseType: "blob", // nhận file nhị phân
    });
  },
};

export default dashboardApi;
