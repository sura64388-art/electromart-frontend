import { useEffect, useState } from "react";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  ImageOff,
  Package,
  Truck,
  Home,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  IndianRupee,
  Eye,
  Download,
  ChevronRight,
  Filter,
  ShoppingBag,
  CreditCard,
  AlertCircle
} from "lucide-react";

const STATUSES = [
  "PLACED",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

const getStatusConfig = (status) => {
  const configs = {
    PLACED: {
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      border: "border-amber-200 dark:border-amber-800/30",
      progress: 0,
    },
    CONFIRMED: {
      icon: CheckCircle,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800/30",
      progress: 20,
    },
    PACKED: {
      icon: Package,
      color: "text-sky-600 dark:text-sky-400",
      bg: "bg-sky-50 dark:bg-sky-900/20",
      border: "border-sky-200 dark:border-sky-800/30",
      progress: 40,
    },
    SHIPPED: {
      icon: Truck,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
      border: "border-indigo-200 dark:border-indigo-800/30",
      progress: 60,
    },
    OUT_FOR_DELIVERY: {
      icon: Truck,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      border: "border-purple-200 dark:border-purple-800/30",
      progress: 80,
    },
    DELIVERED: {
      icon: CheckCircle,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      border: "border-emerald-200 dark:border-emerald-800/30",
      progress: 100,
    },
    CANCELLED: {
      icon: XCircle,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-900/20",
      border: "border-rose-200 dark:border-rose-800/30",
      progress: 0,
    },
  };
  return configs[status] || configs.PLACED;
};

const refundUI = {
  NONE: {
    label: "Request Refund",
    icon: RotateCcw,
    color: "border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-900/20",
  },
  REQUESTED: {
    label: "Refund Requested",
    icon: Clock,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  },
  APPROVED: {
    label: "Refund Approved",
    icon: CheckCircle,
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  },
  REJECTED: {
    label: "Refund Rejected",
    icon: XCircle,
    color: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
  },
  PROCESSED: {
    label: "Refund Processed",
    icon: CheckCircle,
    color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  },
};

const normalizeRefundStatus = (status) =>
  refundUI[status] ? status : "NONE";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const AdminOrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/orders");
      setOrders(res.data);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderData = async (id, data) => {
    try {
      setActionId(id);
      await axios.put(`/orders/${id}/status`, data);

      setOrders((prev) =>
        prev.map((o) =>
          o._id === id ? { ...o, ...data } : o
        )
      );

      toast.success(`Order updated successfully`);
    } catch {
      toast.error("Failed to update order");
    } finally {
      setActionId(null);
    }
  };

  const updateStatus = (id, status) => {
    updateOrderData(id, { status });
  };

  const refundOrder = async (id) => {
    try {
      setActionId(id);
      await axios.post(`/orders/${id}/refund`);

      setOrders((prev) =>
        prev.map((o) =>
          o._id === id
            ? { ...o, refundStatus: "REQUESTED" }
            : o
        )
      );

      toast.success("Refund request sent successfully");
    } catch {
      toast.error("Refund request failed");
    } finally {
      setActionId(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === "all") return true;
    if (filter === "refund") return order.refundStatus && order.refundStatus !== "NONE";
    return order.orderStatus === filter;
  }).filter(order =>
    order._id.toLowerCase().includes(search.toLowerCase()) ||
    order.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    order.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.orderStatus === "PLACED").length,
    delivered: orders.filter(o => o.orderStatus === "DELIVERED").length,
    cancelled: orders.filter(o => o.orderStatus === "CANCELLED").length,
    refunds: orders.filter(o => o.refundStatus && o.refundStatus !== "NONE").length,
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-64 bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="py-16 text-center">
        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
          <Package className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          No orders yet
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Orders will appear here once customers place them
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <div className="p-4 border border-blue-200 bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-800/30 rounded-xl">
          <p className="text-sm text-blue-700 dark:text-blue-400">Total</p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{stats.total}</p>
        </div>

        <div className="p-4 border bg-linear-to-br from-amber-50 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-800/20 border-amber-200 dark:border-amber-800/30 rounded-xl">
          <p className="text-sm text-amber-700 dark:text-amber-400">Pending</p>
          <p className="text-2xl font-bold text-amber-900 dark:text-amber-300">{stats.pending}</p>
        </div>

        <div className="p-4 border bg-linear-to-br from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-800/20 border-emerald-200 dark:border-emerald-800/30 rounded-xl">
          <p className="text-sm text-emerald-700 dark:text-emerald-400">Delivered</p>
          <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-300">{stats.delivered}</p>
        </div>

        <div className="p-4 border bg-linear-to-br from-rose-50 to-red-100 dark:from-rose-900/20 dark:to-red-800/20 border-rose-200 dark:border-rose-800/30 rounded-xl">
          <p className="text-sm text-rose-700 dark:text-rose-400">Cancelled</p>
          <p className="text-2xl font-bold text-rose-900 dark:text-rose-300">{stats.cancelled}</p>
        </div>

        <div className="p-4 border border-purple-200 bg-linear-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-800/20 dark:border-purple-800/30 rounded-xl">
          <p className="text-sm text-purple-700 dark:text-purple-400">Refunds</p>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">{stats.refunds}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders by ID, name, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 pl-11 dark:bg-gray-800 dark:border-gray-700 rounded-xl dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Filter className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {["all", "PLACED", "DELIVERED", "CANCELLED", "refund"].map((status) => {
            const config = getStatusConfig(status === "all" || status === "refund" ? "PLACED" : status);
            const Icon = config.icon;

            return (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${filter === status
                  ? `${config.bg} ${config.color} border ${config.border}`
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
              >
                <Icon size={16} />
                <span className="capitalize">
                  {status === "refund" ? "Refunds" : status.toLowerCase()}
                </span>
                <span className="px-1.5 py-0.5 text-xs rounded-full bg-white/30 dark:bg-black/30">
                  {status === "all" ? orders.length :
                    status === "refund" ? stats.refunds :
                      orders.filter(o => o.orderStatus === status).length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Grid */}
      <AnimatePresence>
        <motion.div layout className="space-y-4">
          {filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
            >
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                <AlertCircle className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                No orders found
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Try adjusting your search or filter
              </p>
            </motion.div>
          ) : (
            filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.orderStatus);
              const StatusIcon = statusConfig.icon;
              const refundStatus = normalizeRefundStatus(order.refundStatus);
              const RefundIcon = refundUI[refundStatus].icon;
              const products = order.products || [];

              return (
                <motion.div
                  key={order._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="overflow-hidden transition-all duration-300 border border-gray-200 shadow-lg group bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 dark:border-gray-800 rounded-2xl hover:shadow-xl"
                >
                  {/* Order Header */}
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                  >
                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                      {/* Left Section */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl ${statusConfig.bg}`}>
                            <StatusIcon className={`h-6 w-6 ${statusConfig.color}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                              <h3 className="font-bold text-gray-900 dark:text-white">
                                Order #{order._id.slice(-8).toUpperCase()}
                              </h3>
                              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border}`}>
                                {order.orderStatus.replace(/_/g, ' ')}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 mt-2">
                              <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Calendar size={14} />
                                {formatDate(order.createdAt)}
                              </span>
                              <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <User size={14} />
                                {order.user?.name || "Guest"}
                              </span>
                              <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Mail size={14} />
                                {order.user?.email}
                              </span>
                            </div>

                            {/* Product Preview */}
                            <div className="flex items-center gap-2 mt-4">
                              {products.slice(0, 3).map((item, idx) => {
                                const img = item.product?.image;
                                return img ? (
                                  <img
                                    key={idx}
                                    src={img}
                                    alt=""
                                    className="object-cover w-10 h-10 border border-gray-200 rounded-lg dark:border-gray-700"
                                  />
                                ) : (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-center w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-800"
                                  >
                                    <ImageOff size={14} className="text-gray-400" />
                                  </div>
                                );
                              })}
                              {products.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{products.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="flex flex-col items-end gap-3">
                        <div className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <IndianRupee className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                              {order.totalAmount.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${order.paymentStatus === "PAID"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-900/40"
                              }`}>
                              {order.paymentStatus}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {products.length} items
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${expandedOrder === order._id ? "rotate-90" : ""
                            }`} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedOrder === order._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200 dark:border-gray-800"
                      >
                        <div className="p-6 bg-gray-50/50 dark:bg-gray-800/50">
                          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* Order Items */}
                            <div className="lg:col-span-2">
                              <h4 className="flex items-center gap-2 mb-4 font-semibold text-gray-900 dark:text-white">
                                <ShoppingBag size={18} />
                                Order Items
                              </h4>
                              <div className="space-y-3">
                                {products.map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-4 p-4 bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700 rounded-xl"
                                  >
                                    <img
                                      src={item.product?.image}
                                      alt={item.product?.name}
                                      className="object-cover w-16 h-16 rounded-lg"
                                    />
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-900 dark:text-white">
                                        {item.product?.name}
                                      </p>
                                      <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-4">
                                          <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Qty: {item.quantity}
                                          </span>
                                          <span className="text-sm text-gray-600 dark:text-gray-400">
                                            ₹{item.price.toLocaleString()} each
                                          </span>
                                        </div>
                                        <span className="font-bold text-gray-900 dark:text-white">
                                          ₹{(item.price * item.quantity).toLocaleString()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Order Actions & Info */}
                            <div className="space-y-6">
                              {/* Status Update */}
                              <div>
                                <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">
                                  Update Status
                                </h4>
                                <select
                                  value={order.orderStatus}
                                  disabled={actionId === order._id}
                                  onChange={(e) => updateStatus(order._id, e.target.value)}
                                  className={`w-full px-4 py-3 rounded-xl border font-medium transition-all duration-300 ${statusConfig.border
                                    } ${statusConfig.bg} ${statusConfig.color} ${actionId === order._id ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                                    }`}
                                >
                                  {STATUSES.map((s) => (
                                    <option key={s} value={s}>
                                      {s.replace(/_/g, ' ')}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Shipping Details */}
                              <div className="p-4 bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700 rounded-xl space-y-4">
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                  Shipping Details
                                </h4>
                                <div className="space-y-3">
                                  <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Tracking Number</label>
                                    <input
                                      type="text"
                                      placeholder="Enter tracking #"
                                      defaultValue={order.trackingNumber}
                                      onBlur={(e) => updateOrderData(order._id, { trackingNumber: e.target.value })}
                                      className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Est. Delivery Date</label>
                                    <input
                                      type="date"
                                      defaultValue={order.estimatedDeliveryDate ? new Date(order.estimatedDeliveryDate).toISOString().split('T')[0] : ''}
                                      onBlur={(e) => updateOrderData(order._id, { estimatedDeliveryDate: e.target.value })}
                                      className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Refund Status */}
                              {refundStatus !== "NONE" && (
                                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                                  <div className="flex items-center gap-2 mb-2">
                                    <RefundIcon className={`h-5 w-5 ${refundUI[refundStatus].color.split(' ')[2]}`} />
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                      Refund Status
                                    </span>
                                  </div>
                                  <div className={`px-3 py-2 rounded-lg text-sm font-medium ${refundUI[refundStatus].color}`}>
                                    {refundUI[refundStatus].label}
                                  </div>
                                </div>
                              )}

                              {/* Customer Info */}
                              <div>
                                <h4 className="flex items-center gap-2 mb-3 font-semibold text-gray-900 dark:text-white">
                                  <User size={18} />
                                  Customer Details
                                </h4>
                                <div className="p-4 space-y-3 bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700 rounded-xl">
                                  <div className="space-y-2">
                                    <p className="font-medium text-gray-900 dark:text-white">{order.user?.name}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{order.user?.email}</p>
                                    <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                      <Phone size={14} />
                                      {order.user?.mobile || "Not provided"}
                                    </p>
                                  </div>

                                  {/* Delivery Address Section */}
                                  {order.deliveryAddress && (
                                    <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                                      <div className="flex items-start gap-2 mb-2">
                                        <MapPin size={14} className="mt-1 text-gray-500" />
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                          Delivery Address
                                        </span>
                                      </div>
                                      <div className="pl-6 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                        <p>{order.deliveryAddress.street}</p>
                                        <p>{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
                                        <p>{order.deliveryAddress.country} - {order.deliveryAddress.pincode}</p>
                                        {order.deliveryAddress.landmark && (
                                          <p className="text-xs">Landmark: {order.deliveryAddress.landmark}</p>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-3">
                                {order.paymentStatus === "PAID" &&
                                  order.orderStatus === "DELIVERED" &&
                                  refundStatus === "NONE" && (
                                    <button
                                      onClick={() => refundOrder(order._id)}
                                      disabled={actionId === order._id}
                                      className="flex items-center justify-center flex-1 gap-2 px-4 py-3 text-sm font-medium border text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/30 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/30 disabled:opacity-50"
                                    >
                                      <RotateCcw size={16} />
                                      Process Refund
                                    </button>
                                  )}

                                <button className="flex items-center justify-center flex-1 gap-2 px-4 py-3 text-sm font-medium text-blue-600 border border-blue-200 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800/30 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30">
                                  <Download size={16} />
                                  Invoice
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AdminOrdersTab;