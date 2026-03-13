import { useState, useRef, useEffect } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Loader, RefreshCcw, ArrowLeft, ShoppingBag, CheckCircle, Eye, EyeOff, ShieldCheck, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios";

const ResetPassword = () => {
    const email = localStorage.getItem("resetEmail");
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isResetSuccessful, setIsResetSuccessful] = useState(false);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const navigate = useNavigate();

    const inputRefs = useRef([]);

    useEffect(() => {
        if (!email) return;
        if (timer === 0) {
            setCanResend(true);
            return;
        }
        const interval = setInterval(() => {
            setTimer((t) => t - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer, email]);

    if (!email) return <Navigate to="/forgot-password" />;

    const handleOtpChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").trim();
        if (!/^\d{6}$/.test(pasted)) return;
        setOtp(pasted.split(""));
        inputRefs.current[5]?.focus();
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const getChecks = () => {
        return {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password),
            match: password === confirmPassword && password.length > 0
        };
    };

    const checks = getChecks();
    const isPasswordValid = checks.length && checks.uppercase && checks.lowercase && checks.number && checks.special;

    const handleResetPassword = async (e) => {
        e.preventDefault();
        const otpValue = otp.join("");
        if (otpValue.length !== 6) {
            toast.error("Please enter the full 6-digit OTP");
            return;
        }
        if (!isPasswordValid) {
            toast.error("Please meet all password requirements");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        
        setLoading(true);
        try {
            await api.post("/auth/reset-password-with-otp", {
                email,
                otp: otpValue,
                password,
            });
            localStorage.removeItem("resetEmail");
            setIsResetSuccessful(true);
            toast.success("Password reset successfully!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Reset failed");
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async () => {
        try {
            await api.post("/auth/send-otp", { email });
            toast.success("OTP resent successfully");
            setTimer(60);
            setCanResend(false);
        } catch {
            toast.error("Failed to resend OTP");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[500px] bg-white dark:bg-slate-900 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden border border-slate-100 dark:border-slate-800"
            >
                <div className="p-8 sm:p-10">
                    {/* LOGO */}
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center gap-2 text-left">
                            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400">
                                <ShoppingBag size={32} />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-gray-900 dark:text-white text-xl font-black tracking-tighter uppercase">Sreesaravana</span>
                                <span className="text-red-600 dark:text-red-400 text-sm font-bold uppercase tracking-widest">Electricals</span>
                            </div>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {!isResetSuccessful ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                                        Reset Password
                                    </h2>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                                        Create a new secure password for your account
                                    </p>
                                </div>

                                <form onSubmit={handleResetPassword} className="space-y-6">
                                    {/* OTP INPUT */}
                                    <div className="space-y-3">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                                            Verification Code
                                        </label>
                                        <div className="flex justify-between gap-2" onPaste={handleOtpPaste}>
                                            {otp.map((d, i) => (
                                                <input
                                                    key={i}
                                                    ref={(el) => (inputRefs.current[i] = el)}
                                                    value={d}
                                                    maxLength={1}
                                                    onChange={(e) => handleOtpChange(e.target.value, i)}
                                                    onKeyDown={(e) => handleKeyDown(e, i)}
                                                    className="w-full aspect-square text-center text-xl font-bold rounded-2xl
                                                        border-2 border-slate-100 dark:border-slate-800
                                                        bg-slate-50 dark:bg-slate-800/50
                                                        text-slate-900 dark:text-white
                                                        focus:border-indigo-500 dark:focus:border-indigo-500/50
                                                        focus:bg-white dark:focus:bg-slate-800
                                                        outline-none transition-all duration-300"
                                                />
                                            ))}
                                        </div>
                                        <div className="text-center pt-2">
                                            {canResend ? (
                                                <button
                                                    type="button"
                                                    onClick={resendOtp}
                                                    className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors inline-flex items-center gap-1"
                                                >
                                                    <RefreshCcw size={14} /> Resend New Code
                                                </button>
                                            ) : (
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                    Resend in {timer}s
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* PASSWORD FIELDS */}
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                                                New Password
                                            </label>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                    className="w-full pl-12 pr-12 py-4 rounded-2xl
                                                        bg-slate-50 dark:bg-slate-800/50
                                                        border-2 border-slate-100 dark:border-slate-800
                                                        text-slate-900 dark:text-white font-medium
                                                        focus:border-indigo-500 outline-none transition-all duration-300"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* STRENGTH CHECKLIST */}
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl space-y-2 border border-slate-100 dark:border-slate-800/50">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                                                <Requirement label="At least 8 chars" met={checks.length} />
                                                <Requirement label="One upper case" met={checks.uppercase} />
                                                <Requirement label="One lower case" met={checks.lowercase} />
                                                <Requirement label="One number" met={checks.number} />
                                                <Requirement label="Special char" met={checks.special} />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                                                Confirm New Password
                                            </label>
                                            <div className="relative group">
                                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    required
                                                    className="w-full pl-12 pr-12 py-4 rounded-2xl
                                                        bg-slate-50 dark:bg-slate-800/50
                                                        border-2 border-slate-100 dark:border-slate-800
                                                        text-slate-900 dark:text-white font-medium
                                                        focus:border-indigo-500 outline-none transition-all duration-300"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                                >
                                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            {confirmPassword && (
                                                <div className={`text-xs font-bold pl-1 flex items-center gap-1 ${checks.match ? 'text-emerald-500' : 'text-red-500'}`}>
                                                    {checks.match ? <Check size={12} /> : <X size={12} />}
                                                    {checks.match ? 'Passwords match' : 'Passwords do not match'}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={loading || !isPasswordValid || !checks.match}
                                        className="w-full py-4 rounded-2xl font-bold text-white
                                            bg-emerald-500 hover:bg-emerald-600
                                            shadow-[0_10px_20px_rgba(16,185,129,0.2)]
                                            transition-all duration-300 disabled:opacity-50 disabled:bg-slate-300 text-lg"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader className="animate-spin inline mr-2" size={20} />
                                                Resetting...
                                            </>
                                        ) : (
                                            "Reset Password"
                                        )}
                                    </motion.button>
                                </form>

                                <div className="mt-8 text-center border-t border-slate-100 dark:border-slate-800 pt-6">
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
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                className="text-center py-4"
                            >
                                <div className="mb-8 text-center">
                                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                                        Reset Password
                                    </h2>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                        Your password has been changed successfully
                                    </p>
                                </div>

                                <div className="flex justify-center mb-10">
                                    <div className="relative">
                                        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                                            <CheckCircle className="text-emerald-500" size={56} />
                                        </div>
                                        <motion.div 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.2, type: "spring" }}
                                            className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 p-2 rounded-full shadow-lg"
                                        >
                                            <Check className="text-emerald-500" size={24} strokeWidth={4} />
                                        </motion.div>
                                    </div>
                                </div>

                                <div className="mb-10 text-center">
                                    <h3 className="text-2xl font-bold text-emerald-500 mb-3">
                                        Password Reset Successful!
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 font-medium px-4 leading-relaxed">
                                        You can now login with your new password. <br /> Security is our top priority.
                                    </p>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate("/login")}
                                    className="w-full py-4 rounded-2xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all text-lg"
                                >
                                    Sign In
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

const Requirement = ({ label, met }) => (
    <div className="flex items-center gap-2">
        <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-colors ${met ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
            {met && <Check className="text-white" size={10} strokeWidth={4} />}
        </div>
        <span className={`text-xs font-bold transition-colors ${met ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
            {label}
        </span>
    </div>
);

export default ResetPassword;
