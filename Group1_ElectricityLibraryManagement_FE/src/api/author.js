import axiosClient from "./axiosClient";

const authorApi = {
    findAll: async () => {
        return await axiosClient.get("/api/v1/public/authors/");
    },
    
};

export default authorApi;