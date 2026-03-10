import axios from "axios";

// Get the base URL and remove any trailing /api or / to avoid duplicates
const rawBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const apiBaseUrl = rawBaseUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");

const axiosInstance = axios.create({
	baseURL: apiBaseUrl,
	withCredentials: true
});

// Automatically add /api prefix if it's missing from the request URL
axiosInstance.interceptors.request.use((config) => {
	if (config.url && !config.url.startsWith("/api") && !config.url.startsWith("http")) {
		// Ensure there's a leading slash if not present
		const path = config.url.startsWith("/") ? config.url : `/${config.url}`;
		config.url = `/api${path}`;
	}
	return config;
});

export default axiosInstance;
