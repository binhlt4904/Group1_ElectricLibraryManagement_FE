import axiosClient from "../axiosClient";
const borrowalApi = {
    getBorrowalByCriteria: async (params) => {
        try {
            console.log("get borrowals by criteria: ", params);
            return await axiosClient.get("/api/v1/borrow", { params });
        } catch (error) {
            alert("Error in get borrowals by creiteria: ", error.response.data.message);
            throw error;
        }
    },
    getBorrowalStatistic: async (params) => {
        try {
            console.log("get borrowals by statistic: ", params);
            return await axiosClient.get("/api/v1/borrow/statistics", { params });
        } catch (error) {
            alert("Error in get borrowals by creiteria: ", error.response.data.message);
            throw error;
        }
    }
}
export default borrowalApi;
