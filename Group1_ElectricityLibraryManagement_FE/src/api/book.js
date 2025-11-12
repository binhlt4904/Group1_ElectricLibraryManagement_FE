import axiosClient from "./axiosClient";

const bookApi = {
    findAll: async (params) => {
        return await axiosClient.get("/api/v1/public/books/",{params});
    },
    findListBook: async () => {
        return await axiosClient.get("/api/v1/public/books/list-book");
    },
    findAllAdmin: async (params) => {
        return await axiosClient.get("/api/v1/admin/books/",{params});
    },
    addBook: async (data) => {
        return await axiosClient.post("/api/v1/admin/books/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    findBookAdminById: async (id) => {
        return await axiosClient.get(`/api/v1/admin/books/${id}`);
    },
    findBookUserById: async (id) => {
        return await axiosClient.get(`/api/v1/public/books/${id}`);
    },
    findBookContentsById: async (id) => {
        return await axiosClient.get(`/api/v1/admin/books/${id}/contents`);
    },
    findBookContentsUserById: async (id) => {
        return await axiosClient.get(`/api/v1/public/book-contents/${id}/contents`);
    },
    findReviewsByBookId: async (id) => {
        return await axiosClient.get(`/api/v1/public/books/${id}/reviews`);
    },

    getBookContentUserByBookId: async(bookId) =>{
        return await axiosClient.get(`/api/v1/public/books/${bookId}/contents/user`)
    },
    createBookContent: async (formData, config) => {
        return await axiosClient.post("/api/v1/admin/book-contents", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            ...config,
        });
    },
    updateBookContent: async (contentId, formData) => {
        return await axiosClient.patch(`/api/v1/admin/book-contents/${contentId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
    getBookContentByBookIdAndChapter: async(bookId, chapter) =>{
        console.log("dã goi detail cua bookId "+ bookId + " chapter " + chapter);
        return await axiosClient.get(`/api/v1/public/book-contents/${bookId}/${chapter}`);
    },
    getRelatedBooks: async (bookId) => {
        return await axiosClient.get(`/api/v1/public/books/${bookId}/related`);
    },
    update : async (bookId, data) => {
        console.log(data);
        return await axiosClient.patch(`/api/v1/admin/books/${bookId}`, data);
    },
};

export default bookApi;