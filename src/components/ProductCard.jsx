import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Zap, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import { toast } from "react-hot-toast";

const ProductCard = ({ product, layout = "grid", index = 2 }) => {
	const navigate = useNavigate();
	const { addToCart, clearCart } = useCartStore();
	const { user } = useUserStore();
	const [liked, setLiked] = useState(false);

	// Use product-specific offer if available, otherwise fallback to index-based discount for existing products
	const discount = (product.offer !== undefined)
		? (product.offer ? product.discountPercentage : 0)
		: ((index === 0 || index === 1) ? 45 : 72);

	const mrp = discount > 0 ? Math.round(product.price * (100 / (100 - Math.min(discount, 99)))) : product.price;

	const handleAddToCart = (e) => {
		e.preventDefault();
		if (!user) {
			toast.error("Please login first", { id: "login-error" });
			return;
		}
		addToCart(product);
	};

	const handleBuyNow = async (e) => {
		e.preventDefault();
		if (!user) {
			toast.error("Please login first", { id: "login-error" });
			return;
		}
		await clearCart();
		await addToCart(product);
		navigate("/cart?autoCheckout=true");
	};

	return (
		<motion.div
			className={`relative bg-white border border-gray-100 flex flex-col h-full group transition-all duration-300 hover:shadow-xl ${layout === "list" ? "flex-row" : "flex-col"
				}`}
		>
			{/* Discount Badge */}
			{discount > 0 && (
				<div className="absolute top-2 left-2 z-10">
					<div className="w-12 h-12 bg-[#b31919] rounded-full flex flex-col items-center justify-center text-white text-[10px] font-bold leading-tight shadow-md">
						<span>{discount}%</span>
						<span>OFF</span>
					</div>
				</div>
			)}

			{/* Wishlist Button */}
			<button
				onClick={(e) => {
					e.preventDefault();
					setLiked(!liked);
				}}
				className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-colors border border-gray-100"
			>
				<Heart
					size={18}
					className={liked ? "text-red-500 fill-red-500" : "text-gray-400"}
				/>
			</button>

			<Link to={`/product/${product._id}`} className="flex flex-col h-full">
				{/* Product Image */}
				<div className={`relative overflow-hidden bg-gray-50 flex items-center justify-center ${layout === "list" ? "w-48 h-48" : "h-64"}`}>
					<img
						src={product.image}
						alt={product.name}
						className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
					/>
				</div>

				{/* Product Details */}
				<div className="p-4 flex flex-col flex-1">
					<div className="mb-1">
						<span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest font-sans">
							{(!product.brand || product.brand === "N/A" || product.brand.trim() === "") ? (() => {
								const found = ["Atomberg", "Havells", "Orient", "Crompton", "V-Guard", "Anchor", "Luker", "Panasonic", "Philips", "Sturlite", "Luminous", "Exide", "Microtek", "Finolex", "Polycab", "RR Kabel", "Orbit", "Legrand", "GM", "Cona", "Bajaj", "AO Smith", "Racold", "Tornado", "Secure", "L&T", "Genus", "Schneider", "ABB", "Siemens", "Kirloskar", "Texmo", "CRI", "KSB", "Bindu", "Usha"]
									.find(b => product.name.toLowerCase().includes(b.toLowerCase()));
								if (found === "Tornado") return "Orient";
								return found || "N/A";
							})() : product.brand}
						</span>
					</div>

					{/* Star Rating */}
					<div className="flex items-center gap-1.5 mb-2">
						<div className="flex items-center gap-0.5">
							{[1, 2, 3, 4, 5].map((s) => (
								<Star
									key={s}
									size={13}
									className={s <= Math.round(product.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
								/>
							))}
						</div>
						{product.rating > 0 && (
							<span className="text-[11px] font-semibold text-gray-500">
								{product.rating?.toFixed(1)}
							</span>
						)}
						{product.numReviews > 0 && (
							<span className="text-[10px] text-gray-400">
								({product.numReviews})
							</span>
						)}
					</div>
					<h3 className="text-[15px] font-semibold text-gray-900 line-clamp-2 mb-2 leading-tight min-h-[40px] font-outfit">
						{product.name}
					</h3>

					<div className="mt-auto">
						<div className="flex flex-col mb-2">
							<div className="flex items-baseline gap-1.5">
								<span className="text-[18px] font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
							</div>
						</div>

						{discount > 0 && (
							<div className="flex items-center gap-2 text-[12px] mb-2">
								<span className="text-gray-400 font-medium">MRP</span>
								<span className="text-gray-400 line-through">₹{mrp.toLocaleString()}</span>
								<span className="text-[#b31919] font-bold">({discount}% OFF)</span>
							</div>
						)}

						<div className="flex items-center gap-2 mb-4">
							<span className={`text-[11px] font-bold px-2 py-0.5 rounded ${product.stock > 10 ? 'bg-green-100 text-green-700' : product.stock > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
								{product.stock > 0 ? `${product.stock} IN STOCK` : 'OUT OF STOCK'}
							</span>
						</div>

						{/* Action Buttons */}
						<div className="flex flex-col gap-2 mt-4">
							<button
								onClick={handleAddToCart}
								className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-[13px] font-bold text-gray-700 bg-white border-2 border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 active:scale-95"
							>
								<ShoppingCart size={16} />
								ADD TO CART
							</button>
							<button
								onClick={handleBuyNow}
								className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-[13px] font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md hover:shadow-blue-200 transition-all duration-200 active:scale-95"
							>
								<Zap size={16} />
								BUY NOW
							</button>
						</div>
					</div>
				</div>
			</Link>
		</motion.div>
	);
};

export default ProductCard;



