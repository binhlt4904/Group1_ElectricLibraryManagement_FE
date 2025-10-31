import axiosClient from "./axiosClient";

const bookApi = {
    findAll: async (params) => {
        return await axiosClient.get("/api/v1/public/books/",{params});
    },
    findAllAdmin: async (params) => {
        return await axiosClient.get("/api/v1/public/admin/books/",{params});
    },
    addBook: async (data) => {
        return await axiosClient.post("/api/v1/public/admin/books/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    findBookAdminById: async (id) => {
        return await axiosClient.get(`/api/v1/public/admin/books/${id}`);
    },
    findBookUserById: async (id) => {
        return await axiosClient.get(`/api/v1/public/books/${id}`);
    },
    findBookContentsById: async (id) => {
        return await axiosClient.get(`/api/v1/public/admin/books/${id}/contents`);
    },
    findReviewsByBookId: async (id) => {
        return await axiosClient.get(`/api/v1/public/books/${id}/reviews`);
    },

    getBookContentUserById: async(bookId) =>{
        return await axiosClient.get(`/api/v1/public/books/${bookId}/contents/user`)
    }
};

export default bookApi;