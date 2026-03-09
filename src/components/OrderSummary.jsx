import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link, useNavigate } from "react-router-dom";
import {
	MoveRight,
	ShieldCheck,
	Lock,
	CreditCard,
	MapPin,
	FileText,
	X,
} from "lucide-react";
import ShippingMethodSelector from "./ShippingMethodSelector";
import PaymentMethodSelector from "./PaymentMethodSelector";
import InvoicePreview from "./InvoicePreview";


import axios from "../lib/axios";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

const OrderSummary = () => {
	const { total, subtotal, coupon, isCouponApplied, cart, clearCart } = useCartStore();
	const navigate = useNavigate();

	const [showAddressForm, setShowAddressForm] = useState(false);
	const [showPreviewModal, setShowPreviewModal] = useState(false);
	const invoiceRef = useRef(null);
	const [addresses, setAddresses] = useState([]);
	const [selectedAddress, setSelectedAddress] = useState(null);
	const [newAddress, setNewAddress] = useState({
		fullName: "",
		phone: "",
		street: "",
		city: "",
		state: "",
		pincode: "",
		country: "India",
		landmark: "",
	});
	const [shippingMethod, setShippingMethod] = useState(null);
	const [paymentMethod, setPaymentMethod] = useState("ONLINE");
	const [savingAddress, setSavingAddress] = useState(false);
	const [userProfile, setUserProfile] = useState(null);
	const [processingPayment, setProcessingPayment] = useState(false);
	const [loading, setLoading] = useState(true);


	useEffect(() => {
		const fetchUserData = async () => {
			try {
				setLoading(true);
				const profileRes = await axios.get(`/auth/profile`);
				setUserProfile(profileRes.data.user);

				setNewAddress(prev => ({
					...prev,
					fullName: profileRes.data.user?.name || "",
					phone: profileRes.data.user?.mobile || "",
				}));

				const addressRes = await axios.get(`/addresses`);
				setAddresses(addressRes.data.addresses || []);

				const defaultAddress = addressRes.data.addresses?.find(addr => addr.isDefault);
				if (defaultAddress) {
					setSelectedAddress(defaultAddress);
				} else if (addressRes.data.addresses?.length > 0) {
					setSelectedAddress(addressRes.data.addresses[0]);
				}
			} catch (error) {
				console.error("Error fetching user Data:", error);
				toast.error("Failed to load user data");
			} finally {
				setLoading(false);
			}
		};
		fetchUserData();
	}, []);

	const savings = Math.max(0, subtotal - total);
	const taxRate = subtotal >= 20000 ? 0.18 : 0;
	const taxAmount = subtotal * taxRate;

	const shippingCosts = {
		STANDARD: 49,
		EXPRESS: 99,
		SAME_DAY: 199,
	};

	const shippingCost = shippingMethod ? (shippingCosts[shippingMethod] || 0) : 0;
	const finalTotal = Math.max(0, (subtotal - savings) + shippingCost + taxAmount);

	const handleAddressChange = (e) => {
		setNewAddress({
			...newAddress,
			[e.target.name]: e.target.value,
		});
	};

	const validateAddress = () => {
		const { street, city, state, pincode, phone, fullName } = newAddress;
		if (!street.trim() || !city.trim() || !state.trim() || !pincode.trim() || !phone.trim() || !fullName.trim()) {
			toast.error("Please fill all required address fields");
			return false;
		}
		if (phone.length !== 10) {
			toast.error("Please enter a valid 10-digit phone number");
			return false;
		}
		if (pincode.length !== 6) {
			toast.error("Please enter a valid 6-digit pincode");
			return false;
		}
		return true;
	};

	const saveAddress = async () => {
		if (!validateAddress()) return;

		setSavingAddress(true);
		try {
			const response = await axios.post(`/addresses`, newAddress);

			const savedAddress = response.data.address;
			setAddresses(response.data.addresses);
			setSelectedAddress(savedAddress);
			setShowAddressForm(false);

			setNewAddress({
				fullName: userProfile?.name || "",
				phone: userProfile?.mobile || "",
				street: "",
				city: "",
				state: "",
				pincode: "",
				country: "India",
				landmark: "",
			});

			toast.success("Address saved successfully!");
		} catch (error) {
			console.error("Error saving address:", error);
			toast.error(error.response?.data?.message || "Failed to save address");
		} finally {
			setSavingAddress(false);
		}
	};

	const handleShowAddressForm = () => {
		setNewAddress({
			fullName: userProfile?.name || "",
			phone: userProfile?.mobile || "",
			street: "",
			city: "",
			state: "",
			pincode: "",
			country: "India",
			landmark: "",
		});
		setShowAddressForm(true);
	};

	const loadRazorpayScript = () =>
		new Promise((resolve) => {
			if (window.Razorpay) return resolve(true);
			const script = document.createElement("script");
			script.src = "https://checkout.razorpay.com/v1/checkout.js";
			script.onload = () => resolve(true);
			script.onerror = () => resolve(false);
			document.body.appendChild(script);
		});

	const handleRazorpayPayment = async () => {
		if (!cart || cart.length === 0) {
			toast.error("Your cart is empty");
			return;
		}

		if (!selectedAddress) {
			toast.error("Please select a delivery address first");
			return;
		}

		setProcessingPayment(true);

		try {
			// Send cart items with correct structure
			const { data } = await axios.post(`/orders/createOrder`, {
				products: cart.map(item => ({
					productId: item._id || item.product?._id,
					quantity: item.quantity || 1,
					size: item.size || "",
					color: item.color || "",
				})),
				deliveryAddress: {
					fullName: selectedAddress.fullName || userProfile?.name || "",
					phone: selectedAddress.phone || userProfile?.mobile || "",
					street: selectedAddress.street || "",
					city: selectedAddress.city || "",
					state: selectedAddress.state || "",
					pincode: selectedAddress.pincode || "",
					country: selectedAddress.country || "India",
					landmark: selectedAddress.landmark || "",
				},
				shippingMethod,
				couponCode: coupon && isCouponApplied ? coupon.code : null,
				paymentMethod: paymentMethod, // Dynamically set
			});

			const { order, paymentRequired } = data;

			// Handle COD directly
			if (paymentMethod === "COD") {
				toast.success("Order placed successfully!");
				clearCart();
				navigate(`/orders/${order._id}`);
				return;
			}

			if (!paymentRequired && paymentMethod === "ONLINE") {
				// Rare case where online but amounts 0 (e.g. huge coupon)
				toast.success("Order placed successfully!");
				clearCart();
				navigate(`/orders/${order._id}`);
				return;
			}

			const loaded = await loadRazorpayScript();
			if (!loaded) {
				toast.error("Payment gateway failed to load");
				setProcessingPayment(false);
				return;
			}

			try {
				const paymentResponse = await axios.post(`/orders/payment/initiate`, {
					orderId: order._id,
					amount: order.finalAmount * 100,
				});

				const { razorpayOrderId, key, userName, userEmail } = paymentResponse.data;

				const options = {
					key,
					order_id: razorpayOrderId,
					amount: order.finalAmount * 100,
					currency: "INR",
					name: "Sree Saravana Electricals",
					description: `Order #${order._id.slice(-8).toUpperCase()}`,
					handler: async (response) => {
						try {
							const verifyRes = await axios.post(`/orders/payment/verify`, {
								razorpay_payment_id: response.razorpay_payment_id,
								razorpay_order_id: response.razorpay_order_id,
								razorpay_signature: response.razorpay_signature,
								orderId: order._id,
							});

							if (verifyRes.data.success) {
								toast.success("Payment successful! Order confirmed.");

								// Trigger Automatic PDF Download
								if (invoiceRef.current) {
									setTimeout(() => {
										invoiceRef.current.download();
									}, 1000);
								}

								clearCart();
								navigate(`/orders/${order._id}`);
							} else {
								toast.error("Payment verification failed");
								setProcessingPayment(false);
							}
						} catch (error) {
							console.error("Payment verification error:", error);
							toast.error(error.response?.data?.message || "Payment verification failed");
							setProcessingPayment(false);
						}
					},
					prefill: {
						name: userName || userProfile?.name || "",
						email: userEmail || userProfile?.email || "",
						contact: selectedAddress.phone || userProfile?.mobile || "",
					},
					theme: {
						color: "#10B981"
					},
					modal: {
						ondismiss: function () {
							toast.error("Payment cancelled");
							setProcessingPayment(false);
						}
					}
				};

				const razorpayInstance = new window.Razorpay(options);
				razorpayInstance.on('payment.failed', function (response) {
					toast.error(`Payment failed: ${response.error.description}`);
					setProcessingPayment(false);
				});
				razorpayInstance.open();

			} catch (paymentError) {
				// If payment endpoints don't exist, use direct Razorpay
				if (paymentError.response?.status === 404) {
					toast.error("Payment system not configured. Please contact support.");
					setProcessingPayment(false);
					return;
				}
				throw paymentError;
			}

		} catch (err) {
			console.error("Payment error:", err);
			const errorMessage = err.response?.data?.message ||
				err.response?.data?.error ||
				"Failed to process payment";
			toast.error(errorMessage);
			setProcessingPayment(false);
		}
	};

	if (loading) {
		return (
			<div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-6">
				<div className="animate-pulse space-y-4">
					<div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
					<div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
					<div className="h-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
					<div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
				</div>
			</div>
		);
	}

	const mockOrder = {
		_id: "PREVIEW-BILL",
		orderStatus: "DRAFT_PREVIEW",
		createdAt: new Date().toISOString(),
		user: {
			name: userProfile?.name || "Guest User",
			email: userProfile?.email || "guest@example.com",
		},
		deliveryAddress: selectedAddress || {
			fullName: newAddress.fullName || "N/A",
			street: newAddress.street || "N/A",
			city: newAddress.city || "N/A",
			state: newAddress.state || "N/A",
			pincode: newAddress.pincode || "N/A",
			phone: newAddress.phone || "N/A",
		},
		products: cart.map(item => ({
			product: {
				name: item.name,
				image: item.image,
				brand: item.brand
			},
			quantity: item.quantity,
			price: item.price,
			size: item.size
		})),
		totalAmount: subtotal,
		shippingCost: shippingCost,
		taxAmount: taxAmount,
		discountAmount: savings,
		finalAmount: finalTotal
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="
				rounded-2xl border border-slate-200 dark:border-slate-800
				bg-white dark:bg-slate-900 shadow-xl
				p-6 space-y-6
			"
		>
			<div className="flex items-center justify-between">
				<h3 className="text-xl font-semibold text-slate-900 dark:text-white">
					Order Summary
				</h3>

				{coupon && isCouponApplied && (
					<span className="
						px-3 py-1 text-xs font-medium rounded-full
						bg-emerald-100 text-emerald-700
						dark:bg-emerald-900/40 dark:text-emerald-300
					">
						Coupon: {coupon.code}
					</span>
				)}
			</div>

			<div className="space-y-4">
				<h4 className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
					<MapPin size={18} />
					Delivery Address
				</h4>

				{addresses.length > 0 && !showAddressForm && (
					<div className="space-y-2">
						{addresses.map((addr) => (
							<div
								key={addr._id || addr.id}
								onClick={() => setSelectedAddress(addr)}
								className={`p-3 border rounded-lg cursor-pointer transition-colors ${(selectedAddress?._id === addr._id || selectedAddress?.id === addr.id)
									? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
									: "border-slate-200 dark:border-slate-700 hover:border-slate-300"
									}`}
							>
								<div className="flex items-start gap-2">
									<div className={`w-4 h-4 mt-1 rounded-full border flex items-center justify-center ${(selectedAddress?._id === addr._id || selectedAddress?.id === addr.id)
										? "border-emerald-500 bg-emerald-500"
										: "border-slate-300"
										}`}>
										{(selectedAddress?._id === addr._id || selectedAddress?.id === addr.id) && (
											<div className="w-2 h-2 rounded-full bg-white"></div>
										)}
									</div>
									<div>
										<p className="font-medium text-slate-900 dark:text-white">
											{addr.fullName || userProfile?.name}
										</p>
										<p className="text-sm text-slate-600 dark:text-slate-400">
											{addr.street}
										</p>
										<p className="text-sm text-slate-600 dark:text-slate-400">
											{addr.city}, {addr.state} - {addr.pincode}
										</p>
										<p className="text-sm text-slate-600 dark:text-slate-400">
											📱 {addr.phone || userProfile?.mobile}
										</p>
										{addr.landmark && (
											<p className="text-xs text-slate-500 dark:text-slate-400">
												Landmark: {addr.landmark}
											</p>
										)}
										{addr.isDefault && (
											<span className="inline-block mt-1 px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 rounded">
												Default
											</span>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				)}

				{showAddressForm ? (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						className="space-y-3 relative p-4 border border-emerald-100 dark:border-emerald-900/30 rounded-xl bg-emerald-50/30 dark:bg-emerald-900/10 mb-6"
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
									Full Name *
								</label>
								<input
									type="text"
									name="fullName"
									value={newAddress.fullName}
									onChange={handleAddressChange}
									className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
									placeholder="Full Name"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
									Phone Number *
								</label>
								<input
									type="tel"
									name="phone"
									value={newAddress.phone}
									onChange={handleAddressChange}
									className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
									placeholder="10-digit mobile number"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
									Street Address *
								</label>
								<input
									type="text"
									name="street"
									value={newAddress.street}
									onChange={handleAddressChange}
									className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
									placeholder="House no., Building, Street"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
									City *
								</label>
								<input
									type="text"
									name="city"
									value={newAddress.city}
									onChange={handleAddressChange}
									className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
									placeholder="City"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
									State *
								</label>
								<input
									type="text"
									name="state"
									value={newAddress.state}
									onChange={handleAddressChange}
									className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
									placeholder="State"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
									Pincode *
								</label>
								<input
									type="text"
									name="pincode"
									value={newAddress.pincode}
									onChange={handleAddressChange}
									className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
									placeholder="6-digit pincode"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
									Landmark (Optional)
								</label>
								<input
									type="text"
									name="landmark"
									value={newAddress.landmark}
									onChange={handleAddressChange}
									className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
									placeholder="Nearby landmark"
								/>
							</div>
						</div>

						<div className="flex gap-2">
							<button
								onClick={saveAddress}
								disabled={savingAddress}
								className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
							>
								{savingAddress ? (
									<>
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
										Saving...
									</>
								) : "Save Address"}
							</button>
							<button
								onClick={() => setShowAddressForm(false)}
								className="px-4 py-2 border border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
							>
								Cancel
							</button>
						</div>
					</motion.div>
				) : (
					<button
						onClick={handleShowAddressForm}
						className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:border-emerald-400 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2"
					>
						<MapPin size={16} />
						+ Add New Delivery Address
					</button>
				)}
			</div>

			{selectedAddress && (
				<ShippingMethodSelector
					selectedMethod={shippingMethod}
					onSelectMethod={setShippingMethod}
					shippingCosts={shippingCosts}
				/>
			)}

			{/* Payment Method Selector - Placed after Shipping */}
			<PaymentMethodSelector
				selectedMethod={paymentMethod}
				onSelectMethod={setPaymentMethod}
			/>

			<div className="space-y-3 text-sm">
				<div className="flex justify-between text-slate-600 dark:text-slate-400">
					<span>Subtotal</span>
					<span>₹{subtotal.toFixed(2)}</span>
				</div>

				{savings > 0 && (
					<div className="flex justify-between text-emerald-600 font-medium">
						<span>You Save</span>
						<span>-₹{savings.toFixed(2)}</span>
					</div>
				)}

				{shippingMethod && (
					<div className="flex justify-between text-slate-600 dark:text-slate-400">
						<span>Shipping</span>
						<span>{shippingCost > 0 ? `₹${shippingCost.toFixed(2)}` : "Free"}</span>
					</div>
				)}

				{taxAmount > 0 && (
					<div className="flex justify-between text-slate-600 dark:text-slate-400">
						<span>GST (18%)</span>
						<span>₹{taxAmount.toFixed(2)}</span>
					</div>
				)}

				<div className="
					border-t border-dashed border-slate-300 dark:border-slate-700
					pt-3 flex justify-between text-lg font-bold
				">
					<span>Total Amount</span>
					<span className="text-emerald-600">
						₹{finalTotal.toFixed(2)}
					</span>
				</div>
			</div>



			<div className="
				grid grid-cols-3 gap-3 text-xs text-center
				text-slate-500 dark:text-slate-400
			">
				<div className="flex flex-col items-center gap-1">
					<ShieldCheck size={18} className="text-emerald-500" />
					SSL Secure
				</div>
				<div className="flex flex-col items-center gap-1">
					<Lock size={18} className="text-indigo-500" />
					Safe Checkout
				</div>
				<div className="flex flex-col items-center gap-1">
					<CreditCard size={18} className="text-cyan-500" />
					Razorpay
				</div>
			</div>


			<motion.button
				whileTap={{ scale: 0.98 }}
				onClick={handleRazorpayPayment}
				disabled={!selectedAddress || cart.length === 0 || processingPayment}
				className={`
					w-full py-3 rounded-xl font-semibold text-white
					bg-linear-to-r from-emerald-500 to-teal-600
					transition shadow-lg flex items-center justify-center gap-2
					${!selectedAddress || cart.length === 0 || processingPayment
						? "opacity-50 cursor-not-allowed"
						: "hover:from-emerald-600 hover:to-teal-700"
					}
				`}
			>
				{processingPayment ? (
					<>
						<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
						Processing...
					</>
				) : !selectedAddress ? (
					"Select Address to Continue"
				) : cart.length === 0 ? (
					"Cart is Empty"
				) : (
					<>
						{paymentMethod === "COD" ? (
							<>
								<CreditCard size={18} />
								Place Cash on Delivery Order
							</>
						) : (
							<>
								<CreditCard size={18} />
								Pay Securely ₹{finalTotal.toFixed(2)}
							</>
						)}
					</>
				)}
			</motion.button>

			<div className="text-center text-sm text-slate-500 dark:text-slate-400">
				or{" "}
				<Link
					to="/"
					className="inline-flex items-center gap-1
					text-emerald-600 hover:underline"
				>
					Continue Shopping <MoveRight size={14} />
				</Link>
			</div>

			{/* Hidden Invoice Preview for Auto-Download */}
			<div className="hidden">
				<InvoicePreview
					ref={invoiceRef}
					order={mockOrder}
					showButton={false}
				/>
			</div>
		</motion.div >
	);
};

export default OrderSummary;