import axiosClient from "./axiosClient";

const walletApi = {
    getWalletByUserId: async (uid) => {
        return await axiosClient.get(`/api/v1/public/wallets/user/${uid}`);
    },
    getPendingTransactions: async (uid) => {
        return await axiosClient.get(`/api/v1/public/wallet-transactions/${uid}/pending`);
    },
    handleTransaction: async (userId, amount, transactionCode) => {
        return await axiosClient.post(`/api/v1/public/wallet-transactions/handle`,
            { userId, amount: Math.trunc(Number(amount)), transactionCode },);
    },
    updateAmountTransaction: async (transactionId,amount) => {
        console.log(amount)
        return await axiosClient.patch(`/api/v1/public/wallet-transactions/${transactionId}`,{ amount: Math.trunc(Number(amount)) });
    },
    cancelTransaction: async (transactionId) => {
        return await axiosClient.post(`/api/v1/public/wallet-transactions/${transactionId}/cancel`);
    }
};

export default walletApi;