import {
  PlusCircle,
  ShoppingBasket,
  ClipboardList,
  Menu,
  X,
  Package,
  Users,
  MessageSquare,
  LogOut,
  LayoutDashboard,
  Home,
  ChevronDown,
  Zap,
  Tag
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

import AnalyticsTab from "../components/AnalyticsTab";
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import AdminOrdersTab from "../components/AdminOrdersTab";
import CustomersTab from "../components/CustomersTab";
import EnquiriesTab from "../components/EnquiriesTab";
import AdminHomeTab from "../components/AdminHomeTab";
import { useProductStore } from "../stores/useProductStore";
import { useUserStore } from "../stores/useUserStore";
import toast from "react-hot-toast";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [productToEdit, setProductToEdit] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { fetchAllProducts } = useProductStore();
  const { user, logout } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId !== "create") {
      setProductToEdit(null);
    }
    setMobileMenuOpen(false);
  };

  const handleEdit = (product) => {
    setProductToEdit(product);
    setActiveTab("create");
  };

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "analytics", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products Management", icon: ShoppingBasket },
    { id: "customers", label: "User Manager", icon: Users },
    { id: "orders", label: "Order Manager", icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans">
      {/* 1. Topmost Breadcrumb & Meta Bar */}
      <div className="bg-white border-b border-gray-100 py-3 px-8 flex items-center justify-between text-[11px] font-black text-gray-400 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <Home size={12} className="text-gray-300" />
          <span className="hover:text-emerald-500 cursor-pointer transition-colors">Home</span>
          <span className="text-gray-200 font-normal mx-1">{">"}</span>
          <span className="text-gray-800">
            {navItems.find(n => n.id === activeTab)?.label ||
              (activeTab === 'create' ? 'Products Management / Create' :
                activeTab === 'enquiries' ? 'Live Support' : activeTab)}
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
            English <ChevronDown size={14} className="text-gray-400" />
          </button>
          <div className="flex items-center gap-3 py-1.5 px-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 overflow-hidden border border-emerald-200">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <Users size={12} />
              )}
            </div>
            <span className="text-gray-900 border-l border-gray-200 pl-3">{user?.name || "Admin Portal"}</span>
          </div>
        </div>
      </div>

      {/* 2. Brand & Main Navigation Header (Matching Image layout) */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-8 h-24 flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-14 h-14 bg-[#facd15] rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-[#001529] text-2xl font-black tracking-tighter uppercase leading-none">Sree Saravana</span>
              <span className="text-[#001529] text-[11px] font-bold uppercase tracking-[0.25em] mt-1.5 opacity-80">Electricals</span>
            </div>
          </Link>

          {/* Navigation Links (Centered) */}
          <nav className="hidden lg:flex items-center bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`
                  flex items-center gap-2.5 px-6 py-3.5 text-[13px] font-black rounded-xl tracking-tight transition-all uppercase
                  ${activeTab === item.id || (item.id === 'products' && activeTab === 'create')
                    ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/30"
                    : "text-gray-500 hover:text-emerald-500 hover:bg-white"
                  }
                `}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleTabChange('enquiries')}
              className={`p-3.5 rounded-2xl transition-all ${activeTab === 'enquiries' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-400 hover:bg-emerald-50 hover:text-emerald-500'}`}
            >
              <MessageSquare size={24} />
            </button>
            <button onClick={handleLogout} className="p-3.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
              <LogOut size={24} />
            </button>

            {/* Mobile Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-3.5 text-gray-600 hover:bg-gray-100 rounded-2xl"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-2xl z-50 p-6 flex flex-col gap-3"
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`
                    flex items-center gap-4 px-6 py-4 font-black rounded-2xl uppercase text-[11px] tracking-widest transition-all
                    ${activeTab === item.id ? "bg-emerald-500 text-white" : "text-gray-600 hover:bg-emerald-50"}
                  `}
                >
                  <item.icon size={20} />
                  {item.label}
                </button>
              ))}
              <button onClick={handleLogout} className="flex items-center gap-4 px-6 py-4 text-red-500 font-black rounded-2xl uppercase text-[11px] tracking-widest">
                <LogOut size={20} /> Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 3. Main Content Container */}
      <main className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "home" && <AdminHomeTab />}

            <div className={`max-w-[1700px] mx-auto ${activeTab === 'home' ? 'pt-0' : 'pt-10 px-10'}`}>
              {activeTab === "analytics" && (
                <div className="bg-white rounded-[4rem] p-12 border border-gray-100 shadow-2xl shadow-emerald-500/5">
                  <AnalyticsTab />
                </div>
              )}

              {activeTab === "create" && (
                <div className="bg-white rounded-[4rem] p-16 border border-gray-100 shadow-2xl shadow-emerald-500/5">
                  <div className="flex items-center justify-between mb-12 border-b border-gray-50 pb-10">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter">
                      {productToEdit ? "Revise Asset" : "Register New Asset"}
                    </h2>
                    <button onClick={() => setActiveTab('products')} className="px-8 py-3 bg-gray-50 text-[10px] font-black text-gray-400 hover:text-emerald-500 rounded-full uppercase tracking-[0.2em]">Close View</button>
                  </div>
                  <CreateProductForm
                    productToEdit={productToEdit}
                    onCancel={() => {
                      setProductToEdit(null);
                      setActiveTab("products");
                    }}
                  />
                </div>
              )}

              {activeTab === "products" && (
                <div className="bg-white rounded-[4rem] p-16 border border-gray-100 shadow-2xl shadow-emerald-500/5">
                  <div className="flex items-center justify-between mb-12">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Active Stock Database</h2>
                    <button onClick={() => setActiveTab('create')} className="bg-emerald-500 text-white px-10 py-5 rounded-3xl font-black uppercase text-[11px] tracking-[0.15em] shadow-2xl shadow-emerald-500/40 hover:scale-105 transition-all flex items-center gap-3">
                      <PlusCircle size={20} /> Add New Entry
                    </button>
                  </div>
                  <ProductsList onEdit={handleEdit} />
                </div>
              )}

              {activeTab === "orders" && (
                <div className="bg-white rounded-[4rem] p-16 border border-gray-100 shadow-2xl shadow-emerald-500/5">
                  <h2 className="text-4xl font-black text-gray-900 mb-12 tracking-tighter">Order Processing Hub</h2>
                  <AdminOrdersTab />
                </div>
              )}

              {activeTab === "customers" && (
                <div className="bg-white rounded-[4rem] p-16 border border-gray-100 shadow-2xl shadow-emerald-500/5">
                  <h2 className="text-4xl font-black text-gray-900 mb-12 tracking-tighter">User Directory</h2>
                  <CustomersTab />
                </div>
              )}

              {activeTab === "enquiries" && (
                <div className="bg-white rounded-[4rem] p-16 border border-gray-100 shadow-2xl shadow-emerald-500/5">
                  <h2 className="text-4xl font-black text-gray-900 mb-12 tracking-tighter">Live Support Feed</h2>
                  <EnquiriesTab />
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AdminPage;