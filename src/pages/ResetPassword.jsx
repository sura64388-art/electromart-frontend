import { useState, useRef, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Loader, KeyRound, RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios";

const ResetPassword = () => {
  const email = localStorage.getItem("resetEmail");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([])
  if (!email) return <Navigate to="/forgot-password" />;
  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);
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
  const getStrength = () => {
    if (password.length < 6) return { label: "Weak", color: "bg-red-500" };
    if (
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    )
      return { label: "Strong", color: "bg-emerald-500" };
    return { label: "Medium", color: "bg-orange-400" };
  };

  const strength = getStrength();
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/reset-password-with-otp", {
        email,
        otp: otp.join(""),
        password,
      });
      toast.success(res.data.message || "Password reset successful");
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
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
            <KeyRound className="text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Reset Password
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enter the 6-digit OTP sent to your email
          </p>
        </div>
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="flex justify-between gap-2" onPaste={handleOtpPaste}>
            {otp.map((d, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                value={d}
                maxLength={1}
                onChange={(e) => handleOtpChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-12 h-12 text-center text-lg font-semibold rounded-xl
                  border border-slate-300 dark:border-slate-700
                  bg-slate-100 dark:bg-slate-800
                  focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            ))}
          </div>
          <div className="text-center text-sm">
            {canResend ? (
              <button
                type="button"
                onClick={resendOtp}
                className="inline-flex items-center gap-1 text-indigo-600 hover:underline"
              >
                <RefreshCcw size={14} /> Resend OTP
              </button>
            ) : (
              <span className="text-slate-500">
                Resend OTP in {timer}s
              </span>
            )}
          </div>
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 px-4 py-3 rounded-xl
                  bg-slate-100 dark:bg-slate-800
                  border border-slate-300 dark:border-slate-700
                  focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            {password && (
              <div className="mt-2">
                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className={`h-2 rounded-full ${strength.color}`}
                    style={{
                      width:
                        strength.label === "Weak"
                          ? "33%"
                          : strength.label === "Medium"
                          ? "66%"
                          : "100%",
                    }}
                  />
                </div>
                <p className="text-xs mt-1 text-slate-500">
                  Strength: {strength.label}
                </p>
              </div>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white
              bg-linear-to-r from-indigo-500 to-violet-600
              hover:from-indigo-600 hover:to-violet-700
              transition shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader className="animate-spin inline mr-2" size={18} />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;



