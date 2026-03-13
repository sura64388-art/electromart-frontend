import { useEffect, useState, useCallback } from "react";
import axios from "../lib/axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import {
  Users,
  ShoppingBag,
  IndianRupee,
  TrendingUp,
  Clock,
  RefreshCcw,
  ChevronDown,
  CheckCircle2,
  Truck,
  XCircle,
  Package,
  Zap,
  AlertCircle,
  Trophy,
  ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";

const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState({
    totalUsers: 6,
    totalOrders: 35,
    totalRevenue: 24561,
    avgOrderValue: 701,
    statuses: {
      pending: 2,
      processing: 5,
      shipped: 8,
      delivered: 18,
      cancelled: 2,
      cancelled: 2,
    },
    topSellingProducts: [],
    lowStockProducts: [],
  });

  const [dailyRevenue, setDailyRevenue] = useState([
    { name: "1/2/2026", revenue: 5400 },
    { name: "15/2/2026", revenue: 8700 },
    { name: "3/1/2026", revenue: 10461 },
  ]);

  const [categorySales, setCategorySales] = useState([
    { name: "Switches and Sockets", value: 12, color: "#10b981" },
    { name: "Wires and Cables", value: 8, color: "#1890ff" },
    { name: "Lighting and Fans", value: 10, color: "#f59e0b" },
    { name: "Water Heaters", value: 5, color: "#ef4444" },
  ]);

  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalyticsData = useCallback(async () => {
    try {
      const res = await axios.get(`/analytics?range=year`);
      if (res.data.analyticsData) {
        setAnalyticsData(prev => ({
          ...prev,
          totalUsers: res.data.analyticsData.users || prev.totalUsers,
          totalRevenue: res.data.analyticsData.totalRevenue || prev.totalRevenue,
          totalOrders: res.data.analyticsData.totalSales || prev.totalOrders,
          avgOrderValue: res.data.analyticsData.totalSales > 0 ? (res.data.analyticsData.totalRevenue / res.data.analyticsData.totalSales).toFixed(0) : prev.avgOrderValue,
          statuses: res.data.analyticsData.statuses || prev.statuses,
          topSellingProducts: res.data.analyticsData.topSellingProducts || [],
          lowStockProducts: res.data.analyticsData.lowStockProducts || [],
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const stats = [
    { label: "Total Users", value: analyticsData.totalUsers, icon: Users, color: "bg-gradient-to-br from-blue-500 to-blue-600", shadow: "shadow-blue-500/20" },
    { label: "Total Orders", value: analyticsData.totalOrders, icon: ShoppingBag, color: "bg-gradient-to-br from-purple-500 to-purple-600", shadow: "shadow-purple-500/20", extra: "8 All Time" },
    { label: "Total Revenue", value: `₹${analyticsData.totalRevenue.toLocaleString()}`, icon: IndianRupee, color: "bg-gradient-to-br from-emerald-500 to-emerald-600", shadow: "shadow-emerald-500/20", trend: "0.0%" },
    { label: "Avg Order Value", value: `₹${analyticsData.avgOrderValue}`, icon: TrendingUp, color: "bg-gradient-to-br from-orange-500 to-orange-600", shadow: "shadow-orange-500/20" },
  ];

  const statusCards = [
    { label: "Pending", value: analyticsData.statuses.pending, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Processing", value: analyticsData.statuses.processing, icon: Zap, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Shipped", value: analyticsData.statuses.shipped, icon: Truck, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Delivered", value: analyticsData.statuses.delivered, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Cancelled", value: analyticsData.statuses.cancelled, icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
  ];

  if (isLoading) {
    return <div className="p-10 text-center text-gray-400">Loading metrics...</div>;
  }

  return (
    <div className="space-y-8 min-h-screen pb-10">
      {/* Header section with Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            Admin Dashboard 📊
          </h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Real-time analytics and insights</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-black text-gray-500 uppercase tracking-widest shadow-sm hover:bg-gray-50 transition-all">
            <Clock size={14} /> All Time <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-black text-gray-500 uppercase tracking-widest shadow-sm hover:bg-gray-50 transition-all">
            <Package size={14} /> All Status <ChevronDown size={14} />
          </button>
          <button onClick={fetchAnalyticsData} className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-emerald-500 transition-all shadow-sm">
            <RefreshCcw size={16} />
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`${item.color} ${item.shadow} p-6 rounded-[2rem] text-white relative overflow-hidden group hover:scale-[1.02] transition-all`}
          >
            <div className="flex flex-col gap-1">
              <item.icon size={24} className="opacity-80 mb-2" />
              <p className="text-[11px] font-black uppercase tracking-widest opacity-80">{item.label}</p>
              <h3 className="text-3xl font-black">{item.value}</h3>
            </div>

            {item.extra && (
              <p className="absolute bottom-6 right-6 text-[10px] font-black opacity-60 uppercase">{item.extra}</p>
            )}
            {item.trend && (
              <div className="absolute top-6 right-6 flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full text-[10px] font-bold">
                <ChevronDown size={10} className="rotate-180" /> {item.trend}
              </div>
            )}

            {/* Decoration */}
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
          </motion.div>
        ))}
      </div>

      {/* Status Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statusCards.map((status, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + (idx * 0.05) }}
            className="flex items-center gap-4 p-5 bg-white border border-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-all group cursor-pointer"
          >
            <div className={`p-3 rounded-xl ${status.bg} ${status.color} group-hover:scale-110 transition-transform`}>
              <status.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{status.label}</p>
              <h4 className="text-xl font-black text-gray-800">{status.value}</h4>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Area Chart Container */}
        <div className="xl:col-span-3 bg-white p-8 rounded-[3rem] border border-gray-50 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp size={22} className="text-emerald-500" />
            <h3 className="text-xl font-black text-gray-800 tracking-tight">Revenue Per Day</h3>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyRevenue}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f2f2f2" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '1rem' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#10b981' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart Container */}
        <div className="xl:col-span-2 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col items-center">
          <div className="w-full flex items-center gap-3 mb-8">
            <Package size={22} className="text-blue-500" />
            <h3 className="text-xl font-black text-gray-800 tracking-tight">Category-wise Sales</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySales}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {categorySales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-[12px] font-black text-gray-500 ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-col items-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Sales Distributed</p>
            <h4 className="text-2xl font-black text-gray-800">{analyticsData.totalOrders} Units</h4>
          </div>
        </div>
      </div>

    </div >
  );
};

export default AnalyticsTab;