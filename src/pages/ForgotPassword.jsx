import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Loader, ArrowLeft, ShoppingBag, CheckCircle, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../lib/axios";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/auth/send-otp", { email });
            localStorage.setItem("resetEmail", email);

            toast.success(res.data.message || "OTP sent successfully");
            setIsEmailSent(true);
            
            // We can either stay here to show "Email Sent" or navigate.
            // Based on the image layout, we stay to show the second state.
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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[450px] bg-white dark:bg-slate-900 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden border border-slate-100 dark:border-slate-800"
            >
                <div className="p-8 sm:p-10">
                    {/* LOGO */}
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center gap-2 text-left">
                            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-xl">
                                <ShoppingBag className="text-red-600 dark:text-red-400" size={32} />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-gray-900 dark:text-white text-xl font-black tracking-tighter uppercase">Sreesaravana</span>
                                <span className="text-red-600 dark:text-red-400 text-sm font-bold uppercase tracking-widest">Electricals</span>
                            </div>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {!isEmailSent ? (
                            <motion.div
                                key="request"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="text-center mb-10">
                                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
                                        Forgot Password
                                    </h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed font-medium">
                                        Enter your email address and we'll send you a 6-digit verification code.
                                    </p>
                                </div>

                                <form onSubmit={handleSendOTP} className="space-y-6">
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                                            Email
                                        </label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                                            <input
                                                id="email"
                                                type="email"
                                                required
                                                placeholder="example@gmail.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="
                                                    w-full pl-12 pr-4 py-4 rounded-2xl
                                                    bg-slate-50 dark:bg-slate-800/50
                                                    border-2 border-slate-100 dark:border-slate-800
                                                    text-slate-900 dark:text-white font-medium
                                                    focus:border-emerald-500 outline-none transition-all duration-300
                                                "
                                            />
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={loading}
                                        className="
                                            w-full py-4 rounded-2xl font-bold
                                            text-white flex justify-center items-center gap-2
                                            bg-emerald-500 hover:bg-emerald-600
                                            shadow-[0_10px_20px_rgba(16,185,129,0.2)]
                                            transition-all duration-300 disabled:opacity-50
                                            text-lg
                                        "
                                    >
                                        {loading ? (
                                            <>
                                                <Loader className="animate-spin" size={22} />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                Send OTP <Send size={20} className="ml-1" />
                                            </>
                                        )}
                                    </motion.button>
                                </form>

                                <div className="mt-10 text-center">
                                    <Link 
                                        to="/login" 
                                        className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold transition-colors"
                                    >
                                        <ArrowLeft size={18} /> Back to Login
                                    </Link>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="sent"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4 }}
                                className="text-center"
                            >
                                <div className="mb-8">
                                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                                        Forgot Password
                                    </h2>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                                        Check your email
                                    </p>
                                </div>

                                <div className="flex justify-center mb-8">
                                    <div className="relative">
                                        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                                            <Mail className="text-emerald-500" size={48} />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 p-1 rounded-full">
                                            <CheckCircle className="text-emerald-500 bg-white dark:bg-slate-900 rounded-full" size={28} />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-10">
                                    <h3 className="text-2xl font-bold text-emerald-500 mb-3">
                                        Email Sent!
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                        We've sent a 6-digit verification code to <b>{email}</b>. 
                                        Please check your inbox and spam folder.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => navigate("/reset-password", { state: { email } })}
                                        className="w-full py-4 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg transition-all text-lg"
                                    >
                                        Enter Verification Code
                                    </motion.button>
                                    
                                    <button 
                                        onClick={() => setIsEmailSent(false)}
                                        className="w-full py-4 rounded-2xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                                    >
                                        Resend Code
                                    </button>
                                </div>

                                <div className="mt-8">
                                    <Link 
                                        to="/login" 
                                        className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold transition-colors"
                                    >
                                        <ArrowLeft size={18} /> Back to Login
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
