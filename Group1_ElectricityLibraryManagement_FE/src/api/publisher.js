import axiosClient from "./axiosClient";

const publisherApi = {
    findAll: async () => {
        return await axiosClient.get("/api/v1/public/publishers/");
    },
    
};

export default publisherApi;