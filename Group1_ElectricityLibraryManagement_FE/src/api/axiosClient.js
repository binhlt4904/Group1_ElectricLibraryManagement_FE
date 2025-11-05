import axios from "axios";
import auth from "./auth";
const axiosClient = axios.create({
    baseURL: "http://localhost:8080",
    timeout: 60000,
    withCredentials: true, // for cookies - refresh token
});

export const axiosRefresh = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true, // for cookies - refresh token
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
)

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._flag) {
            originalRequest._flag = true;
            try {
                const response = await auth.refreshToken();

                const newAccessToken = response.newAccessToken;
                localStorage.setItem("accessToken", newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosRefresh(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("accessToken");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;