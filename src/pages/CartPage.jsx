import React from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import CartItem from "../components/CartItem";
import PeopleAlsoBought from "../components/PeopleAlsoBought";
import OrderSummary from "../components/OrderSummary";
import GiftCouponCard from "../components/GiftCouponCard";
import ShippingProgress from "../components/ShippingProgress";
import LoyaltyPointsCard from "../components/LoyaltyPointsCard";
import SecureCheckoutBadges from "../components/SecureCheckoutBadges";


const CartPage = () => {
  const { cart } = useCartStore();

  return (
    <div className="bg-slate-100 dark:bg-slate-950 pt-28">
      <div className="px-4 mx-auto max-w-7xl">
        <motion.h1
          className="mb-8 text-3xl font-bold md:text-4xl text-slate-900 dark:text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Your Shopping Cart
        </motion.h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* CART ITEMS */}
          <motion.div
            className="space-y-6 lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {cart.length === 0 ? (
              <EmptyCartUI />
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Cart Items ({cart.length})
                  </h2>
                  <div className="flex gap-4">
                    <button
                      onClick={() => useCartStore.getState().clearCart()}
                      className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    >
                      Clear Cart
                    </button>
                    <Link
                      to="/"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>

                <div
                  className="p-6 space-y-6 bg-white border shadow-sm  dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl"
                >
                  {cart.map((item) => (
                    <CartItem key={item._id} item={item} />
                  ))}
                </div>

                <PeopleAlsoBought />
              </>
            )}
          </motion.div>

          {/* SUMMARY */}
          {cart.length > 0 && (
            <motion.div
              className="space-y-6 lg:sticky lg:top-32 h-fit"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <OrderSummary />
              <GiftCouponCard />
              <ShippingProgress currentStep={1} />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;

const EmptyCartUI = () => (
  <motion.div
    className="flex flex-col items-center px-6 text-center bg-white border shadow-sm  dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl py-14"
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    <div className="p-4 mb-4 rounded-full  bg-slate-100 dark:bg-slate-800">
      <ShoppingCart className="w-12 h-12 text-slate-400" />
    </div>

    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
      Your cart is empty
    </h3>

    <p className="max-w-xs mt-1 text-sm text-slate-500 dark:text-slate-400">
      Add items to your cart to continue shopping.
    </p>

    <Link
      to="/"
      className="
        mt-5 inline-flex items-center
        bg-emerald-600 hover:bg-emerald-700
        text-white text-sm font-medium
        px-6 py-2.5 rounded-full
        transition-colors
      "
    >
      Start Shopping
    </Link>
  </motion.div>
);