import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome, FiList, FiBell, FiUser, FiLogOut,
  FiTrendingUp, FiAlertCircle, FiMenu,
  FiDollarSign, FiCreditCard, FiPlus
} from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import logo from "../assets/logo.jpeg";
import { getSubscriptions } from "../api/subscriptionsApi";

const PIE_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c084fc", "#e879f9", "#06b6d4"];

const getDaysLeft = (dateStr) =>
  Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));

const getAlertStyle = (days) => {
  if (days <= 0)  return { color: "text-gray-400",   bg: "bg-gray-500/10",    border: "border-gray-500/20",   label: "Expired",       dot: "bg-gray-400" };
  if (days <= 3)  return { color: "text-red-400",    bg: "bg-red-500/10",     border: "border-red-500/20",    label: `${days}d left`, dot: "bg-red-400" };
  if (days <= 7)  return { color: "text-orange-400", bg: "bg-orange-500/10",  border: "border-orange-500/20", label: `${days}d left`, dot: "bg-orange-400" };
  if (days <= 14) return { color: "text-yellow-400", bg: "bg-yellow-500/10",  border: "border-yellow-500/20", label: `${days}d left`, dot: "bg-yellow-400" };
  return               { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20",label: `${days}d left`, dot: "bg-emerald-400" };
};

const BRAND_LOGOS = {
  "netflix":      "https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png",
  "spotify":      "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg",
  "amazon prime": "https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.svg",
  "hotstar":      "https://upload.wikimedia.org/wikipedia/commons/1/1e/Disney%2B_Hotstar_logo.svg",
  "github":       "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
  "youtube":      "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg",
};
const getLogoForName = (name) => BRAND_LOGOS[name?.toLowerCase().trim()] || null;

// ── Stat Card ──
function StatCard({ icon: Icon, label, value, sub, gradient, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }} whileHover={{ y: -5, scale: 1.02 }}
      className="relative p-6 rounded-2xl overflow-hidden cursor-default"
      style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 blur-xl"
           style={{ background: gradient }} />
      <div className="relative z-10">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
             style={{ background: `${gradient}25`, border: `1px solid ${gradient}40` }}>
          <Icon className="text-lg" style={{ color: gradient }} />
        </div>
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">{label}</p>
        <p className="text-white text-2xl font-bold mb-1">{value}</p>
        <p className="text-gray-500 text-xs">{sub}</p>
      </div>
    </motion.div>
  );
}

// ── Brand Icon ──
function SubIcon({ sub }) {
  const [imgError, setImgError] = useState(false);
  const logo = sub.logo || getLogoForName(sub.name);
  return (
    <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
         style={{ background: logo && !imgError ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.08)", padding: logo && !imgError ? "4px" : "0" }}>
      {logo && !imgError
        ? <img src={logo} alt={sub.name} className="w-full h-full object-contain" onError={() => setImgError(true)} />
        : <span className="text-base">{sub.icon || "📦"}</span>
      }
    </div>
  );
}

// ── Alert Row ──
function AlertRow({ sub, index }) {
  const days  = getDaysLeft(sub.renewalDate);
  const style = getAlertStyle(days);
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.08 * index }}
      className={`flex items-center justify-between p-3 rounded-xl border ${style.border} ${style.bg} mb-2`}>
      <div className="flex items-center gap-3">
        <SubIcon sub={sub} />
        <div>
          <p className="text-white text-sm font-semibold">{sub.name}</p>
          <p className="text-gray-500 text-xs">{sub.renewalDate?.split("T")[0]}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-white text-sm font-bold">₹{sub.cost}</p>
        <p className={`text-xs font-semibold ${style.color}`}>{style.label}</p>
      </div>
    </motion.div>
  );
}

// ── Loading Skeleton ──
function Skeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-white/5" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-64 rounded-2xl bg-white/5" />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [subs, setSubs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const { user, logout }          = useAuth();
  const navigate                  = useNavigate();

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const data = await getSubscriptions();
        setSubs(data);
      } catch (err) {
        console.error("Failed to fetch subs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubs();
  }, []);

  const handleLogout = () => { logout(); navigate("/login"); };

  const totalMonthly = subs.reduce((s, x) => s + x.cost, 0);
  const totalYearly  = totalMonthly * 12;
  const urgentAlerts = subs.filter(s => {
    const d = getDaysLeft(s.renewalDate);
    return d <= 7 && d > 0 && !s.isPaid;
  }).length;

  const categoryMap = {};
  subs.forEach(s => {
    categoryMap[s.category] = (categoryMap[s.category] || 0) + s.cost;
  });
  const pieData  = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  const barData  = subs.map(s => ({ name: s.name, cost: s.cost }));
  const upcoming = [...subs].sort((a, b) => getDaysLeft(a.renewalDate) - getDaysLeft(b.renewalDate));
  const urgentSubs = upcoming.filter(s => {
    const d = getDaysLeft(s.renewalDate);
    return d <= 7 && d > 0 && !s.isPaid;
  });

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  const cardStyle = {
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.08)",
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-[#0f0a1e]">
      {/* Background Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 0% 0%, rgba(99,102,241,0.12) 0%, transparent 50%), radial-gradient(ellipse at 100% 100%, rgba(139,92,246,0.1) 0%, transparent 50%)",
      }} />

      <div className="flex-1 overflow-auto relative z-10">
        {/* ── Top Bar (FIXED) ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-30 px-6 py-5 flex items-center justify-between"
          style={{ background: "rgba(15,10,30,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(99,102,241,0.1)" }}>
          
          <div>
            <h1 className="text-xl lg:text-2xl font-bold"
                style={{ background: "linear-gradient(135deg, #fff 0%, #a5b4fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {getGreeting()}, {user?.name?.split(" ")[0] || "User"} 👋
            </h1>
            <p className="text-gray-500 text-xs mt-0.5 hidden sm:block">Track and optimize your subscriptions</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <motion.button onClick={() => setNotifOpen(p => !p)} whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-xl transition hover:bg-white/5"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <FiBell className="text-gray-300 text-xl" />
              </motion.button>
              {urgentAlerts > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-[10px] flex items-center justify-center font-bold border-2 border-[#0f0a1e]"
                      style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}>
                  {urgentAlerts}
                </span>
              )}

              <AnimatePresence>
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                    <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-3 w-80 z-20 rounded-2xl overflow-hidden shadow-2xl"
                      style={{ background: "rgba(15,10,30,0.98)", border: "1px solid rgba(99,102,241,0.2)", backdropFilter: "blur(40px)" }}>
                      <div className="p-4 border-b border-white/10 flex justify-between items-center">
                        <span className="text-white font-bold text-sm">Notifications</span>
                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">{urgentAlerts} Urgent</span>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {urgentSubs.length > 0 ? urgentSubs.map((sub) => (
                          <div key={sub._id} className="p-3 border-b border-white/5 flex items-center gap-3">
                            <SubIcon sub={sub} />
                            <div className="flex-1">
                              <p className="text-white text-xs font-semibold">{sub.name}</p>
                              <p className="text-gray-500 text-[10px]">Due in {getDaysLeft(sub.renewalDate)} days</p>
                            </div>
                          </div>
                        )) : (
                          <div className="p-8 text-center text-gray-500 text-xs">No pending alerts</div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Logout Button */}
            <motion.button onClick={handleLogout} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition group"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#9ca3af" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.borderColor = "#ef444440"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#9ca3af"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
              <FiLogOut className="group-hover:rotate-12 transition-transform" /> 
              <span className="hidden md:inline">Sign Out</span>
            </motion.button>
          </div>
        </motion.div>

        {/* ── Content Area ── */}
        {loading ? <Skeleton /> : (
          <div className="p-6 space-y-6">
            {urgentAlerts > 0 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-4 rounded-2xl border border-red-500/20 bg-red-500/5 cursor-pointer"
                onClick={() => navigate("/alerts")}>
                <FiAlertCircle className="text-red-400" />
                <p className="text-red-300 text-sm font-medium">You have {urgentAlerts} renewals this week! View details →</p>
              </motion.div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={FiDollarSign}  label="Monthly Spend" value={`₹${totalMonthly.toLocaleString()}`} sub="Current month" gradient="#6366f1" delay={0.1} />
              <StatCard icon={FiTrendingUp}  label="Yearly Spend"  value={`₹${totalYearly.toLocaleString()}`}  sub="Projected annual" gradient="#8b5cf6" delay={0.2} />
              <StatCard icon={FiCreditCard}  label="Active Subs"   value={subs.length}                      sub="Total linked"   gradient="#a78bfa" delay={0.3} />
              <StatCard icon={FiAlertCircle} label="Pending"      value={urgentAlerts}                     sub="Due soon"       gradient="#ef4444" delay={0.4} />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl" style={cardStyle}>
                <h3 className="text-white text-sm font-bold mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-indigo-500 rounded-full" /> Expenditure by Category
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1a142e', border: 'none', borderRadius: '8px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="p-6 rounded-2xl" style={cardStyle}>
                <h3 className="text-white text-sm font-bold mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-purple-500 rounded-full" /> Cost Distribution
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={barData}>
                    <XAxis dataKey="name" hide />
                    <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
                      {barData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Bar>
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ background: '#1a142e', border: 'none', borderRadius: '8px' }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Upcoming Renewals Table */}
            <div className="p-6 rounded-2xl" style={cardStyle}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white text-sm font-bold">Upcoming Renewals</h3>
                <Link to="/subscriptions" className="text-indigo-400 text-xs font-semibold hover:underline">Manage All</Link>
              </div>
              <div className="space-y-2">
                {upcoming.slice(0, 5).map((sub, i) => (
                  <AlertRow key={sub._id} sub={sub} index={i} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}