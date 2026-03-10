import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const axiosInstance = axios.create({
	baseURL: apiBaseUrl, // Root URL, we will handle /api in interceptor
	withCredentials: true
});

// Automatically add /api prefix if it's missing
axiosInstance.interceptors.request.use((config) => {
	if (config.url && !config.url.startsWith("/api") && !config.url.startsWith("http")) {
		config.url = `/api${config.url.startsWith("/") ? "" : "/"}${config.url}`;
	}
	return config;
});

export default axiosInstance;
