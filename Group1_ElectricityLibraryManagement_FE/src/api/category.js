import axiosClient from "./axiosClient";

const categoryApi = {
    findAll: async () => {
        return await axiosClient.get("/api/v1/public/categories/");
    },
    
};

export default categoryApi;