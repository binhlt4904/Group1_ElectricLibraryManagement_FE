import axiosClient from "../axiosClient";
const reportApi = {
    getReportByCriteria: async (params) => {
        try {
            console.log("get reports by criteria: ", params);
            return await axiosClient.get("/api/reports", { params });
        } catch (error) {
            alert("Error in get borrowals by creiteria: ", error.response.data.message);
            throw error;
        }
    },
    getReportsByStatistic: async (params) => {
        try {
            console.log("get reports by statistic: ", params);
            return await axiosClient.get("/api/reports/statistic", { params });
        } catch (error) {
            alert("Error in get reports by creiteria: ", error.response.data.message);
            throw error;
        }
    },
    assignReport: async(id) => {    
        try {
            console.log("asign report for: ", id);
            return await axiosClient.post(`/api/reports/${id}/assign`);
        } catch (error) {
            alert("Error in assigning reports: ", error.response.data.message);
            throw error;
        }
    },
    updateReport: async(id, note) => {    
        try {
            console.log("update report for: ", id);
            return await axiosClient.post(`/api/reports/${id}/update`, { note });
        } catch (error) {
            alert("Error in updating reports: ", error.response.data.message);
            throw error;
        }
    },
    getReportBySpecReaderAndCriteria: async (params) => {
        try {
            console.log("get reports by spec reader by criteria: ", params);
            return await axiosClient.get("/api/reports/reader", { params });
        } catch (error) {
            alert("Error in get borrowals by creiteria: ", error.response.data.message);
            throw error;
        }
    },
    getReportsBySpecReaderAndStatistic: async (params) => {
        try {
            console.log("get reports by spec reader statistic: ", params);
            return await axiosClient.get("/api/reports/reader/statistic", { params });
        } catch (error) {
            alert("Error in get reports by creiteria: ", error.response.data.message);
            throw error;
        }
    },
    createReport: async (params) => {
        try {
            console.log("create report: ", params);
            return await axiosClient.post("/api/reports", null, { params }); //todo: notice
        } catch (error) {
            alert("Error in create report: ", error.response.data.message);
            throw error;
        }
    },
}
export default reportApi;