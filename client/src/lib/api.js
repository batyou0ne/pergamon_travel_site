import axios from "axios";

// In production, use VITE_API_URL. In local development, fallback to /api (which is proxied by Vite).
const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            // Only redirect if absolutely necessary, but for now let's just clear
            // the token and let the app state handle it (e.g. ProtectedRoute)
            if (window.location.pathname !== "/" && window.location.pathname !== "/explore") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
