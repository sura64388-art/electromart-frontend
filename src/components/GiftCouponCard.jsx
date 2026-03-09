import React from 'react';
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCartStore } from "../stores/useCartStore";
import { Tag, X, CheckCircle } from "lucide-react";

const GiftCouponCard = () => {
  const [userInputCode, setUserInputCode] = useState("");
  const { coupon, isCouponApplied, applyCoupon, getMyCoupon, removeCoupon } = useCartStore();

  useEffect(() => {
    getMyCoupon();
  }, [getMyCoupon]);

  useEffect(() => {
    if (coupon) setUserInputCode(coupon.code);
  }, [coupon]);

  const handleApplyCoupon = () => {
    if (!userInputCode) return;
    applyCoupon(userInputCode);
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon();
    setUserInputCode("");
  };

  return (
    <motion.div
      className='p-5 space-y-6 bg-white border border-gray-200 shadow-sm rounded-xl dark:border-gray-700 dark:bg-gray-800 md:p-6'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
          <Tag size={20} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Apply Coupon or Gift Card
        </h3>
      </div>

      {/* Input Section */}
      <div className='space-y-4'>
        <div>
          <label htmlFor='voucher' className='block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
            Enter coupon code
          </label>
          <div className="flex gap-3">
            <input
              type='text'
              id='voucher'
              className='flex-1 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 transition-colors bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none'
              placeholder='e.g., SUMMER25'
              value={userInputCode}
              onChange={(e) => setUserInputCode(e.target.value.toUpperCase())}
            />
            
            <motion.button
              type='button'
              className='inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-white transition-colors rounded-lg bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleApplyCoupon}
              disabled={!userInputCode.trim()}
            >
              Apply
            </motion.button>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Enter your coupon code and click apply
          </p>
        </div>
      </div>

      {/* Applied Coupon Section */}
      {isCouponApplied && coupon && (
        <motion.div
          className='p-4 mt-4 border rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-emerald-600 dark:text-emerald-400" />
              <div>
                <h4 className='font-medium text-emerald-800 dark:text-emerald-300'>
                  Coupon Applied Successfully!
                </h4>
                <p className='mt-1 text-sm text-emerald-700 dark:text-emerald-400'>
                  <span className="font-bold">{coupon.code}</span> - {coupon.discountPercentage}% discount applied
                </p>
              </div>
            </div>
            
            <motion.button
              type='button'
              className='inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 transition-colors rounded-lg dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRemoveCoupon}
            >
              <X size={16} />
              Remove
            </motion.button>
          </div>
        </motion.div>
      )}

      {coupon && !isCouponApplied && (
        <div className='p-4 mt-4 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800'>
          <div className="flex items-start gap-3">
            <Tag size={18} className="text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className='font-medium text-blue-800 dark:text-blue-300'>
                Your Available Coupon
              </h4>
              <div className="flex items-center gap-3 mt-2">
                <span className="px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-blue-300 dark:border-blue-700 font-mono font-bold text-blue-700 dark:text-blue-400">
                  {coupon.code}
                </span>
                <span className="text-sm text-blue-700 dark:text-blue-400">
                  {coupon.discountPercentage}% OFF
                </span>
              </div>
              <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                Click apply to use this coupon
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Coupons are applied to the total order value. Only one coupon can be used per order.
        </p>
      </div>
    </motion.div>
  );
};

export default GiftCouponCard;