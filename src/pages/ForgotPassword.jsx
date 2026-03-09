import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Loader, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../lib/axios";
const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const handleSendOTP = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await api.post("/auth/send-otp", { email });
			localStorage.setItem("resetEmail", email);

			toast.success(res.data.message, {
				style: {
					background: "#0f172a",
					color: "#e5e7eb",
				},
			});
			navigate("/reset-password", { state: { email } });
		} catch (err) {
			toast.error(
				err.response?.data?.message || "Failed to send OTP",
				{
					style: {
						background: "#0f172a",
						color: "#e5e7eb",
					},
				}
			);
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4">
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="
					w-full max-w-md rounded-2xl p-8
					bg-white dark:bg-slate-900
					border border-slate-200 dark:border-slate-800
					shadow-xl
				"
			>
				<div className="text-center mb-8">
					<h2 className="text-3xl font-bold text-slate-900 dark:text-white">
						Forgot Password
					</h2>
					<p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
						We’ll send a verification code to your email
					</p>
				</div>
				<form onSubmit={handleSendOTP} className="space-y-6">
					<div className="relative">
						<Mail className="absolute left-3 top-3 text-slate-400" size={18} />
						<input
							type="email"
							required
							placeholder="Email address"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="
								w-full pl-10 py-3 rounded-xl
								bg-slate-100 dark:bg-slate-800
								border border-slate-300 dark:border-slate-700
								text-slate-900 dark:text-white
								focus:ring-2 focus:ring-indigo-500
								outline-none
							"
						/>
					</div>
					<motion.button
						whileTap={{ scale: 0.97 }}
						disabled={loading}
						className="
							w-full py-3 rounded-xl font-semibold
							text-white flex justify-center items-center gap-2
							bg-linear-to-r from-indigo-500 to-cyan-500
							hover:from-indigo-600 hover:to-cyan-600
							transition shadow-lg disabled:opacity-50
						"
					>
						{loading ? (
							<>
								<Loader className="animate-spin" size={18} />
								Sending OTP
							</>
						) : (
							<>
								Send OTP <ArrowRight size={18} />
							</>
						)}
					</motion.button>
				</form>
			</motion.div>
		</div>
	);
};
export default ForgotPassword;
