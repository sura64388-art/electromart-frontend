import { useEffect, useState } from "react";
import axios from "../lib/axios";
import {
  PackageCheck,
  Truck,
  Eye,
  ImageOff,
  Calendar,
  IndianRupee,
  MapPin,
  User,
  Phone,
  CreditCard,
  Shield,
  RefreshCw,
  Filter,
  Search,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ShoppingBag,
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import InvoicePreview from "../components/InvoicePreview";

const statusConfig = {
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
    icon: PackageCheck,
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

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async (showToast = false) => {
    try {
      setRefreshing(true);
      const res = await axios.get("/orders/my-orders");
      setOrders(res.data);
      if (showToast) toast.success("Orders updated!");
    } catch (err) {
      console.error("Failed to load orders");
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.products.some(item =>
        item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusProgress = (status) => {
    return statusConfig[status]?.progress || 0;
  };

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(o => o.orderStatus === "DELIVERED").length;
  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  if (loading) {
    return (
      <div className="min-h-screen pb-20 bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 pt-28">
        <div className="max-w-6xl px-4 mx-auto">
          {/* Skeleton Header */}
          <div className="h-12 mb-8 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>

          {/* Skeleton Cards */}
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen pb-20 bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 pt-28">
        <div className="max-w-6xl px-4 mx-auto">
          <div className="py-20 text-center">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
              No Orders Yet
            </h2>
            <p className="max-w-md mx-auto mb-8 text-gray-600 dark:text-gray-400">
              You haven't placed any orders. Start shopping to see your orders here.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 pt-28">
      <div className="max-w-6xl px-4 mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col justify-between gap-6 mb-8 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Orders
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Track and manage all your purchases
              </p>
            </div>

            <button
              onClick={() => fetchOrders(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
            <div className="p-4 border border-blue-200 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-800/30 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-400">Total Orders</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{totalOrders}</p>
                </div>
                <ShoppingBag className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            <div className="p-4 border border-green-200 bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-800/30 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 dark:text-green-400">Delivered</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-300">{deliveredOrders}</p>
                </div>
                <PackageCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>

            <div className="p-4 border border-purple-200 bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 dark:border-purple-800/30 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 dark:text-purple-400">Total Spent</p>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">
                      {totalSpent.toLocaleString()}
                    </p>
                  </div>
                </div>
                <CreditCard className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4 mb-6 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Search orders by ID or product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {["all", "PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map((status) => {
                const config = statusConfig[status === "all" ? "PLACED" : status];
                const Icon = config.icon;

                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${statusFilter === status
                      ? `${config.bg} ${config.color} border ${config.border}`
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                  >
                    <Icon size={16} />
                    <span className="capitalize">
                      {status === "all" ? "All" : status.toLowerCase().replace("_", " ")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Orders List */}
        <AnimatePresence>
          <motion.div layout className="space-y-6">
            {filteredOrders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 text-center"
              >
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                  <Filter className="w-10 h-10 text-gray-400" />
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
                const status = statusConfig[order.orderStatus];
                const StatusIcon = status.icon;
                const progress = getStatusProgress(order.orderStatus);

                return (
                  <motion.div
                    key={order._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 shadow-lg dark:bg-gray-900 dark:border-gray-800 rounded-2xl group hover:shadow-xl"
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
                            <div className={`p-3 rounded-xl ${status.bg}`}>
                              <StatusIcon className={`h-6 w-6 ${status.color}`} />
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h3 className="font-bold text-gray-900 dark:text-white">
                                  Order #{order._id.slice(-8).toUpperCase()}
                                </h3>
                                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${status.bg} ${status.color} border ${status.border}`}>
                                  {order.orderStatus.replace(/_/g, ' ')}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-4">
                                <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                  <Calendar size={14} />
                                  {formatDate(order.createdAt)}
                                </span>
                                <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                  <ShoppingBag size={14} />
                                  {order.products.length} items
                                </span>
                                <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                  <CreditCard size={14} />
                                  {order.paymentStatus}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <IndianRupee className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                {order.totalAmount.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${expandedOrder === order._id ? "rotate-90" : ""
                            }`} />
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {order.orderStatus !== "CANCELLED" && (
                        <div className="mt-6">
                          <div className="flex justify-between mb-1 text-xs text-gray-500 dark:text-gray-400">
                            <span>Order Placed</span>
                            <span>{progress}% Complete</span>
                            <span>Delivered</span>
                          </div>
                          <div className="h-2 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
                            <motion.div
                              className="h-full bg-linear-to-r from-blue-500 to-emerald-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                        </div>
                      )}
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
                                <div className="space-y-4">
                                  {order.products.map((item, idx) => {
                                    const product = item.product;

                                    return (
                                      <div
                                        key={idx}
                                        className="flex items-center gap-4 p-4 bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700 rounded-xl"
                                      >
                                        {product?.image ? (
                                          <img
                                            src={product.image}
                                            alt={product.name}
                                            className="object-cover w-16 h-16 rounded-lg"
                                          />
                                        ) : (
                                          <div className="flex items-center justify-center w-16 h-16 bg-gray-100 border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-800">
                                            <ImageOff className="w-6 h-6 text-gray-400" />
                                          </div>
                                        )}

                                        <div className="flex-1">
                                          <p className="font-medium text-gray-900 dark:text-white">
                                            {product?.name || "Product unavailable"}
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
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Order Details & Actions */}
                              <div className="space-y-6">
                                {/* Shipping Address */}
                                {order.shippingAddress && (
                                  <div>
                                    <h4 className="flex items-center gap-2 mb-3 font-semibold text-gray-900 dark:text-white">
                                      <MapPin size={18} />
                                      Shipping Address
                                    </h4>
                                    <div className="p-4 space-y-2 bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700 rounded-xl">
                                      <p className="font-medium text-gray-900 dark:text-white">
                                        {order.shippingAddress.fullName}
                                      </p>
                                      <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {order.shippingAddress.street}
                                      </p>
                                      <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                                      </p>
                                      <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Phone size={14} />
                                        {order.shippingAddress.phone}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                  <Link
                                    to={`/orders/${order._id}`}
                                    className="flex items-center justify-center gap-2 px-4 py-3 font-medium text-white transition-all duration-300 bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700"
                                  >
                                    Order Details
                                  </Link>

                                  {order.orderStatus === "DELIVERED" && (
                                    <InvoicePreview
                                      order={order}
                                      className="flex items-center justify-center gap-2 px-4 py-3 font-medium text-white transition-all duration-300 bg-linear-to-r from-green-500 to-emerald-600 rounded-xl hover:from-green-600 hover:to-emerald-700 w-full"
                                    />
                                  )}

                                  {order.orderStatus === "CANCELLED" && (
                                    <button className="flex items-center justify-center gap-2 px-4 py-3 font-medium text-white transition-all duration-300 bg-linear-to-r from-rose-500 to-pink-600 rounded-xl hover:from-rose-600 hover:to-pink-700">
                                      <AlertCircle size={18} />
                                      Need Help?
                                    </button>
                                  )}
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

        {/* Summary */}
        {filteredOrders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 mt-8 border border-gray-200 bg-linear-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 dark:border-gray-700 rounded-2xl"
          >
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredOrders.length}</span> of{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">{orders.length}</span> orders
                </p>
              </div>
              <div className="flex items-center gap-4">
                {/* <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-gray-100 border border-gray-300 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Clear Filters
                </button> */}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;