import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser, FiMail, FiPhone, FiEdit2, FiSave,
  FiX, FiCamera, FiBell, FiShield, FiTrash2,
  FiLogOut, FiAlertCircle, FiLock,
  FiGlobe, FiTrendingUp
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import api from "../api/axios";
import { getSubscriptions } from "../api/subscriptionsApi";

// ── Validation ─────────────────────────────────────────────────
const profileSchema = yup.object({
  name:     yup.string().required("Name is required"),
  phone:    yup.string().nullable(),
  currency: yup.string().required(),
});

const passwordSchema = yup.object({
  currentPassword: yup.string().required("Current password required"),
  newPassword:     yup.string().min(6, "Min 6 characters").required("New password required"),
  confirmPassword: yup.string()
    .oneOf([yup.ref("newPassword")], "Passwords don't match")
    .required("Please confirm password"),
});

// ── Shared styles ──────────────────────────────────────────────
const cardStyle = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const getInputStyle = (hasError) => ({
  background: hasError ? "rgba(239,68,68,0.05)" : "rgba(255,255,255,0.05)",
  border: `1px solid ${hasError ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.1)"}`,
  color: "#e2e8f0",
  outline: "none",
});

// ── Avatar ─────────────────────────────────────────────────────
function Avatar({ name }) {
  const initials = name
    ? name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";
  return (
    <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white flex-shrink-0"
         style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6, #c084fc)", boxShadow: "0 10px 30px rgba(99,102,241,0.5)" }}>
      {initials}
    </div>
  );
}

// ── Form Field ─────────────────────────────────────────────────
function FormField({ label, icon: Icon, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#6b7280" }}>{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-base pointer-events-none" style={{ color: "#6366f1" }} />}
        {children}
      </div>
      {error && <p className="flex items-center gap-1.5 text-xs mt-1.5" style={{ color: "#f87171" }}><FiAlertCircle /> {error.message}</p>}
    </div>
  );
}

// ── Section Card ───────────────────────────────────────────────
function Section({ title, icon: Icon, children, delay = 0, accentColor = "#6366f1" }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="relative p-6 rounded-2xl overflow-hidden" style={cardStyle}>
      <div className="absolute top-0 left-6 right-6 h-px"
           style={{ background: `linear-gradient(90deg, transparent, ${accentColor}80, transparent)` }} />
      <h2 className="font-bold text-base mb-5 flex items-center gap-2" style={{ color: "#e2e8f0" }}>
        <Icon style={{ color: "#6b7280" }} /> {title}
      </h2>
      {children}
    </motion.div>
  );
}

// ── Toggle ─────────────────────────────────────────────────────
function Toggle({ value, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div>
        <p className="text-sm font-medium" style={{ color: "#e2e8f0" }}>{label}</p>
        {description && <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{description}</p>}
      </div>
      <motion.button onClick={() => onChange(!value)} whileTap={{ scale: 0.95 }}
        className="relative w-11 h-6 rounded-full transition duration-300 flex-shrink-0"
        style={{ background: value ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.1)" }}>
        <motion.div animate={{ x: value ? 20 : 2 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow" />
      </motion.button>
    </div>
  );
}

// ── Delete Modal ───────────────────────────────────────────────
function DeleteModal({ isOpen, onClose, onConfirm }) {
  const [input, setInput] = useState("");
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }} />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm p-7 rounded-3xl text-center"
                 style={{ background: "rgba(15,10,30,0.99)", border: "1px solid rgba(239,68,68,0.3)", boxShadow: "0 40px 100px rgba(0,0,0,0.8)" }}>
              <div className="text-5xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold mb-2 text-white">Delete Account?</h2>
              <p className="text-sm mb-5" style={{ color: "#9ca3af" }}>
                This will permanently delete your account. Type <span className="font-bold" style={{ color: "#f87171" }}>DELETE</span> to confirm.
              </p>
              <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type DELETE"
                className="w-full px-4 py-3 rounded-xl text-white text-center text-sm outline-none mb-4"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}>Cancel</button>
                <motion.button onClick={() => input === "DELETE" && onConfirm()} disabled={input !== "DELETE"} whileTap={{ scale: 0.97 }}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white"
                  style={{ background: input === "DELETE" ? "linear-gradient(135deg, #ef4444, #dc2626)" : "rgba(239,68,68,0.2)", cursor: input !== "DELETE" ? "not-allowed" : "pointer" }}>
                  Delete Forever
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Main Profile Page ──────────────────────────────────────────
export default function ProfilePage() {
  const { user, login, logout } = useAuth();
  const navigate                = useNavigate();
  const [editMode, setEditMode]           = useState(false);
  const [deleteModal, setDeleteModal]     = useState(false);
  const [subs, setSubs]                   = useState([]);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    emailAlerts:   user?.notifications?.emailAlerts   ?? true,
    pushAlerts:    user?.notifications?.pushAlerts    ?? false,
    weeklyReport:  user?.notifications?.weeklyReport  ?? true,
    threeDayAlert: user?.notifications?.threeDayAlert ?? true,
    sameDayAlert:  user?.notifications?.sameDayAlert  ?? true,
  });

  // Fetch real subscriptions for stats
  useEffect(() => {
    getSubscriptions().then(setSubs).catch(() => {});
  }, []);

  const { register: regProfile, handleSubmit: handleProfile,
          formState: { errors: profileErrors } } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name:     user?.name     || "",
      phone:    user?.phone    || "",
      currency: user?.currency || "INR",
    },
  });

  const { register: regPassword, handleSubmit: handlePassword,
          formState: { errors: passwordErrors }, reset: resetPassword } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  // ── Save Profile ───────────────────────────────────────────────
  const onSaveProfile = async (data) => {
    try {
      setSavingProfile(true);
      const res = await api.put("/auth/update-profile", data);
      login(res.data.user, localStorage.getItem("token"));
      toast.success("Profile updated! ✅");
      setEditMode(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  // ── Change Password ────────────────────────────────────────────
  const onChangePassword = async (data) => {
    try {
      setSavingPassword(true);
      await api.put("/auth/change-password", {
        currentPassword: data.currentPassword,
        newPassword:     data.newPassword,
      });
      toast.success("Password changed! 🔒");
      resetPassword();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  // ── Save Notifications ─────────────────────────────────────────
  const saveNotifications = async (updated) => {
    setNotifications(updated);
    try {
      await api.put("/auth/update-profile", { notifications: updated });
      toast.success("Notification preferences saved!");
    } catch {
      toast.error("Failed to save preferences");
    }
  };

  // ── Delete Account ─────────────────────────────────────────────
  const onDeleteAccount = async () => {
    try {
      await api.delete("/auth/delete-account");
    } catch {}
    logout();
    navigate("/login");
    toast.success("Account deleted");
  };

  // ── Computed Stats ─────────────────────────────────────────────
  const totalMonthly = subs.reduce((s, x) => s + x.cost, 0);
  const totalYearly  = totalMonthly * 12;
  const topCategory  = (() => {
    const map = {};
    subs.forEach(s => { map[s.category] = (map[s.category] || 0) + s.cost; });
    return Object.entries(map).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
  })();

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

  const inputCls = "w-full pl-11 pr-4 py-3 rounded-xl text-sm transition duration-200";
  const getIS = (err) => getInputStyle(!!err);

  return (
    <div className="min-h-screen bg-[#0f0a1e] p-6 relative">
      <div className="fixed inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.06) 0%, transparent 50%)",
      }} />

      <div className="relative z-10">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-bold"
              style={{ background: "linear-gradient(135deg, #fff 0%, #a5b4fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            My Profile
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#6b7280" }}>Manage your account and preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT COLUMN ── */}
          <div className="space-y-6">

            {/* Profile Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="relative p-6 rounded-2xl text-center overflow-hidden" style={cardStyle}>
              <div className="absolute top-0 left-6 right-6 h-px"
                   style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)" }} />
              <div className="relative inline-block mb-4">
                <Avatar name={user?.name} />
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full text-white flex items-center justify-center shadow-lg border-2"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderColor: "#0f0a1e" }}>
                  <FiCamera className="text-xs" />
                </motion.button>
              </div>
              <h2 className="text-white font-bold text-xl">{user?.name || "—"}</h2>
              <p className="text-sm mt-1" style={{ color: "#6b7280" }}>{user?.email || "—"}</p>
              <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-xs" style={{ color: "#6b7280" }}>Member since</p>
                <p className="text-sm font-semibold mt-0.5" style={{ color: "#a5b4fc" }}>{memberSince}</p>
              </div>
              <motion.button onClick={() => setEditMode(!editMode)}
                whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                className="w-full mt-5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition duration-200"
                style={editMode ? {
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af",
                } : {
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", boxShadow: "0 8px 20px rgba(99,102,241,0.35)",
                }}>
                {editMode ? <><FiX /> Cancel Edit</> : <><FiEdit2 /> Edit Profile</>}
              </motion.button>
            </motion.div>

            {/* Stats Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="relative p-6 rounded-2xl overflow-hidden" style={cardStyle}>
              <div className="absolute top-0 left-6 right-6 h-px"
                   style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent)" }} />
              <h2 className="font-bold text-base mb-4 flex items-center gap-2" style={{ color: "#e2e8f0" }}>
                <FiTrendingUp style={{ color: "#6b7280" }} /> Your Stats
              </h2>
              <div className="space-y-0">
                {[
                  { label: "Active Subscriptions", value: subs.length },
                  { label: "Monthly Spend",        value: `₹${totalMonthly.toLocaleString()}` },
                  { label: "Yearly Spend",         value: `₹${totalYearly.toLocaleString()}` },
                  { label: "Top Category",         value: topCategory },
                ].map((stat, i) => (
                  <div key={stat.label} className="flex items-center justify-between py-2.5"
                    style={{ borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                    <p className="text-sm" style={{ color: "#6b7280" }}>{stat.label}</p>
                    <p className="text-sm font-bold" style={{ color: "#a5b4fc" }}>{stat.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Personal Information */}
            <Section title="Personal Information" icon={FiUser} delay={0.1}>
              <form onSubmit={handleProfile(onSaveProfile)} noValidate className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Full Name" icon={FiUser} error={profileErrors.name}>
                    <input type="text" placeholder="Your name" {...regProfile("name")} disabled={!editMode}
                      className={inputCls} style={{ ...getIS(profileErrors.name), opacity: !editMode ? 0.6 : 1 }}
                      onFocus={e => editMode && (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
                      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                  </FormField>
                  <FormField label="Email Address" icon={FiMail}>
                    <input type="email" value={user?.email || ""} disabled
                      className={inputCls} style={{ ...getIS(false), opacity: 0.5, cursor: "not-allowed" }} />
                  </FormField>
                </div>
                <AnimatePresence>
                  {editMode && (
                    <motion.button type="submit" disabled={savingProfile}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-70"
                      style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 8px 25px rgba(99,102,241,0.4)" }}>
                      {savingProfile ? "Saving..." : <><FiSave /> Save Changes</>}
                    </motion.button>
                  )}
                </AnimatePresence>
              </form>
            </Section>

            {/* Change Password */}
            <Section title="Change Password" icon={FiLock} delay={0.2} accentColor="#8b5cf6">
              <form onSubmit={handlePassword(onChangePassword)} noValidate className="space-y-4">
                <FormField label="Current Password" icon={FiLock} error={passwordErrors.currentPassword}>
                  <input type="password" placeholder="••••••••" {...regPassword("currentPassword")}
                    className={inputCls} style={getIS(passwordErrors.currentPassword)}
                    onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                </FormField>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="New Password" icon={FiLock} error={passwordErrors.newPassword}>
                    <input type="password" placeholder="••••••••" {...regPassword("newPassword")}
                      className={inputCls} style={getIS(passwordErrors.newPassword)}
                      onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
                      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                  </FormField>
                  <FormField label="Confirm Password" icon={FiLock} error={passwordErrors.confirmPassword}>
                    <input type="password" placeholder="••••••••" {...regPassword("confirmPassword")}
                      className={inputCls} style={getIS(passwordErrors.confirmPassword)}
                      onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
                      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                  </FormField>
                </div>
                <motion.button type="submit" disabled={savingPassword}
                  whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold disabled:opacity-70"
                  style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", color: "#a5b4fc" }}>
                  {savingPassword ? "Updating..." : <><FiShield /> Update Password</>}
                </motion.button>
              </form>
            </Section>

            {/* Notification Preferences */}
            <Section title="Notification Preferences" icon={FiBell} delay={0.3} accentColor="#a78bfa">
              <Toggle value={notifications.emailAlerts}
                onChange={v => saveNotifications({ ...notifications, emailAlerts: v })}
                label="Email Alerts" description="Receive renewal reminders via email" />
              <Toggle value={notifications.pushAlerts}
                onChange={v => saveNotifications({ ...notifications, pushAlerts: v })}
                label="Push Notifications" description="Browser push notifications" />
              <Toggle value={notifications.weeklyReport}
                onChange={v => saveNotifications({ ...notifications, weeklyReport: v })}
                label="Weekly Spending Report" description="Get a weekly summary every Monday" />
              <Toggle value={notifications.threeDayAlert}
                onChange={v => saveNotifications({ ...notifications, threeDayAlert: v })}
                label="3-Day Advance Alert" description="Alert 3 days before renewal" />
              <Toggle value={notifications.sameDayAlert}
                onChange={v => saveNotifications({ ...notifications, sameDayAlert: v })}
                label="Same-Day Alert" description="Alert on the day of renewal" />
            </Section>

            {/* Danger Zone */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="relative p-6 rounded-2xl overflow-hidden"
              style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.2)", backdropFilter: "blur(20px)" }}>
              <div className="absolute top-0 left-6 right-6 h-px"
                   style={{ background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.5), transparent)" }} />
              <h2 className="font-bold text-base mb-4 flex items-center gap-2" style={{ color: "#f87171" }}>
                <FiAlertCircle /> Danger Zone
              </h2>
              <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid rgba(239,68,68,0.1)" }}>
                <div>
                  <p className="text-sm font-medium text-white">Sign Out</p>
                  <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>Sign out from your current session</p>
                </div>
                <motion.button onClick={() => { logout(); navigate("/login"); }}
                  whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; e.currentTarget.style.color = "#a5b4fc"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#9ca3af"; }}>
                  <FiLogOut /> Sign Out
                </motion.button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium" style={{ color: "#f87171" }}>Delete Account</p>
                  <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>Permanently delete all your data</p>
                </div>
                <motion.button onClick={() => setDeleteModal(true)}
                  whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition"
                  style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)"; }}>
                  <FiTrash2 /> Delete Account
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <DeleteModal isOpen={deleteModal} onClose={() => setDeleteModal(false)} onConfirm={onDeleteAccount} />
    </div>
  );
}