import React, { useEffect } from "react";
import { useContactStore } from "../stores/useContactStore";
import {
    MessageSquare,
    Trash2,
    Mail,
    User,
    Calendar,
    Clock,
    Inbox,
    Loader2,
    ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EnquiriesTab = () => {
    const { contacts, fetchContacts, deleteContact, loading } = useContactStore();

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    if (loading && contacts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading entries...</p>
            </div>
        );
    }

    if (contacts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
                <div className="p-4 bg-gray-100 rounded-full mb-4">
                    <Inbox size={48} className="opacity-40" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">No Enquiries Yet</h3>
                <p className="max-w-xs text-center text-sm leading-relaxed">
                    When customers send you messages through the contact page, they will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">Customer Enquiries</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Manage and respond to customer messages</p>
                </div>
                <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border border-blue-100">
                    Total: {contacts.length}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <AnimatePresence>
                    {contacts.map((enquiry) => (
                        <motion.div
                            layout
                            key={enquiry._id}
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="group relative bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 overflow-hidden"
                        >
                            {/* Header Info */}
                            <div className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                                            <User size={22} strokeWidth={2.5} />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-lg font-bold text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">
                                                    {enquiry.name || "Anonymous"}
                                                </h4>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-y-1 gap-x-4">
                                                <a
                                                    href={`mailto:${enquiry.email}`}
                                                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-500 transition-colors bg-gray-50 group-hover:bg-blue-50/50 px-2 py-0.5 rounded-md"
                                                >
                                                    <Mail size={14} />
                                                    {enquiry.email || enquiry.user?.email}
                                                </a>
                                                <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                                                    <Clock size={14} />
                                                    {new Date(enquiry.createdAt).toLocaleString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                        hour: 'numeric',
                                                        minute: 'numeric',
                                                        hour12: true
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => deleteContact(enquiry._id)}
                                            className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-300 shadow-sm"
                                            title="Delete Enquiry"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                        <a
                                            href={`mailto:${enquiry.email}?subject=Re: ${enquiry.subject || 'Electrical Store Inquiry'}`}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 hover:shadow-lg transition-all active:scale-95"
                                        >
                                            <span>Reply</span>
                                            <ExternalLink size={16} />
                                        </a>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="mt-8 relative">
                                    {enquiry.subject && (
                                        <div className="mb-3 px-3 py-1 bg-amber-50 border-l-4 border-amber-400 inline-block rounded-r-md">
                                            <span className="text-xs font-black uppercase tracking-widest text-amber-700">Subject: </span>
                                            <span className="text-sm font-bold text-amber-900">{enquiry.subject}</span>
                                        </div>
                                    )}

                                    <div className="relative p-5 bg-zinc-50/50 rounded-xl border border-dotted border-gray-200">
                                        <MessageSquare size={16} className="absolute -top-3 -left-1 text-blue-500 fill-blue-50" />
                                        <p className="text-gray-700 leading-relaxed font-medium whitespace-pre-wrap italic">
                                            "{enquiry.message}"
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Corner Element */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-blue-500/5 to-transparent pointer-events-none transition-all group-hover:from-blue-500/10" />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default EnquiriesTab;
