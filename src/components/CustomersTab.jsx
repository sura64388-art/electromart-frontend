import { useEffect, useState } from "react";
import {
    Users,
    Search,
    Trash2,
    Download,
    Calendar,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    ShieldCheck,
    ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "../stores/useUserStore";

const CustomersTab = () => {
    const { customers, fetchCustomers, deleteCustomer, loading } = useUserStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    // Filter logic
    const filteredCustomers = customers.filter(
        (customer) =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (customer.mobile && customer.mobile.includes(searchTerm))
    );

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

    const handleDownload = () => {
        // Logic to download customer list as PDF/CSV
        console.log("Downloading customer list...");
    };

    // Stats logic
    const adminCount = customers.filter(c => c.role === 'admin').length;
    const customerCount = customers.filter(c => c.role === 'customer').length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                <div className="flex gap-4">
                    <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Users</p>
                            <p className="text-xl font-black text-gray-800">{customers.length}</p>
                        </div>
                    </div>
                    <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Admins</p>
                            <p className="text-xl font-black text-gray-800">{adminCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto text-sm">
                    <table className="w-full text-left">
                        <thead className="bg-[#fafafa] text-gray-600 font-medium">
                            <tr>
                                <th className="px-6 py-4 border-b border-gray-100 w-16">SNo</th>
                                <th className="px-6 py-4 border-b border-gray-100">Name</th>
                                <th className="px-6 py-4 border-b border-gray-100">Email</th>
                                <th className="px-6 py-4 border-b border-gray-100">Role</th>
                                <th className="px-6 py-4 border-b border-gray-100">Joined Date</th>
                                <th className="px-6 py-4 border-b border-gray-100">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, idx) => (
                                    <tr key={idx} className="animate-pulse">
                                        <td colSpan="6" className="px-6 py-4 h-12 bg-gray-50/50"></td>
                                    </tr>
                                ))
                            ) : currentItems.length > 0 ? (
                                currentItems.map((customer, index) => (
                                    <tr key={customer._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-5 text-gray-500 font-medium">
                                            {indexOfFirstItem + index + 1}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${customer.role === 'admin' ? 'bg-amber-100 text-amber-600' : 'bg-blue-50 text-blue-600'
                                                    }`}>
                                                    {customer.name.charAt(0)}
                                                </div>
                                                <span className="text-gray-900 font-semibold">{customer.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-gray-600">
                                            {customer.email}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${customer.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-700'
                                                }`}>
                                                {customer.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-gray-500">
                                            {new Date(customer.createdAt).toLocaleDateString('en-IN')}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => deleteCustomer(customer._id)}
                                                    className={`p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-all ${customer.role === 'admin' ? 'invisible' : ''
                                                        }`}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-400 italic">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Footer) */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white rounded-b-xl">
                    <p className="text-xs text-gray-500">
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCustomers.length)} of {filteredCustomers.length} entries
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className="p-1 text-gray-400 hover:text-blue-500 disabled:opacity-30"
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={20} />
                        </button>

                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-8 h-8 rounded-md text-xs font-bold transition-all ${currentPage === i + 1
                                    ? "bg-[#1890ff] text-white shadow-sm"
                                    : "text-gray-500 hover:bg-gray-100"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            className="p-1 text-gray-400 hover:text-blue-500 disabled:opacity-30"
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomersTab;
