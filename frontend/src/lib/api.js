import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001",
    timeout: 10000,
});

// Request interceptor (optional)
api.interceptors.request.use(
    (config) => {
        // e.g., attach auth token if needed
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error("API error:", error.response.data);
        } else {
            console.error("Network/Server error:", error);
        }
        return Promise.reject(error);
    }
);

export default api;
