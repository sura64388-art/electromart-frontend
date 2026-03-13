import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LogIn, Mail, Lock, ArrowRight, Loader, Eye, EyeOff, Shield, Key, ShoppingBag } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useUserStore } from "../stores/useUserStore";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login, googleLogin, loading } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Welcome back!");
    } catch {
      toast.error("Invalid email or password");
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      await googleLogin(response.credential);
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bg-blue-300 rounded-full top-1/4 right-1/4 w-96 h-96 mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-pulse"></div>
        <div className="absolute delay-1000 bg-purple-300 rounded-full bottom-1/4 left-1/4 w-80 h-80 mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-pulse"></div>
      </div>

      <motion.div
        className="w-full max-w-5xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* LEFT SIDE - WELCOME SECTION */}
          <motion.div
            className="flex-col justify-center hidden p-10 overflow-hidden text-white lg:flex rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/20 backdrop-blur-sm">
                <Shield size={16} />
                <span className="text-sm font-semibold">SECURE LOGIN</span>
              </div>

              <h1 className="mb-6 text-3xl font-bold leading-tight">
                Welcome Back to <br />
                <span className="text-cyan-300">Sree Saravana Electricials</span>
              </h1>

              <p className="mb-10 text-lg opacity-90">
                Your trusted destination for premium electronics and exclusive member benefits.
              </p>

              {/* Features List */}
              <div className="mb-12 space-y-6">
                <div className="flex items-center gap-4 p-4 border rounded-xl bg-white/10 backdrop-blur-sm border-white/20">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Secure Account</h3>
                    <p className="opacity-80">Bank-level security protection</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 border rounded-xl bg-white/10 backdrop-blur-sm border-white/20">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                    <Key size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Quick Access</h3>
                    <p className="opacity-80">Manage your orders anytime</p>
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div className="p-6 border rounded-xl bg-white/10 backdrop-blur-sm border-white/20">
                <p className="mb-3 italic opacity-90">
                  "Best electronics shopping experience! Fast delivery and excellent support."
                </p>
                <div className="flex items-center gap-3">
                  {/* <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20"> */}
                  {/* <span className="font-bold">RS</span> */}
                  {/* </div> */}
                  {/* <div>
                    <p className="font-semibold">Rahul Sharma</p>
                    <p className="text-sm opacity-80">Verified Customer</p>
                  </div> */}
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE - LOGIN FORM */}
          <motion.div
            className="overflow-hidden bg-white border border-gray-100 shadow-2xl dark:bg-gray-800 rounded-2xl dark:border-gray-700"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* FORM HEADER */}
            <div className="p-10 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 dark:border-gray-700">
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

                <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg">
                  <Key size={16} />
                  <span className="text-sm font-bold uppercase">Sign In</span>
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                  Welcome Back!
                </h2>
                <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                  Secure access to your account
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-7">
              {/* EMAIL FIELD */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Mail size={16} className="inline mr-2" />
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-4 pl-12 pr-4 text-gray-900 placeholder-gray-400 transition-all duration-300 bg-white border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent group-hover:border-blue-400 dark:placeholder-gray-500"
                    placeholder="Enter your email"
                  />
                  <Mail className="absolute text-gray-400 transition-colors -translate-y-1/2 left-4 top-1/2 group-hover:text-blue-500" size={18} />
                </div>
              </div>

              {/* PASSWORD FIELD */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Lock size={16} className="inline mr-2" />
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-blue-600 transition-colors dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-4 pl-12 pr-12 text-gray-900 placeholder-gray-400 transition-all duration-300 bg-white border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent group-hover:border-blue-400 dark:placeholder-gray-500"
                    placeholder="Enter your password"
                  />
                  <Lock className="absolute text-gray-400 transition-colors -translate-y-1/2 left-4 top-1/2 group-hover:text-blue-500" size={18} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute text-gray-400 transition-colors -translate-y-1/2 right-4 top-1/2 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* REMEMBER ME */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 transition-all duration-200 border-2 border-gray-300 rounded-md dark:border-gray-600 peer-checked:border-blue-500 peer-checked:bg-blue-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-white transition-opacity opacity-0 peer-checked:opacity-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-sm text-gray-700 select-none dark:text-gray-300">Remember me</span>
                </label>
              </div>

              {/* LOGIN BUTTON */}
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
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    Sign In to Account
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

            {/* SIGN UP LINK */}
            <div className="px-10 pb-10">
              <div className="p-6 text-center border border-gray-200 rounded-xl bg-gray-50 dark:bg-gray-900/50 dark:border-gray-700">
                <p className="mb-3 text-gray-600 dark:text-gray-400">
                  Don't have an account?
                </p>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 shadow-md bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl hover:from-green-600 hover:to-emerald-700 hover:shadow-lg"
                >
                  Create New Account
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;