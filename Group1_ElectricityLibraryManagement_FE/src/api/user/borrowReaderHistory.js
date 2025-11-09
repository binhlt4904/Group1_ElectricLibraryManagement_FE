import axiosClient from "../axiosClient";
const borrowalReaderHistoryApi = {
    getBorrowalBySpecReaderAndCriteria: async (params) => {
        try {
            console.log("get borrowals by criteria: ", params);
            return await axiosClient.get("/api/v1/borrow/history", { params });
        } catch (error) {
            alert("Error in get borrowals by creiteria: ", error.response.data.message);
            throw error;
        }
    },
    getBorrowalStatisticBySpecReader: async (params) => {
        try {
            console.log("get borrowals by statistic: ", params);
            return await axiosClient.get("/api/v1/borrow/history/statistics", { params });
        } catch (error) {
            alert("Error in get borrowals statistics by creiteria: ", error.response.data.message);
            throw error;
        }
    },
    returnBook: async (id) => {
        try {
            const response = await axiosClient.post(`/api/v1/return/${id}`);
            return response;
        } catch (error) {
            alert("Error in return book: ", error.response.data.message)
        }
    },
    borrowBook: async (bookId, dueDate) => {
        try {
            const response = await axiosClient.post(`/api/v1/borrow`, null, {
                params: { bookId, allowDate: dueDate },
            });
            console.log("Post borrow successfully")
            return response.data;
        } catch (error) {
            throw error;          
        }
    },
    getActiveBorrowedBookIds: async (userId) => {
        try {
            const response = await axiosClient.get(`/api/v1/borrow/active`, {
                params: { userId },
            });
            return response.data;
        } catch (error) {
           
            throw error;          
        }
    },
}
export default borrowalReaderHistoryApi;