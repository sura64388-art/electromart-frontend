import React from "react";
import { X, Printer, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import InvoicePreview from "./InvoicePreview";

const BillingPreviewModal = ({ isOpen, onClose, order }) => {
    if (!isOpen || !order) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
                >
                    {/* Modal Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-12 relative bg-white">
                        {/* Branded Invoice Header */}
                        <div className="flex justify-between items-start mb-12 border-b-2 border-slate-100 pb-10">
                            <div className="space-y-4">
                                <div>
                                    <h1 className="text-3xl font-black text-indigo-600 tracking-tighter uppercase leading-none mb-1">
                                        Sree Saravana
                                    </h1>
                                    <h2 className="text-xl font-bold text-slate-400 tracking-[0.15em] uppercase leading-none">
                                        Electricals
                                    </h2>
                                </div>
                                <div className="text-sm text-slate-500 leading-relaxed font-medium">
                                    <p className="flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                                        37, Tirupur Towers, 4th St Stanes Rd,
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                                        KNP Puram, Odakkadu, Tiruppur,
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                                        Tamil Nadu 641602
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="mb-4">
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-1">Status</p>
                                    <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider">
                                        Draft Preview
                                    </span>
                                </div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dated</p>
                                <p className="text-sm font-bold text-gray-900 mt-1">
                                    {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                                </p>
                            </div>
                        </div>

                        {/* Bill To & Payment Info */}
                        <div className="grid grid-cols-2 gap-12 mb-12 p-8 bg-gray-50/50 rounded-2xl border border-gray-100 border-dashed">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Invoice To</p>
                                <p className="font-extrabold text-gray-900 text-lg mb-2">
                                    {order.deliveryAddress?.fullName || order.user?.name}
                                </p>
                                <div className="text-sm text-gray-600 leading-relaxed font-medium">
                                    <p>{order.deliveryAddress?.street}</p>
                                    <p>{order.deliveryAddress?.city}, {order.deliveryAddress?.state}</p>
                                    <p className="text-indigo-600">{order.deliveryAddress?.pincode}</p>
                                    <p className="mt-2 font-bold text-gray-900">Phone: {order.deliveryAddress?.phone}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Payment & Terms</p>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-1">Payment Method</p>
                                        <p className="font-bold text-gray-900">
                                            {order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment (Razorpay)"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-1">Payment Status</p>
                                        <p className="text-sm text-emerald-600 font-extrabold flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                            Pending Placement
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="mb-12">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                                        <th className="pb-4 pl-2 w-[50%]">Item Description</th>
                                        <th className="pb-4 text-center w-[10%]">Qty</th>
                                        <th className="pb-4 text-right w-[20%]">Unit Price</th>
                                        <th className="pb-4 text-right pr-2 w-[20%]">Line Total</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-gray-700">
                                    {order.products.map((item, index) => (
                                        <tr key={index} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors group">
                                            <td className="py-5 pl-2">
                                                <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                    {item.product?.name}
                                                </p>
                                                {item.size && (
                                                    <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded uppercase tracking-wider">
                                                        Size: {item.size}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-5 text-center font-medium text-gray-600">{item.quantity}</td>
                                            <td className="py-5 text-right font-medium text-gray-600">₹{item.price.toFixed(2)}</td>
                                            <td className="py-5 text-right font-black text-gray-900 pr-2">
                                                ₹{(item.price * item.quantity).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals Section */}
                        <div className="flex justify-end">
                            <div className="w-full max-w-xs space-y-4">
                                <div className="flex justify-between text-sm font-medium text-gray-500">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900">₹{order.totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium text-gray-500">
                                    <span>Shipping Fee</span>
                                    <span className="text-gray-900">
                                        {order.shippingCost === 0 ? "FREE" : `₹${order.shippingCost.toFixed(2)}`}
                                    </span>
                                </div>
                                {order.taxAmount > 0 && (
                                    <div className="flex justify-between text-sm font-medium text-gray-500">
                                        <span>GST (18%)</span>
                                        <span className="text-gray-900">₹{order.taxAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                {order.discountAmount > 0 && (
                                    <div className="flex justify-between text-sm font-bold text-emerald-600">
                                        <span>Discount Applied</span>
                                        <span>-₹{order.discountAmount.toFixed(2)}</span>
                                    </div>
                                )}{" "}
                                <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total Payable</p>
                                        <span className="font-bold text-gray-900 text-xl">INR</span>
                                    </div>
                                    <span className="font-black text-4xl text-indigo-600 tracking-tight">
                                        ₹{(order.totalAmount + (order.shippingCost || 0) + (order.taxAmount || 0) - (order.discountAmount || 0)).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="p-8 border-t border-gray-100 bg-gray-50/80 backdrop-blur-md flex gap-4 justify-between items-center rounded-b-3xl shrink-0 z-10">
                        <button
                            onClick={onClose}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-[0.98]"
                        >
                            Close
                        </button>

                        <button
                            onClick={handlePrint}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-[0.98]"
                        >
                            <Printer size={18} />
                            Print
                        </button>

                        <div className="flex-1">
                            <InvoicePreview
                                order={order}
                                label="Download PDF"
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white font-extrabold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-[0.98]"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default BillingPreviewModal;
