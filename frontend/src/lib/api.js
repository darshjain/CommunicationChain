import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001",
    timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Possibly attach user token, etc.
        // config.headers.Authorization = `Bearer ${myToken}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // You can handle specific error codes or messages
        if (error.response) {
            console.error("API error:", error.response.data);
            // e.g. show a user-friendly message or trigger a global error store
        } else {
            console.error("Network/Server error:", error);
        }
        return Promise.reject(error);
    }
);

export default api;
