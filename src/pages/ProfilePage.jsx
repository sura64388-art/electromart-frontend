import React, { useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  Lock,
  User,
  MapPin,
  LogOut,
  Package,
  CreditCard,
  Bell,
  Shield,
  Mail,
  Phone,
  Home,
  Globe,
  Camera,
  Save,
  Key,
  Map,
  UserCircle,
  ShieldCheck,
  Upload,
  CheckCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { motion } from "framer-motion";

const avatarOptions = [
  "/avatar1.png",
  "/avatar2.png",
  "/avatar3.png",
  "/avatar4.png",
  "/avatar5.png",
];

const ProfilePage = () => {
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const logout = useUserStore((s) => s.logout);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState({
    profile: false,
    address: false,
    password: false
  });

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    mobile: "",
    avatar: avatarOptions[0],
  });

  const fileInputRef = React.useRef(null);

  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India"
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
        avatar: user.avatar || avatarOptions[0],
      });
      if (user.address) setAddressForm(user.address);
    }
  }, [user]);

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, profile: true });
    try {
      const res = await axios.put("/auth/profile", profileForm);
      setUser(res.data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading({ ...loading, profile: false });
    }
  };

  const updateAddress = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, address: true });
    try {
      const res = await axios.put("/auth/address", addressForm);
      setUser(res.data);
      toast.success("Address updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update address");
    } finally {
      setLoading({ ...loading, address: false });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return toast.error("Image size should be less than 5MB");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileForm({ ...profileForm, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const updatePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (passwordForm.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading({ ...loading, password: true });
    try {
      await axios.put("/auth/change-password", passwordForm);
      toast.success("Password updated successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update password");
    } finally {
      setLoading({ ...loading, password: false });
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-28 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="text-center">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30">
            <UserCircle size={40} className="text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Please login to view profile</p>
          <Link
            to="/login"
            className="inline-block px-8 py-3 mt-6 font-medium text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg"
          >
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User, color: "text-blue-600" },
    { id: "address", label: "Address", icon: MapPin, color: "text-green-600" },
    { id: "password", label: "Security", icon: ShieldCheck, color: "text-purple-600" },
  ];

  return (
    <div className="min-h-screen pb-16 pt-28 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <div className="px-4 mx-auto mb-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl"
        >
          <div className="flex flex-col items-center gap-6 md:flex-row">
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <div className="relative w-24 h-24 overflow-hidden border-4 border-white shadow-xl rounded-2xl dark:border-gray-800 bg-gray-100">
                <img
                  src={profileForm.avatar}
                  alt="Avatar"
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.target.src = "/avatar1.png";
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-blue-600 border-4 border-white rounded-full dark:border-gray-800 hover:bg-blue-700 transition-transform active:scale-95 shadow-lg"
              >
                <Camera size={16} className="text-white" />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
              <p className="flex items-center justify-center gap-2 mt-2 text-gray-600 dark:text-gray-400 md:justify-start">
                <Mail size={16} />
                {user.email}
              </p>
              {user.mobile && (
                <p className="flex items-center justify-center gap-2 mt-1 text-gray-600 dark:text-gray-400 md:justify-start">
                  <Phone size={16} />
                  {user.mobile}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-6 py-3 font-medium text-red-600 transition-all duration-300 border border-red-200 bg-red-50 rounded-xl dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-400 hover:shadow-lg"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-8 px-4 mx-auto max-w-7xl lg:grid-cols-4">
        {/* LEFT SIDEBAR */}
        <aside className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky p-6 bg-white border border-gray-200 shadow-lg dark:bg-gray-800 rounded-2xl dark:border-gray-700 top-28"
          >
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-sm font-medium transition-all duration-300 ${isActive
                        ? `bg-gradient-to-r ${tab.color.replace('text', 'from')}/10 to-white dark:to-gray-800 border-l-4 ${tab.color.replace('text', 'border')} shadow-sm`
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                  >
                    <Icon size={20} className={isActive ? tab.color : "text-gray-500 dark:text-gray-400"} />
                    {tab.label}
                    {isActive && (
                      <div className="w-2 h-2 ml-auto rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                    )}
                  </button>
                );
              })}

              <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                <Link to="/my-orders" className="block w-full">
                  <button className="flex items-center w-full gap-4 px-5 py-4 text-sm font-medium transition-all duration-300 rounded-xl text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20">
                    <Package size={20} />
                    My Orders
                  </button>
                </Link>

                <button className="flex items-center w-full gap-4 px-5 py-4 mt-2 text-sm font-medium transition-all duration-300 rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                  <CreditCard size={20} />
                  Payment Methods
                </button>
              </div>
            </nav>
          </motion.div>
        </aside>

        {/* RIGHT CONTENT */}
        <main className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-white border border-gray-200 shadow-xl dark:bg-gray-800 rounded-2xl dark:border-gray-700"
          >
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <form onSubmit={updateProfile}>
                <div className="p-8 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col justify-between gap-4 mb-2 md:flex-row md:items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
                      <p className="mt-1 text-gray-600 dark:text-gray-400">Update your personal details</p>
                    </div>
                    <button
                      type="submit"
                      disabled={loading.profile}
                      className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg disabled:opacity-70"
                    >
                      {loading.profile ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-8 space-y-10">
                  {/* AVATAR SELECTION */}
                  <div>
                    <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Profile Picture</h3>
                    <div className="flex flex-wrap gap-6">
                      {avatarOptions.map((avatar) => (
                        <button
                          type="button"
                          key={avatar}
                          onClick={() => setProfileForm({ ...profileForm, avatar })}
                          className={`relative rounded-2xl transition-all duration-300 ${profileForm.avatar === avatar
                              ? "ring-3 ring-blue-500 ring-offset-2 scale-105"
                              : "hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-600 hover:scale-105"
                            }`}
                        >
                          <img
                            src={avatar}
                            alt="Avatar"
                            className="object-cover w-20 h-20 rounded-2xl"
                          />
                          {profileForm.avatar === avatar && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
                              <CheckCircle size={24} className="text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* PROFILE FIELDS */}
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div>
                      <label className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <User size={16} />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-5 py-4 text-gray-900 transition-all duration-300 bg-white border border-gray-300 outline-none rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Mail size={16} />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        disabled
                        className="w-full px-5 py-4 text-gray-600 border border-gray-300 cursor-not-allowed rounded-xl dark:border-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Phone size={16} />
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        value={profileForm.mobile}
                        onChange={(e) => setProfileForm({ ...profileForm, mobile: e.target.value })}
                        className="w-full px-5 py-4 text-gray-900 transition-all duration-300 bg-white border border-gray-300 outline-none rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* ADDRESS TAB */}
            {activeTab === "address" && (
              <form onSubmit={updateAddress}>
                <div className="p-8 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col justify-between gap-4 mb-2 md:flex-row md:items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Delivery Address</h2>
                      <p className="mt-1 text-gray-600 dark:text-gray-400">Update your shipping address</p>
                    </div>
                    <button
                      type="submit"
                      disabled={loading.address}
                      className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-all duration-300 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl hover:from-green-700 hover:to-emerald-700 hover:shadow-lg disabled:opacity-70"
                    >
                      {loading.address ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Save Address
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div>
                      <label className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <User size={16} />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={addressForm.fullName}
                        onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                        className="w-full px-5 py-4 text-gray-900 transition-all duration-300 bg-white border border-gray-300 outline-none rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-3 focus:ring-green-500/30 focus:border-green-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Phone size={16} />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        className="w-full px-5 py-4 text-gray-900 transition-all duration-300 bg-white border border-gray-300 outline-none rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-3 focus:ring-green-500/30 focus:border-green-500"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Home size={16} />
                        Street Address *
                      </label>
                      <input
                        type="text"
                        value={addressForm.street}
                        onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                        className="w-full px-5 py-4 text-gray-900 transition-all duration-300 bg-white border border-gray-300 outline-none rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-3 focus:ring-green-500/30 focus:border-green-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <MapPin size={16} />
                        City *
                      </label>
                      <input
                        type="text"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="w-full px-5 py-4 text-gray-900 transition-all duration-300 bg-white border border-gray-300 outline-none rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-3 focus:ring-green-500/30 focus:border-green-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Map size={16} />
                        State *
                      </label>
                      <input
                        type="text"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        className="w-full px-5 py-4 text-gray-900 transition-all duration-300 bg-white border border-gray-300 outline-none rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-3 focus:ring-green-500/30 focus:border-green-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Key size={16} />
                        Pincode *
                      </label>
                      <input
                        type="text"
                        value={addressForm.pincode}
                        onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                        className="w-full px-5 py-4 text-gray-900 transition-all duration-300 bg-white border border-gray-300 outline-none rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-3 focus:ring-green-500/30 focus:border-green-500"
                        required
                      />
                    </div>

                  </div>
                </div>
              </form>
            )}

            {/* PASSWORD TAB */}
            {activeTab === "password" && (
              <div>
                <div className="p-8 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-purple-100 rounded-xl dark:bg-purple-900/30">
                      <ShieldCheck size={24} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Account Security</h2>
                      <p className="mt-1 text-gray-600 dark:text-gray-400">Secure your account with a new password</p>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="max-w-2xl space-y-8">
                    <div>
                      <label className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Key size={16} />
                        Current Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          className="w-full px-5 py-4 pr-12 text-gray-900 transition-all duration-300 bg-white border border-gray-300 outline-none rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-3 focus:ring-purple-500/30 focus:border-purple-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute text-gray-500 transform -translate-y-1/2 right-4 top-1/2 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Lock size={16} />
                        New Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          className="w-full px-5 py-4 pr-12 text-gray-900 transition-all duration-300 bg-white border border-gray-300 outline-none rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-3 focus:ring-purple-500/30 focus:border-purple-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute text-gray-500 transform -translate-y-1/2 right-4 top-1/2 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Password must be at least 6 characters with letters and numbers
                      </p>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <ShieldCheck size={16} />
                        Confirm New Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          className="w-full px-5 py-4 pr-12 text-gray-900 transition-all duration-300 bg-white border border-gray-300 outline-none rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-3 focus:ring-purple-500/30 focus:border-purple-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute text-gray-500 transform -translate-y-1/2 right-4 top-1/2 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={updatePassword}
                        disabled={loading.password}
                        className="flex items-center gap-2 px-8 py-4 font-medium text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg disabled:opacity-70"
                      >
                        {loading.password ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                            Updating...
                          </>
                        ) : (
                          <>
                            <ShieldCheck size={18} />
                            Update Password
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPasswordForm({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                        }}
                        className="px-6 py-4 font-medium text-gray-700 transition-all duration-300 bg-gray-100 border border-gray-300 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;