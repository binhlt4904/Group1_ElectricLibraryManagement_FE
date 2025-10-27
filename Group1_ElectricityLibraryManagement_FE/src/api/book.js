import axiosClient from "./axiosClient";

const bookApi = {
    findAll: async () => {
        return await axiosClient.get("/api/v1/public/books/");
    },
    findAllAdmin: async () => {
        return await axiosClient.get("/api/v1/public/admin/books/");
    },
    addBook: async (data) => {
        return await axiosClient.post("/api/v1/public/admin/books/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
};

export default bookApi;