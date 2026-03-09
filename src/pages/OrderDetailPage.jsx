import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../lib/axios";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Calendar,
  CreditCard,
  ArrowRight,
  ShoppingBag,
  Clock
} from "lucide-react";
import InvoicePreview from "../components/InvoicePreview";


const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-center px-4">
        <ShoppingBag size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Not Found</h2>
        <p className="text-gray-500 mb-6">The order you're looking for doesn't exist.</p>
        <Link to="/" className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">
          Return Home
        </Link>
      </div>
    );
  }

  const steps = [
    { status: "PLACED", label: "Order Placed", icon: ShoppingBag },
    { status: "CONFIRMED", label: "Confirmed", icon: CheckCircle2 },
    { status: "SHIPPED", label: "Shipped", icon: Truck },
    { status: "OUT_FOR_DELIVERY", label: "Out for Delivery", icon: Truck },
    { status: "DELIVERED", label: "Delivered", icon: Package },
  ];

  const currentStepIndex = steps.findIndex(step => step.status === order.orderStatus);
  const isCancelled = order.orderStatus === "CANCELLED";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <Calendar size={14} />
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <InvoicePreview order={order} />
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${order.paymentStatus === "PAID"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-yellow-50 text-yellow-700 border-yellow-200"
              }`}>
              {order.paymentStatus === "PAID" ? "Paid" : "Pending Payment"}
            </span>
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${isCancelled
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-blue-50 text-blue-700 border-blue-200"
              }`}>
              {order.orderStatus.replace(/_/g, " ")}
            </span>
          </div>
        </div>

        {/* Tracking System */}
        {!isCancelled && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-8">Order Tracking</h3>
            <div className="relative">
              {/* Progress Bar Background */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 rounded-full hidden md:block"></div>

              {/* Active Progress Bar */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
                className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 rounded-full hidden md:block transition-all duration-1000"
              ></motion.div>

              <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8 md:gap-0">
                {steps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;

                  return (
                    <div key={step.status} className="flex md:flex-col items-center gap-4 md:gap-3 group">
                      {/* Step Indicator */}
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                        ${isCompleted
                          ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30"
                          : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400"
                        }
                      `}>
                        <step.icon size={18} />
                      </div>

                      {/* Label */}
                      <div className="md:text-center">
                        <p className={`text-sm font-semibold ${isCompleted ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>
                          {step.label}
                        </p>
                        {isCurrent && (
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-pulse">
                            In Progress
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Estimated Delivery */}
            {order.estimatedDeliveryDate && (
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <Clock size={16} className="text-emerald-600" />
                <span>Estimated Delivery by <b>{new Date(order.estimatedDeliveryDate).toDateString()}</b></span>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Items Ordered</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {order.products.map((item) => (
                  <div key={item._id} className="p-6 flex gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src={item.product?.image || "/placeholder.png"}
                        alt={item.product?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {item.product?.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Qty: {item.quantity} {item.size && `• Size: ${item.size}`}
                      </p>
                      <p className="font-bold text-emerald-600">
                        ₹{item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Delivery Address */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-gray-400" />
                Delivery Address
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <p className="font-semibold text-gray-900 dark:text-white">{order.deliveryAddress.fullName}</p>
                <p>{order.deliveryAddress.street}</p>
                <p>{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
                <p>{order.deliveryAddress.pincode}</p>
                <p className="mt-2 text-gray-500">Phone: {order.deliveryAddress.phone}</p>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-gray-400" />
                Payment Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Method</span>
                  <span className="font-medium text-gray-900 dark:text-white">{order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{order.totalAmount.toFixed(2)}</span>
                </div>
                {order.shippingCost > 0 && (
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping</span>
                    <span>₹{order.shippingCost.toFixed(2)}</span>
                  </div>
                )}
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{order.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span className="text-emerald-600">₹{order.finalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-6 text-center">
              <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                Need help with your order?
              </p>
              <Link to="/contact" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
