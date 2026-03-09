import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useContactStore = create((set) => ({
    contacts: [],
    loading: false,

    fetchContacts: async () => {
        set({ loading: true });
        try {
            const res = await axios.get("/contact");
            set({ contacts: res.data, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Failed to fetch enquiries");
        }
    },

    deleteContact: async (id) => {
        try {
            await axios.delete(`/contact/${id}`);
            set((state) => ({
                contacts: state.contacts.filter((c) => c._id !== id),
            }));
            toast.success("Enquiry deleted");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete enquiry");
        }
    },
}));
