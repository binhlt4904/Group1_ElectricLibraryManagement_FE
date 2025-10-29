import axiosClient from "./axiosClient";

const bookApi = {
    findAll: async () => {
        return await axiosClient.get("/api/v1/public/books/");
    },
    findAllAdmin: async (params) => {
        return await axiosClient.get("/api/v1/public/admin/books/",{params});
    },
    addBook: async (data) => {
        return await axiosClient.post("/api/v1/public/admin/books/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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