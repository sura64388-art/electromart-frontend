import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import toast from "react-hot-toast";
import {
  ShoppingCart,
  Package,
  Truck,
  Shield,
  ChevronLeft,
  Heart,
  Share2,
  ArrowRight,
  Check,
  Headphones,
  Zap,
  Star,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchProductById, selectedProduct, addReview } = useProductStore();
  const { addToCart, clearCart } = useCartStore();
  const { user } = useUserStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    fetchProductById(id);
  }, [id, fetchProductById]);

  if (!selectedProduct) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading product details...</p>
        </div>
      </div>
    );
  }

  const images = [
    selectedProduct.image,
  ];

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }
    addToCart(selectedProduct);
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }
    await clearCart();
    await addToCart(selectedProduct);
    navigate("/cart?autoCheckout=true");
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    setSubmitting(true);
    await addReview(id, { rating, comment });
    setSubmitting(false);
    setComment("");
    setRating(5);
    setIsReviewModalOpen(false);
  };

  return (
    <div className="min-h-screen pb-16 pt-28 bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg overflow-hidden bg-white shadow-2xl dark:bg-gray-900 rounded-3xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create Review</h3>
                <button
                  onClick={() => setIsReviewModalOpen(false)}
                  className="p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <img src={selectedProduct.image} alt="" className="object-cover w-16 h-16 rounded-lg" />
                  <p className="font-medium text-gray-900 line-clamp-2 dark:text-white">{selectedProduct.name}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Overall rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className={`p-1 transition-transform hover:scale-110 ${s <= rating ? "text-yellow-400" : "text-gray-300"}`}
                      >
                        <Star size={32} className={s <= rating ? "fill-current" : ""} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Add a written review</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="5"
                    className="w-full px-4 py-3 text-gray-900 border border-gray-200 rounded-xl dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="What did you like or dislike? What did you use this product for?"
                  ></textarea>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    disabled={submitting}
                    type="submit"
                    className="w-full py-4 text-base font-bold text-white transition-all bg-blue-600 shadow-lg px-8 rounded-xl hover:bg-blue-700 disabled:opacity-50 hover:shadow-blue-200"
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Back Button */}
      <div className="px-4 mx-auto mb-6 max-w-7xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 transition-colors dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ChevronLeft size={20} />
          Back to Products
        </button>
      </div>

      <div className="px-4 mx-auto max-w-7xl">
        {/* Main Product Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-12 lg:grid-cols-2"
        >
          {/* Left Column - Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative p-8 overflow-hidden shadow-2xl rounded-3xl bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
              <img
                src={images[selectedImage]}
                alt={selectedProduct.name}
                className="w-full h-auto max-h-[480px] object-contain transition-transform duration-500 hover:scale-105"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 text-xs font-bold text-white bg-linear-to-r from-blue-500 to-indigo-500 rounded-full">
                  BEST SELLER
                </span>
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute p-3 transition-all rounded-full shadow-lg top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:scale-110"
              >
                <Heart
                  size={20}
                  className={isWishlisted ? "text-red-500 fill-red-500" : "text-gray-600 dark:text-gray-400"}
                />
              </button>
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-4 pb-2 overflow-x-auto no-scrollbar">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === index
                    ? "border-blue-500 shadow-lg scale-105"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                >
                  <img
                    src={img}
                    alt={`View ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>

            {/* Product Description Section */}
            <div className="p-6 border border-gray-100 rounded-2xl bg-linear-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
              <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                Product Description
              </h3>
              <div className="space-y-4">
                <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                  {selectedProduct.description || "This premium product combines cutting-edge technology with elegant design. Engineered for exceptional performance and durability, it offers a seamless user experience with intuitive controls and reliable operation."}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-8">
            {/* Product Header */}
            <div>
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-4xl leading-tight tracking-tight font-outfit">
                  {selectedProduct.name}
                </h1>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1 px-2 py-1 text-white bg-green-600 rounded">
                  <span className="text-sm font-bold">{selectedProduct.rating?.toFixed(1) || "0.0"}</span>
                  <Star size={12} className="fill-current" />
                </div>
                <span className="text-sm font-medium text-gray-500">
                  {selectedProduct.numReviews || 0} Ratings & {selectedProduct.reviews?.length || 0} Reviews
                </span>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 mb-8 border border-blue-100 dark:border-blue-800">
                <Zap size={16} className="text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                  Premium Selection
                </span>
              </div>
            </div>

            {/* Price Section */}
            {(() => {
              const discount = selectedProduct.offer ? selectedProduct.discountPercentage : 0;
              const mrp = discount > 0 ? Math.round(selectedProduct.price * (100 / (100 - Math.min(discount, 99)))) : selectedProduct.price;

              return (
                <div className="p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
                  <div className="flex items-end gap-4">
                    <div>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                        {discount > 0 ? `Special Offer (${discount}% OFF)` : "Special Price"}
                      </span>
                      <div className="flex items-baseline gap-3 mt-1">
                        <span className="text-5xl font-black text-emerald-600 dark:text-emerald-400">
                          ₹{selectedProduct.price.toLocaleString()}
                        </span>
                        {discount > 0 && (
                          <span className="text-xl font-medium text-gray-400 line-through">
                            ₹{mrp.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Inclusive of all taxes • Free shipping
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="flex items-center justify-center flex-1 gap-3 px-8 py-4 font-bold text-gray-700 transition-all duration-300 shadow-md rounded-xl bg-white border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              >
                <ShoppingCart size={22} />
                Add to Cart
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuyNow}
                className="flex items-center justify-center flex-1 gap-3 px-8 py-4 font-bold text-white transition-all duration-300 shadow-lg rounded-xl bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200 shadow-blue-100"
              >
                <Zap size={22} />
                Buy Now
              </motion.button>

              <button className="p-4 transition-colors border-2 border-gray-300 rounded-xl dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600">
                <Share2 size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Stock Status */}
            <div className="p-4 rounded-xl bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10">
              <div className="flex items-center gap-3">
                <Check size={20} className="text-green-600 dark:text-green-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Available</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    In Stock - Ready to Ship
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="p-6 space-y-4 border border-gray-200 rounded-2xl dark:border-gray-700">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <Truck size={20} />
                Delivery Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Delivery</span>
                  <span className="font-medium text-gray-900 dark:text-white">2-3 Business Days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Service</span>
                  <span className="font-medium text-green-600 dark:text-green-400">Free Shipping</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Installation</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">Available</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs Section */}
        <div className="mt-16 overflow-hidden bg-white border border-gray-200 dark:bg-gray-900 rounded-3xl dark:border-gray-800">
          <div className="flex border-b border-gray-200 dark:border-gray-800">
            {["description", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-5 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === tab
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-400"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === "description" ? (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Key Features</h3>
                <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                  Discover the advanced features that make this product stand out from the competition.
                </p>
                <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Technical Specifications</h4>
                    <ul className="space-y-2">
                      {["Energy Efficient", "Premium Build Quality", "Easy Installation", "Smart Control Compatible"].map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <Check size={16} className="text-green-500" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">What's in the Box</h4>
                    <ul className="space-y-2">
                      {["Main Product", "User Manual", "Installation Guide", "Warranty Card", "Accessories Kit"].map((item, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <Package size={16} className="text-blue-500" />
                          <span className="text-gray-700 dark:text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                <div className="grid gap-12 lg:grid-cols-3">
                  {/* Rating Summary */}
                  <div className="space-y-8">
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Reviews</h3>
                      <div className="flex items-center gap-4">
                        <div className="text-5xl font-black text-gray-900 dark:text-white">
                          {selectedProduct.rating?.toFixed(1) || "0.0"}
                        </div>
                        <div className="space-y-1">
                          <div className="flex text-yellow-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} size={20} className={s <= Math.round(selectedProduct.rating || 0) ? "fill-current" : "text-gray-300"} />
                            ))}
                          </div>
                          <p className="text-sm text-gray-500">{selectedProduct.numReviews || 0} global ratings</p>
                        </div>
                      </div>
                    </div>

                    {/* Review Call to Action (Amazon Style) */}
                    <div className="pt-8 space-y-4 border-t border-gray-100 dark:border-gray-800">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Review this product</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Share your thoughts with other customers</p>

                      {user ? (
                        <button
                          onClick={() => setIsReviewModalOpen(true)}
                          className="w-full py-2.5 font-medium text-gray-900 transition-all bg-white border border-gray-300 rounded-full hover:bg-gray-50 flex items-center justify-center dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:hover:bg-gray-800"
                        >
                          Write a product review
                        </button>
                      ) : (
                        <div className="p-4 text-center border rounded-2xl border-gray-100 bg-gray-50 dark:bg-gray-800/50 dark:border-gray-800">
                          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">Please login to write a review</p>
                          <button
                            onClick={() => navigate("/login")}
                            className="px-6 py-2 text-sm font-bold text-blue-600 border border-blue-600 rounded-xl hover:bg-blue-50"
                          >
                            Login
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="lg:col-span-2 space-y-8">
                    {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                      selectedProduct.reviews.slice().reverse().map((review) => (
                        <div key={review._id} className="pb-8 border-b border-gray-100 dark:border-gray-800 last:border-0">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-10 h-10 font-bold text-blue-600 bg-blue-100 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                                {review.name.charAt(0)}
                              </div>
                              <div>
                                <h5 className="font-bold text-gray-900 dark:text-white">{review.name}</h5>
                                <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex gap-0.5 text-yellow-400">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} size={14} className={s <= review.rating ? "fill-current" : "text-gray-200"} />
                              ))}
                            </div>
                          </div>
                          <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                            {review.comment}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center text-gray-500">
                        <Package size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No reviews yet. Be the first to review this product!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;