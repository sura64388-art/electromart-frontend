import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User, ArrowRight, Loader, Shield, CheckCircle, Eye, EyeOff, Sparkles, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { useUserStore } from "../stores/useUserStore";
import toast from "react-hot-toast";

const getPasswordStrength = (password) => {
  let score = 0;
  const checks = [];

  if (password.length >= 8) {
    score++;
    checks.push({ label: "8+ characters", valid: true });
  } else {
    checks.push({ label: "8+ characters", valid: false });
  }

  if (/[A-Z]/.test(password)) {
    score++;
    checks.push({ label: "Uppercase letter", valid: true });
  } else {
    checks.push({ label: "Uppercase letter", valid: false });
  }

  if (/[0-9]/.test(password)) {
    score++;
    checks.push({ label: "Number", valid: true });
  } else {
    checks.push({ label: "Number", valid: false });
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score++;
    checks.push({ label: "Special character", valid: true });
  } else {
    checks.push({ label: "Special character", valid: false });
  }

  let strength;
  if (score <= 1) strength = { label: "Weak", color: "from-red-500 to-red-600", bg: "bg-red-100 dark:bg-red-900/20", text: "text-red-600 dark:text-red-400" };
  else if (score === 2) strength = { label: "Fair", color: "from-yellow-500 to-amber-500", bg: "bg-yellow-100 dark:bg-yellow-900/20", text: "text-yellow-600 dark:text-yellow-400" };
  else if (score === 3) strength = { label: "Good", color: "from-blue-500 to-cyan-500", bg: "bg-blue-100 dark:bg-blue-900/20", text: "text-blue-600 dark:text-blue-400" };
  else strength = { label: "Strong", color: "from-emerald-500 to-green-500", bg: "bg-green-100 dark:bg-green-900/20", text: "text-green-600 dark:text-green-400" };

  return { strength, checks };
};

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signup, googleLogin, loading } = useUserStore();
  const { strength, checks } = getPasswordStrength(formData.password);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    signup(formData);
  };

  const handleGoogleSuccess = async (response) => {
    try {
      await googleLogin(response.credential);
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const passwordMatch = formData.password === formData.confirmPassword;

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bg-blue-300 rounded-full top-1/4 left-1/4 w-96 h-96 mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-pulse"></div>
        <div className="absolute delay-1000 bg-purple-300 rounded-full bottom-1/4 right-1/4 w-80 h-80 mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-pulse"></div>
      </div>

      <motion.div
        className="w-full max-w-4xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* LEFT SIDE - ILLUSTRATION */}
          <motion.div
            className="flex-col justify-center hidden p-8 text-white lg:flex rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/20 backdrop-blur-sm">
                <Sparkles size={16} />
                <span className="text-sm font-semibold">JOIN OUR COMMUNITY</span>
              </div>
              <h1 className="mb-4 text-3xl font-bold leading-tight">
                Welcome to <br />
                <span className="text-cyan-300">Sree Saravana Electricials</span>
              </h1>
              <p className="text-lg opacity-90">
                Join thousands of satisfied customers who trust us for premium electronic products and exceptional service.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Secure & Safe</h3>
                  <p className="opacity-80">Bank-level security for your data</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Quality Guaranteed</h3>
                  <p className="opacity-80">1-year warranty on all products</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                  <UserPlus size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Exclusive Benefits</h3>
                  <p className="opacity-80">Special offers for members only</p>
                </div>
              </div>
            </div>

            <div className="p-6 mt-12 border rounded-xl bg-white/10 backdrop-blur-sm border-white/20">
              <p className="text-sm opacity-90">
                "The best electronic store. Quality products and amazing customer service!"
              </p>
              {/* <div className="flex items-center gap-3 mt-4"> */}
              {/* <div className="w-10 h-10 bg-white rounded-full"></div> */}
              {/* <div>
                  <p className="font-semibold">Rahul Sharma</p>
                  <p className="text-sm opacity-80">Verified Customer</p>
                </div> */}
              {/* </div> */}
            </div>
          </motion.div>

          {/* RIGHT SIDE - SIGNUP FORM */}
          <motion.div
            className="overflow-hidden bg-white border border-gray-100 shadow-2xl dark:bg-gray-800 rounded-2xl dark:border-gray-700"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* FORM HEADER */}
            <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 dark:border-gray-700">
              <div className="text-center">
                {/* LOGO */}
                <div className="flex justify-center mb-6">
                    <div className="flex items-center gap-2 text-left">
                        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-xl">
                            <ShoppingBag className="text-red-600 dark:text-red-400" size={32} />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-gray-900 dark:text-white text-xl font-black tracking-tighter uppercase">Sree Saravana</span>
                            <span className="text-red-600 dark:text-red-400 text-sm font-bold uppercase tracking-widest">Electricals</span>
                        </div>
                    </div>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-white rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-md">
                  <UserPlus size={16} />
                  <span className="text-sm font-bold uppercase">Register</span>
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                  Create Account
                </h2>
                <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                  Join our premium electrical community
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* NAME FIELD */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <User size={16} className="inline mr-2" />
                  Full Name
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 dark:border-gray-600
                    rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-all duration-300 group-hover:border-blue-400"
                    placeholder="John Doe"
                  />
                  <User className="absolute text-gray-400 transition-colors -translate-y-1/2 left-4 top-1/2 group-hover:text-blue-500" size={18} />
                </div>
              </div>

              {/* EMAIL FIELD */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Mail size={16} className="inline mr-2" />
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 dark:border-gray-600
                    rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-all duration-300 group-hover:border-blue-400"
                    placeholder="you@example.com"
                  />
                  <Mail className="absolute text-gray-400 transition-colors -translate-y-1/2 left-4 top-1/2 group-hover:text-blue-500" size={18} />
                </div>
              </div>

              {/* PASSWORD FIELD */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Lock size={16} className="inline mr-2" />
                  Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-12 py-3.5 border border-gray-300 dark:border-gray-600
                    rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-all duration-300 group-hover:border-blue-400"
                    placeholder="••••••••"
                  />
                  <Lock className="absolute text-gray-400 transition-colors -translate-y-1/2 left-4 top-1/2 group-hover:text-blue-500" size={18} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute text-gray-400 -translate-y-1/2 right-4 top-1/2 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* PASSWORD STRENGTH */}
                {formData.password && (
                  <div className="p-4 mt-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-semibold ${strength.text}`}>
                        {strength.label}
                      </span>
                      <div className="flex-1 h-2 ml-4 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
                        <div className={`h-full rounded-full bg-gradient-to-r ${strength.color} transition-all duration-500`} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {checks.map((check, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${check.valid ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                            <CheckCircle size={12} className={check.valid ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'} />
                          </div>
                          <span className={`text-xs ${check.valid ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                            {check.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Lock size={16} className="inline mr-2" />
                  Confirm Password
                </label>
                <div className="relative group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`w-full pl-12 pr-12 py-3.5 border rounded-xl
                    bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-all duration-300 group-hover:border-blue-400
                    ${formData.confirmPassword ? (passwordMatch ? 'border-green-500' : 'border-red-500') : 'border-gray-300 dark:border-gray-600'}`}
                    placeholder="••••••••"
                  />
                  <Lock className="absolute text-gray-400 transition-colors -translate-y-1/2 left-4 top-1/2 group-hover:text-blue-500" size={18} />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute text-gray-400 -translate-y-1/2 right-4 top-1/2 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {formData.confirmPassword && (
                  <div className={`flex items-center gap-2 mt-2 ${passwordMatch ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {passwordMatch ? (
                      <CheckCircle size={14} />
                    ) : (
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    )}
                    <span className="text-sm font-medium">
                      {passwordMatch ? "Passwords match" : "Passwords do not match"}
                    </span>
                  </div>
                )}
              </div>

              {/* TERMS */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 mt-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  I agree to the{" "}
                  <Link to="/terms" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* SUBMIT BUTTON */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center w-full gap-3 py-4 font-bold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Creating your account...
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    Create Account
                    <ArrowRight className="ml-2" size={18} />
                  </>
                )}
              </motion.button>

              {/* OR Divider */}
              <div className="relative flex items-center justify-center py-2">
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                <span className="flex-shrink px-4 text-sm font-medium text-gray-400 uppercase bg-white dark:bg-gray-800">
                  Or continue with
                </span>
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
              </div>

              {/* GOOGLE LOGIN BUTTON */}
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error("Google Login failed")}
                  useOneTap
                  theme="filled_blue"
                  shape="pill"
                  width={300}
                />
              </div>
            </form>

            {/* FOOTER */}
            <div className="p-8 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <p className="text-center text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 hover:underline group"
                >
                  Sign in here
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </p>

              <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-green-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Secure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-blue-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-purple-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Premium</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;