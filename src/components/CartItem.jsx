import React from "react";
import { Minus, Plus, Trash } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCartStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 transition-all duration-300 bg-white border border-gray-200 shadow-sm  group rounded-xl dark:border-gray-700 dark:bg-gray-800 md:p-5 hover:shadow-lg"
    >
      <div className="flex flex-col gap-5 md:flex-row">

        {/* Product Image */}
        <div className="shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="object-cover transition-transform duration-300 border border-gray-100 rounded-lg  h-28 w-28 md:h-36 md:w-36 dark:border-gray-700 group-hover:scale-105"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 transition-colors dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {item.name}
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {item.description}
            </p>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                ₹{item.price}
              </p>
              {item.originalPrice && (
                <p className="text-sm text-gray-500 line-through dark:text-gray-400">
                  ₹{item.originalPrice}
                </p>
              )}
            </div>

            {item.discount && (
              <span className="px-2 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded-full dark:bg-red-900/30 dark:text-red-400">
                {item.discount}% OFF
              </span>
            )}
          </div>

          {/* Stock Status */}
          {item.stock && (
            <div className="inline-flex items-center gap-2 text-sm">
              <span className={`w-2 h-2 rounded-full ${item.stock > 10 ? 'bg-green-500' : 'bg-orange-500'}`}></span>
              <span className="text-gray-600 dark:text-gray-400">
                {item.stock > 10 ? 'In Stock' : `Only ${item.stock} left`}
              </span>
            </div>
          )}
        </div>


        <div className="flex items-center justify-between gap-4 md:flex-col md:justify-start">


          <div className="flex items-center gap-3 px-3 py-2 border border-gray-200 bg-gray-50 dark:bg-gray-700/50 rounded-xl dark:border-gray-600">
            <button
              onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
              className="flex items-center justify-center text-gray-700 transition-all duration-200 bg-white border border-gray-300 rounded-lg  h-9 w-9 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500 hover:border-gray-400 dark:hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={item.quantity <= 1}
            >
              <Minus size={16} />
            </button>

            <span className="text-lg font-semibold text-center text-gray-900 min-w-8 dark:text-white">
              {item.quantity}
            </span>

            <button
              onClick={() => updateQuantity(item._id, item.quantity + 1)}
              className="flex items-center justify-center text-gray-700 transition-all duration-200 bg-white border border-gray-300 rounded-lg  h-9 w-9 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500 hover:border-gray-400 dark:hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={item.stock && item.quantity >= item.stock}
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Remove Button and Subtotal */}
          <div className="flex items-center gap-4 md:flex-col md:gap-3">
            <div className="text-right md:text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Subtotal</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                ₹{item.price * item.quantity}
              </p>
            </div>

            <button
              onClick={() => removeFromCart(item._id)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 transition-all duration-200 rounded-lg  dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash size={16} />
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700"></div>

      {/* Additional Info Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <div className="flex items-center gap-4">
          <span className="text-gray-600 dark:text-gray-400">
            Delivery: <span className="font-medium text-gray-900 dark:text-white">2-3 business days</span>
          </span>
          {item.freeShipping && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
              ✓ Free Shipping
            </span>
          )}
        </div>

        {item.warranty && (
          <span className="text-gray-600 dark:text-gray-400">
            Warranty: <span className="font-medium text-gray-900 dark:text-white">{item.warranty}</span>
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default CartItem;