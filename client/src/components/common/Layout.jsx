import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  FiHome, FiList, FiBell, FiUser,
  FiLogOut, FiMenu, FiX, FiAward
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.jpeg";
import Footer from "../Footer";

// ── Sidebar Content ────────────────────────────────────────────
function SidebarContent({ navItems, setSidebarOpen, logout, navigate }) {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0"
               style={{
                 background: "linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.4))",
                 border: "1px solid rgba(99,102,241,0.3)",
               }}>
            <img src={logo} alt="Logo" className="w-full h-full object-contain p-1" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">SubTrack</p>
            <p className="text-xs" style={{ color: "#6b7280" }}>Subscription Manager</p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.button
              key={item.id}
              onClick={() => { navigate(item.path); setSidebarOpen(false); }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                         text-sm font-medium transition duration-200 relative"
              style={isActive ? {
                background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15))",
                border: "1px solid rgba(99,102,241,0.3)",
                color: "#a5b4fc",
              } : {
                color: "#6b7280",
                border: "1px solid transparent",
              }}
            >
              <item.icon className="text-lg flex-shrink-0" />
              {item.label}
              {item.badge > 0 && (
                <span className="ml-auto w-5 h-5 rounded-full text-white text-xs
                                 flex items-center justify-center font-bold"
                      style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}>
                  {item.badge}
                </span>
              )}
              {isActive && (
                <motion.div layoutId="sidebarActive"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                  style={{ background: "linear-gradient(180deg, #6366f1, #8b5cf6)" }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Logout */}
      <motion.button
        onClick={() => { logout(); navigate("/login"); }}
        whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                   text-sm font-medium transition duration-200"
        style={{ color: "#6b7280", border: "1px solid transparent" }}
        onMouseEnter={e => {
          e.currentTarget.style.color = "#f87171";
          e.currentTarget.style.background = "rgba(239,68,68,0.08)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = "#6b7280";
          e.currentTarget.style.background = "transparent";
        }}
      >
        <FiLogOut className="text-lg" /> Logout
      </motion.button>
    </div>
  );
}

// ── Main Layout ────────────────────────────────────────────────
export default function Layout({ urgentAlerts = 0 }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout }              = useAuth();
  const navigate                      = useNavigate();
  const location                      = useLocation();

  // ✅ Rewards added correctly here in the array
  const navItems = [
    { id: "dashboard",     icon: FiHome,  label: "Dashboard",     path: "/dashboard" },
    { id: "subscriptions", icon: FiList,  label: "Subscriptions", path: "/subscriptions" },
    { id: "alerts",        icon: FiBell,  label: "Alerts",        path: "/alerts", badge: urgentAlerts },
    { id: "rewards",       icon: FiAward, label: "Rewards",       path: "/rewards" },
    { id: "profile",       icon: FiUser,  label: "Profile",       path: "/profile" },
  ];

  const pageTitle = navItems.find(n => n.path === location.pathname)?.label || "SubTrack";

  const sidebarStyle = {
    background: "rgba(15,10,30,0.95)",
    backdropFilter: "blur(30px)",
    borderRight: "1px solid rgba(99,102,241,0.15)",
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-[#0f0a1e]">

      {/* BG gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 0% 0%, rgba(99,102,241,0.1) 0%, transparent 50%), radial-gradient(ellipse at 100% 100%, rgba(139,92,246,0.08) 0%, transparent 50%)",
      }} />

      {/* ── Sidebar ── */}
      <>
        {/* Mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-20 lg:hidden"
              style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            />
          )}
        </AnimatePresence>

        {/* Mobile sidebar */}
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: sidebarOpen ? 0 : -280 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 h-full w-64 z-30 flex flex-col py-6 px-4 lg:hidden"
          style={sidebarStyle}
        >
          <button onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-xl"
            style={{ background: "rgba(255,255,255,0.05)", color: "#6b7280" }}>
            <FiX />
          </button>
          <SidebarContent
            navItems={navItems}
            setSidebarOpen={setSidebarOpen}
            logout={logout}
            navigate={navigate}
          />
        </motion.aside>

        {/* Desktop sidebar */}
        <aside
          className="hidden lg:flex w-64 flex-shrink-0 flex-col py-6 px-4 min-h-screen relative z-10"
          style={sidebarStyle}
        >
          <SidebarContent
            navItems={navItems}
            setSidebarOpen={setSidebarOpen}
            logout={logout}
            navigate={navigate}
          />
        </aside>
      </>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-h-screen relative z-10 overflow-auto">

        {/* Mobile top bar */}
        <header
          className="flex items-center justify-between px-6 py-4 lg:hidden"
          style={{ borderBottom: "1px solid rgba(99,102,241,0.1)" }}
        >
          <button onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl"
            style={{ background: "rgba(255,255,255,0.05)", color: "#a5b4fc" }}>
            <FiMenu />
          </button>
          <p className="text-white font-semibold">{pageTitle}</p>
          <div className="w-8" />
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />

      </div>
    </div>
  );
}