import axiosClient, {axiosRefresh} from "./axiosClient";
 const auth = {
    login: async (userRequest) => {
        try {
            return await axiosClient.post("/api/v1/login", userRequest);
        } catch (error) {
            throw error;
        }
    },
    refreshToken: async () => {
        try {
            const response = await axiosRefresh.post("/api/v1/refresh");
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    logout: async () => {
        try {
            return await axiosClient.post("/api/v1/logout");
        } catch (error) {
            throw error;
        }
    },
}
export default auth;
