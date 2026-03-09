// import { create } from "zustand";
// import axios from "../lib/axios";
// import { toast } from "react-hot-toast";

// export const useUserStore = create((set, get) => ({
// 	user: null,
// 	loading: false,
// 	checkingAuth: true,

// 	signup: async ({ name, email, password, confirmPassword }) => {
// 		set({ loading: true });

// 		if (password !== confirmPassword) {
// 			set({ loading: false });
// 			return toast.error("Passwords do not match");
// 		}

// 		try {
// 			const res = await axios.post("/auth/signup", { name, email, password });
// 			set({ user: res.data, loading: false });
// 		} catch (error) {
// 			set({ loading: false });
// 			toast.error(error.response.data.message || "An error occurred");
// 		}
// 	},
// 	login: async (email, password) => {
// 		set({ loading: true });

// 		try {
// 			const res = await axios.post("/auth/login", { email, password });

// 			set({ user: res.data, loading: false });
// 		} catch (error) {
// 			set({ loading: false });
// 			toast.error(error.response.data.message || "An error occurred");
// 		}
// 	},

// 	logout: async () => {
// 		try {
// 			await axios.post("/auth/logout");
// 			set({ user: null });
// 		} catch (error) {
// 			toast.error(error.response?.data?.message || "An error occurred during logout");
// 		}
// 	},

// 	checkAuth: async () => {
// 		set({ checkingAuth: true });
// 		try {
// 			const response = await axios.get("/auth/profile");
// 			set({ user: response.data, checkingAuth: false });
// 		} catch (error) {
// 			console.log(error.message);
// 			set({ checkingAuth: false, user: null });
// 		}
// 	},

// 	refreshToken: async () => {
// 		// Prevent multiple simultaneous refresh attempts
// 		if (get().checkingAuth) return;

// 		set({ checkingAuth: true });
// 		try {
// 			const response = await axios.post("/auth/refresh-token");
// 			set({ checkingAuth: false });
// 			return response.data;
// 		} catch (error) {
// 			set({ user: null, checkingAuth: false });
// 			throw error;
// 		}
// 	},
// }));

// // TODO: Implement the axios interceptors for refreshing access token

// // Axios interceptor for token refresh
// let refreshPromise = null;

// axios.interceptors.response.use(
// 	(response) => response,
// 	async (error) => {
// 		const originalRequest = error.config;
// 		if (error.response?.status === 401 && !originalRequest._retry) {
// 			originalRequest._retry = true;

// 			try {
// 				// If a refresh is already in progress, wait for it to complete
// 				if (refreshPromise) {
// 					await refreshPromise;
// 					return axios(originalRequest);
// 				}

// 				// Start a new refresh process
// 				refreshPromise = useUserStore.getState().refreshToken();
// 				await refreshPromise;
// 				refreshPromise = null;

// 				return axios(originalRequest);
// 			} catch (refreshError) {
// 				// If refresh fails, redirect to login or handle as needed
// 				useUserStore.getState().logout();
// 				return Promise.reject(refreshError);
// 			}
// 		}
// 		return Promise.reject(error);
// 	}
// );
import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,


	setUser: (updatedUser) => set({ user: updatedUser }),

	signup: async ({ name, email, password, confirmPassword }) => {
		set({ loading: true });

		if (password !== confirmPassword) {
			set({ loading: false });
			return toast.error("Passwords do not match");
		}

		try {
			const res = await axios.post("/auth/signup", { name, email, password });

			set({
				user: {
					_id: res.data._id,
					name: res.data.name,
					email: res.data.email,
					role: res.data.role,
					avatar: res.data.avatar ?? "/avatar1.png",
					mobile: res.data.mobile ?? "",
					address: res.data.address ?? null,
				},
				loading: false,
			});
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Signup failed");
		}
	},

	login: async (email, password) => {
		set({ loading: true });

		try {
			const res = await axios.post("/auth/login", { email, password });

			set({
				user: {
					_id: res.data._id,
					name: res.data.name,
					email: res.data.email,
					role: res.data.role,
					avatar: res.data.avatar ?? "/avatar1.png",
					mobile: res.data.mobile ?? "",
					address: res.data.address ?? null,
				},
				loading: false,
			});
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Login failed");
		}
	},

	logout: async () => {
		try {
			await axios.post("/auth/logout");
			set({ user: null });
		} catch (error) {
			toast.error(error.response?.data?.message || "Logout failed");
		}
	},

	checkAuth: async () => {
		set({ checkingAuth: true });

		try {
			const response = await axios.get("/auth/profile");

			set({
				user: {
					_id: response.data._id,
					name: response.data.name,
					email: response.data.email,
					role: response.data.role,
					avatar: response.data.avatar ?? "/avatar1.png",
					mobile: response.data.mobile ?? "",
					address: response.data.address ?? null,
				},
				checkingAuth: false,
			});
		} catch {
			set({ checkingAuth: false, user: null });
		}
	},

	refreshToken: async () => {
		if (get().checkingAuth) return;

		set({ checkingAuth: true });

		try {
			const response = await axios.post("/auth/refresh-token");
			set({ checkingAuth: false });
			return response.data;
		} catch (error) {
			set({ user: null, checkingAuth: false });
			throw error;
		}
	},

	customers: [],
	fetchCustomers: async () => {
		set({ loading: true });
		try {
			const res = await axios.get("/users");
			set({ customers: res.data, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Failed to fetch customers");
		}
	},

	deleteCustomer: async (id) => {
		try {
			await axios.delete(`/users/${id}`);
			set((state) => ({
				customers: state.customers.filter((c) => c._id !== id),
			}));
			toast.success("Customer deleted successfully");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to delete customer");
		}
	},
}));

let refreshPromise = null;

axios.interceptors.response.use(
	(res) => res,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest);
				}

				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest);
			} catch {
				useUserStore.getState().logout();
				return Promise.reject(error);
			}
		}

		return Promise.reject(error);
	}
);