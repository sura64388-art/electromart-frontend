import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";
export const useProductStore = create((set) => ({
	products: [],
	loading: false,
	selectedProduct: null,
	setProducts: (products) => set({ products }),
	updateProduct: async (id, productData) => {
		set({ loading: true });
		try {
			const res = await axios.put(`/products/${id}`, productData);
			set((prevState) => ({
				products: prevState.products.map((p) => (p._id === id ? res.data : p)),
				loading: false,
			}));
			toast.success("Product updated successfully");
		} catch (error) {
			toast.error(error.response.data.error || "Failed to update product");
			set({ loading: false });
		}
	},
	createProduct: async (productData) => {
		set({ loading: true });
		try {
			const res = await axios.post("/products", productData);
			set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
			}));
		} catch (error) {
			toast.error(error.response.data.error);
			set({ loading: false });
		}
	},
	fetchAllProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products");
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response.data.error || "Failed to fetch products");
		}
	},
	fetchProductsByCategory: async (category) => {
		set({ loading: true });
		try {
			const response = await axios.get(`/products/category/${category}`);
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response.data.error || "Failed to fetch products");
		}
	},
	fetchProductById: async (id) => {
		set({ loading: true });
		try {
			const res = await axios.get(`/products/${id}`);
			set({ selectedProduct: res.data, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error("Failed to fetch product details");
		}
	},
	deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			await axios.delete(`/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to delete product");
		}
	},
	toggleFeaturedProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
				),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to update product");
		}
	},
	fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products/featured");
			set({ products: response.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			console.log("Error fetching featured products:", error);
		}
	},
	addReview: async (productId, reviewData) => {
		set({ loading: true });
		try {
			await axios.post(`/products/${productId}/reviews`, reviewData);
			// Fetch the product again to get updated reviews and rating
			const res = await axios.get(`/products/${productId}`);
			set({ selectedProduct: res.data, loading: false });
			toast.success("Review added successfully");
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.message || "Failed to add review");
		}
	},
}));