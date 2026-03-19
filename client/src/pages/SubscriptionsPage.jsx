import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus, FiSearch, FiEdit2, FiTrash2, FiX,
  FiAlertCircle, FiGrid, FiList,
  FiCalendar, FiDollarSign, FiTag, FiMail,
  FiCheck, FiInbox
} from "react-icons/fi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import {
  getSubscriptions,
  addSubscription,
  updateSubscription,
  deleteSubscription,
} from "../api/subscriptionsApi";

// ── Brand Logos ────────────────────────────────────────────────
const BRAND_LOGOS = {
  "netflix":         "https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png",
  "spotify":         "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg",
  "amazon prime":    "https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.svg",
  "hotstar":         "https://upload.wikimedia.org/wikipedia/commons/1/1e/Disney%2B_Hotstar_logo.svg",
  "github":          "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
  "youtube":         "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg",
  "youtube premium": "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg",
  "instagram":       "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",
  "notion":          "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
  "figma":           "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
  "canva":           "https://upload.wikimedia.org/wikipedia/commons/b/bb/Canva_Logo.svg",
  "chatgpt":         "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
  "adobe":           "https://upload.wikimedia.org/wikipedia/commons/8/8e/Adobe_Corporate_Logo.png",
  "microsoft":       "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  "google one":      "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
  "dropbox":         "https://upload.wikimedia.org/wikipedia/commons/7/74/Dropbox_Icon.svg",
  "linkedin":        "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",
  "zoom":            "https://upload.wikimedia.org/wikipedia/commons/7/7b/Zoom_Communications_Logo.svg",
  "slack":           "https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg",
  "apple":           "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  "disney+":         "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg",
};

const getLogoForName = (name) => BRAND_LOGOS[name?.toLowerCase().trim()] || null;

const GMAIL_DETECTED = [
  { id: "g1", name: "Netflix",          cost: 649, category: "Entertainment", renewalDate: "2026-04-01", notes: "Auto-detected from Gmail", logo: getLogoForName("netflix"),         icon: "🎬", email: "noreply@netflix.com",               subject: "Your Netflix membership renewal",         detectedAt: "2 days ago" },
  { id: "g2", name: "Spotify",          cost: 119, category: "Entertainment", renewalDate: "2026-03-28", notes: "Auto-detected from Gmail", logo: getLogoForName("spotify"),         icon: "🎵", email: "no-reply@spotify.com",              subject: "Your Spotify Premium receipt",            detectedAt: "5 days ago" },
  { id: "g3", name: "Amazon Prime",     cost: 299, category: "Shopping",      renewalDate: "2026-04-10", notes: "Auto-detected from Gmail", logo: getLogoForName("amazon prime"),    icon: "📦", email: "noreply@amazon.in",                 subject: "Amazon Prime membership renewed",         detectedAt: "1 week ago" },
  { id: "g4", name: "YouTube Premium",  cost: 189, category: "Entertainment", renewalDate: "2026-04-05", notes: "Auto-detected from Gmail", logo: getLogoForName("youtube premium"), icon: "▶️", email: "noreply@youtube.com",               subject: "YouTube Premium — payment confirmed",    detectedAt: "3 days ago" },
  { id: "g5", name: "Microsoft",        cost: 499, category: "Tech",           renewalDate: "2026-04-15", notes: "Auto-detected from Gmail", logo: getLogoForName("microsoft"),        icon: "💻", email: "microsoft-noreply@microsoft.com",  subject: "Microsoft 365 subscription renewed",    detectedAt: "2 weeks ago" },
  { id: "g6", name: "Canva",            cost: 399, category: "Tech",           renewalDate: "2026-04-20", notes: "Auto-detected from Gmail", logo: getLogoForName("canva"),            icon: "🎨", email: "noreply@canva.com",                 subject: "Canva Pro — your subscription is active", detectedAt: "4 days ago" },
];

const SCAN_STEPS = [
  "Connecting to Gmail...",
  "Authenticating securely...",
  "Scanning inbox for receipts...",
  "Detecting subscription emails...",
  "Extracting billing details...",
  "Analysing renewal dates...",
  "Done! Found subscriptions ✅",
];

const CATEGORIES = [
  { value: "Entertainment", icon: "🎬" },
  { value: "Health",        icon: "💪" },
  { value: "Tech",          icon: "💻" },
  { value: "Shopping",      icon: "🛒" },
  { value: "Education",     icon: "📚" },
  { value: "Utility",       icon: "⚡" },
  { value: "Finance",       icon: "💰" },
  { value: "Other",         icon: "📦" },
];
const CATEGORY_ICONS = Object.fromEntries(CATEGORIES.map(c => [c.value, c.icon]));

const schema = yup.object({
  name:        yup.string().required("Service name is required"),
  cost:        yup.number().positive("Must be positive").required("Cost is required"),
  renewalDate: yup.string().required("Renewal date is required"),
  category:    yup.string().required("Category is required"),
  notes:       yup.string(),
});

const getDaysLeft = (dateStr) => {
  const today = new Date();
  return Math.ceil((new Date(dateStr) - today) / (1000 * 60 * 60 * 24));
};

const getAlertStyle = (days) => {
  if (days <= 0)  return { color: "#9ca3af", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.2)", dot: "#9ca3af", label: "Expired" };
  if (days <= 3)  return { color: "#f87171", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.2)",   dot: "#f87171", label: `${days}d left` };
  if (days <= 7)  return { color: "#fb923c", bg: "rgba(249,115,22,0.1)",  border: "rgba(249,115,22,0.2)",  dot: "#fb923c", label: `${days}d left` };
  if (days <= 14) return { color: "#facc15", bg: "rgba(234,179,8,0.1)",   border: "rgba(234,179,8,0.2)",   dot: "#facc15", label: `${days}d left` };
  return               { color: "#34d399", bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.2)",  dot: "#34d399", label: `${days}d left` };
};

const cardStyle = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const inputStyle = (hasError) => ({
  background: hasError ? "rgba(239,68,68,0.05)" : "rgba(255,255,255,0.05)",
  border: `1px solid ${hasError ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}`,
  color: "#fff", outline: "none",
});

// ── Brand Icon ─────────────────────────────────────────────────
function BrandIcon({ sub, size = 10 }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div className={`w-${size} h-${size} rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0`}
         style={{ background: "rgba(255,255,255,0.9)", padding: "6px" }}>
      {sub.logo && !imgError
        ? <img src={sub.logo} alt={sub.name} className="w-full h-full object-contain" onError={() => setImgError(true)} />
        : <span className="text-xl">{sub.icon || CATEGORY_ICONS[sub.category] || "📦"}</span>
      }
    </div>
  );
}

// ── Gmail Scan Modal ───────────────────────────────────────────
function GmailScanModal({ isOpen, onClose, onImport, existingSubs }) {
  const [step, setStep]               = useState("connect");
  const [scanStep, setScanStep]       = useState(0);
  const [visibleSubs, setVisibleSubs] = useState([]);
  const [selected, setSelected]       = useState([]);

  useEffect(() => {
    if (isOpen) { setStep("connect"); setScanStep(0); setVisibleSubs([]); setSelected([]); }
  }, [isOpen]);

  const startScan = () => {
    setStep("scanning"); setScanStep(0); setVisibleSubs([]);
    SCAN_STEPS.forEach((_, i) => {
      setTimeout(() => {
        setScanStep(i);
        if (i >= 3 && i - 3 < GMAIL_DETECTED.length)
          setVisibleSubs(prev => [...prev, GMAIL_DETECTED[i - 3]]);
        if (i === SCAN_STEPS.length - 1)
          setTimeout(() => { setStep("results"); setSelected(GMAIL_DETECTED.map(s => s.id)); }, 600);
      }, i * 700);
    });
  };

  const toggleSelect  = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const handleImport  = () => { onImport(GMAIL_DETECTED.filter(s => selected.includes(s.id))); onClose(); };
  const alreadyExists = (name) => existingSubs.some(s => s.name.toLowerCase() === name.toLowerCase());

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={step === "connect" ? onClose : undefined}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-lg rounded-3xl overflow-hidden"
                 style={{ background: "rgba(15,10,30,0.99)", border: "1px solid rgba(99,102,241,0.3)", boxShadow: "0 40px 100px rgba(0,0,0,0.8)", maxHeight: "85vh", display: "flex", flexDirection: "column" }}>
              <div className="absolute top-0 left-0 right-0 h-px"
                   style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.8), transparent)" }} />

              {/* CONNECT */}
              {step === "connect" && (
                <div className="p-8 text-center">
                  <motion.div animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-6xl mb-4">📧</motion.div>
                  <h2 className="text-2xl font-bold mb-2" style={{ background: "linear-gradient(135deg, #fff, #a5b4fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Scan Gmail Inbox</h2>
                  <p className="text-sm mb-6" style={{ color: "#9ca3af" }}>We'll scan your inbox for subscription receipts and automatically detect your active subscriptions.</p>
                  <div className="p-4 rounded-2xl mb-6 text-left" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
                    <p className="text-xs font-bold mb-3" style={{ color: "#a5b4fc" }}>🔍 We scan emails from:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {["noreply@netflix.com","no-reply@spotify.com","noreply@amazon.in","noreply@youtube.com","noreply@hotstar.com","noreply@github.com"].map(email => (
                        <div key={email} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#6366f1" }} />
                          <span className="text-xs font-mono" style={{ color: "#6b7280" }}>{email}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-xl mb-6" style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}>
                    <span className="text-sm mt-0.5">🔒</span>
                    <p className="text-xs" style={{ color: "#6ee7b7" }}><span className="font-bold">Privacy first:</span> We only read subject lines and sender info. We never read email content or store your data.</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}>Cancel</button>
                    <motion.button onClick={startScan} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                      className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                      style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 8px 30px rgba(99,102,241,0.4)" }}>
                      <FiMail /> Connect Gmail
                    </motion.button>
                  </div>
                </div>
              )}

              {/* SCANNING */}
              {step === "scanning" && (
                <div className="p-8">
                  <div className="text-center mb-6">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="inline-flex w-16 h-16 items-center justify-center rounded-full mb-4"
                      style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))", border: "2px solid rgba(99,102,241,0.4)" }}>
                      <FiMail className="text-2xl" style={{ color: "#a5b4fc" }} />
                    </motion.div>
                    <h2 className="text-xl font-bold text-white mb-1">Scanning your inbox...</h2>
                    <p className="text-sm" style={{ color: "#6b7280" }}>Please wait while we detect your subscriptions</p>
                  </div>
                  <div className="space-y-2 mb-6">
                    {SCAN_STEPS.map((s, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: i <= scanStep ? 1 : 0.2, x: 0 }} transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3 py-2 px-3 rounded-xl"
                        style={i === scanStep ? { background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" } : {}}>
                        {i < scanStep ? (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(52,211,153,0.2)" }}>
                            <FiCheck className="text-xs" style={{ color: "#34d399" }} />
                          </div>
                        ) : i === scanStep ? (
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="flex-shrink-0">
                            <div className="w-5 h-5 rounded-full border-2" style={{ borderColor: "#6366f1", borderTopColor: "transparent" }} />
                          </motion.div>
                        ) : (
                          <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ background: "rgba(255,255,255,0.05)" }} />
                        )}
                        <span className="text-sm" style={{ color: i <= scanStep ? "#e2e8f0" : "#4b5563" }}>{s}</span>
                      </motion.div>
                    ))}
                  </div>
                  {visibleSubs.length > 0 && (
                    <div>
                      <p className="text-xs font-bold mb-2" style={{ color: "#a5b4fc" }}>📬 Found so far:</p>
                      <div className="space-y-2">
                        {visibleSubs.map(sub => (
                          <motion.div key={sub.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 p-2 rounded-xl"
                            style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}>
                            <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0" style={{ background: "rgba(255,255,255,0.9)", padding: "4px" }}>
                              {sub.logo ? <img src={sub.logo} alt="" className="w-full h-full object-contain" /> : <span className="text-sm">{sub.icon}</span>}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-xs font-semibold">{sub.name}</p>
                              <p className="text-xs truncate" style={{ color: "#6b7280" }}>{sub.email}</p>
                            </div>
                            <span className="text-xs font-bold" style={{ color: "#34d399" }}>₹{sub.cost}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* RESULTS */}
              {step === "results" && (
                <div className="flex flex-col" style={{ maxHeight: "85vh" }}>
                  <div className="p-6 pb-4 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-white">🎉 Found {GMAIL_DETECTED.length} subscriptions!</h2>
                        <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>Select the ones you want to import</p>
                      </div>
                      <button onClick={onClose} className="p-2 rounded-xl text-gray-400" style={{ background: "rgba(255,255,255,0.05)" }}><FiX /></button>
                    </div>
                    <div className="flex items-center justify-between mt-4 p-3 rounded-xl" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
                      <span className="text-sm" style={{ color: "#a5b4fc" }}>{selected.length} of {GMAIL_DETECTED.length} selected</span>
                      <button onClick={() => setSelected(selected.length === GMAIL_DETECTED.length ? [] : GMAIL_DETECTED.map(s => s.id))}
                        className="text-xs font-semibold" style={{ color: "#6366f1" }}>
                        {selected.length === GMAIL_DETECTED.length ? "Deselect all" : "Select all"}
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto px-6 pb-2 space-y-2">
                    {GMAIL_DETECTED.map((sub, i) => {
                      const isSelected = selected.includes(sub.id);
                      const exists     = alreadyExists(sub.name);
                      return (
                        <motion.div key={sub.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                          onClick={() => !exists && toggleSelect(sub.id)}
                          className="flex items-center gap-3 p-3 rounded-2xl transition cursor-pointer"
                          style={{ background: exists ? "rgba(255,255,255,0.02)" : isSelected ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${exists ? "rgba(255,255,255,0.05)" : isSelected ? "rgba(99,102,241,0.35)" : "rgba(255,255,255,0.08)"}`, opacity: exists ? 0.5 : 1 }}>
                          <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                               style={{ background: isSelected ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.08)", border: isSelected ? "none" : "1px solid rgba(255,255,255,0.15)" }}>
                            {isSelected && <FiCheck className="text-white text-xs" />}
                          </div>
                          <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "rgba(255,255,255,0.9)", padding: "5px" }}>
                            {sub.logo ? <img src={sub.logo} alt="" className="w-full h-full object-contain" /> : <span className="text-base">{sub.icon}</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-white text-sm font-semibold">{sub.name}</p>
                              {exists && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc" }}>Already added</span>}
                            </div>
                            <p className="text-xs truncate" style={{ color: "#6b7280" }}>{sub.email} · {sub.detectedAt}</p>
                            <p className="text-xs truncate" style={{ color: "#4b5563" }}>"{sub.subject}"</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-white font-bold text-sm">₹{sub.cost}</p>
                            <p className="text-xs" style={{ color: "#6b7280" }}>/month</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  <div className="p-6 pt-4 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs" style={{ color: "#6b7280" }}>Total monthly cost of selected:</p>
                      <p className="font-bold" style={{ color: "#a5b4fc" }}>
                        ₹{GMAIL_DETECTED.filter(s => selected.includes(s.id)).reduce((sum, s) => sum + s.cost, 0).toLocaleString()}/mo
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}>Skip</button>
                      <motion.button onClick={handleImport} disabled={selected.length === 0}
                        whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                        className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50"
                        style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: selected.length > 0 ? "0 8px 30px rgba(99,102,241,0.4)" : "none" }}>
                        <FiInbox /> Import {selected.length} Subscription{selected.length !== 1 ? "s" : ""}
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Form Field ─────────────────────────────────────────────────
function FormField({ label, icon: Icon, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#9ca3af" }}>{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-base pointer-events-none" style={{ color: "#6366f1" }} />}
        {children}
      </div>
      {error && <p className="flex items-center gap-1.5 text-xs mt-1.5" style={{ color: "#f87171" }}><FiAlertCircle /> {error.message}</p>}
    </div>
  );
}

// ── Add/Edit Modal ─────────────────────────────────────────────
function SubModal({ isOpen, onClose, onSave, editData }) {
  const isEdit = !!editData;
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: editData ? {
      name: editData.name,
      cost: editData.cost,
      renewalDate: editData.renewalDate?.split("T")[0],
      category: editData.category,
      notes: editData.notes,
    } : {},
  });
  const watchedName = watch("name", "");
  const previewLogo = getLogoForName(watchedName);

  const onSubmit = (data) => {
    onSave({ ...data, icon: CATEGORY_ICONS[data.category] || "📦", logo: getLogoForName(data.name) });
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }} />
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-md p-7 rounded-3xl text-white overflow-hidden"
                 style={{ background: "rgba(15,10,30,0.98)", backdropFilter: "blur(30px)", border: "1px solid rgba(99,102,241,0.25)", boxShadow: "0 40px 100px rgba(0,0,0,0.7)" }}>
              <div className="absolute top-0 left-6 right-6 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)" }} />
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden" style={{ background: "rgba(255,255,255,0.9)", padding: "5px" }}>
                    {previewLogo ? <img src={previewLogo} alt="" className="w-full h-full object-contain" /> : <span className="text-lg">📦</span>}
                  </div>
                  <h2 className="text-xl font-bold" style={{ background: "linear-gradient(135deg, #fff, #a5b4fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {isEdit ? "Edit Subscription" : "Add Subscription"}
                  </h2>
                </div>
                <button onClick={onClose} className="p-2 rounded-xl text-gray-400" style={{ background: "rgba(255,255,255,0.05)" }}><FiX /></button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <FormField label="Service Name" icon={FiTag} error={errors.name}>
                  <input type="text" placeholder="Netflix, Gym, Spotify..." {...register("name")}
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-sm transition" style={inputStyle(errors.name)} />
                </FormField>
                <FormField label="Monthly Cost (₹)" icon={FiDollarSign} error={errors.cost}>
                  <input type="number" placeholder="499" {...register("cost")}
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-sm transition" style={inputStyle(errors.cost)} />
                </FormField>
                <FormField label="Renewal Date" icon={FiCalendar} error={errors.renewalDate}>
                  <input type="date" {...register("renewalDate")}
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-sm transition"
                    style={{ ...inputStyle(errors.renewalDate), colorScheme: "dark" }} />
                </FormField>
                <FormField label="Category" error={errors.category}>
                  <select {...register("category")} className="w-full px-4 py-3 rounded-xl text-sm"
                    style={{ ...inputStyle(errors.category), colorScheme: "dark" }}>
                    <option value="" style={{ background: "#0f0a1e" }}>Select category</option>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value} style={{ background: "#0f0a1e" }}>{c.icon} {c.value}</option>)}
                  </select>
                </FormField>
                <FormField label="Notes (optional)">
                  <textarea placeholder="Family plan..." {...register("notes")} rows={2}
                    className="w-full px-4 py-3 rounded-xl text-sm resize-none" style={inputStyle(false)} />
                </FormField>
                {previewLogo && <p className="text-xs flex items-center gap-1.5" style={{ color: "#34d399" }}>✅ Logo detected for "{watchedName}"</p>}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}>Cancel</button>
                  <motion.button type="submit" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                    className="flex-1 py-3 rounded-xl text-sm font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 8px 30px rgba(99,102,241,0.4)" }}>
                    {isEdit ? "Save Changes" : "Add Subscription"}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Delete Modal ───────────────────────────────────────────────
function DeleteModal({ isOpen, onClose, onConfirm, subName }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }} />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm p-7 rounded-3xl text-white text-center"
                 style={{ background: "rgba(15,10,30,0.98)", border: "1px solid rgba(239,68,68,0.25)", boxShadow: "0 40px 100px rgba(0,0,0,0.7)" }}>
              <div className="text-5xl mb-4">🗑️</div>
              <h2 className="text-xl font-bold mb-2">Delete Subscription?</h2>
              <p className="text-sm mb-6" style={{ color: "#9ca3af" }}>
                Are you sure you want to delete <span className="text-white font-semibold">{subName}</span>?
              </p>
              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}>Cancel</button>
                <motion.button onClick={onConfirm} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}>Yes, Delete</motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Sub Card ───────────────────────────────────────────────────
function SubCard({ sub, onEdit, onDelete, index }) {
  const days  = getDaysLeft(sub.renewalDate);
  const style = getAlertStyle(days);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }} whileHover={{ y: -5, scale: 1.02 }}
      className="relative p-5 rounded-2xl flex flex-col gap-3 overflow-hidden" style={cardStyle}>
      <div className="absolute top-0 left-4 right-4 h-px"
           style={{ background: `linear-gradient(90deg, transparent, ${style.dot}60, transparent)` }} />
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <BrandIcon sub={sub} size={10} />
          <div>
            <h3 className="font-semibold text-sm text-white">{sub.name}</h3>
            <p className="text-xs" style={{ color: "#6b7280" }}>{sub.category}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => onEdit(sub)} className="p-1.5 rounded-lg transition" style={{ color: "#6b7280" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.15)"; e.currentTarget.style.color = "#a5b4fc"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6b7280"; }}>
            <FiEdit2 className="text-sm" />
          </button>
          <button onClick={() => onDelete(sub)} className="p-1.5 rounded-lg transition" style={{ color: "#6b7280" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; e.currentTarget.style.color = "#f87171"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6b7280"; }}>
            <FiTrash2 className="text-sm" />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: "#6b7280" }}>Monthly</span>
        <span className="text-white font-bold text-lg">₹{sub.cost}</span>
      </div>
      <div className="flex items-center justify-between px-3 py-2 rounded-xl"
           style={{ background: style.bg, border: `1px solid ${style.border}` }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: style.dot }} />
          <span className="text-xs" style={{ color: "#9ca3af" }}>{sub.renewalDate?.split("T")[0]}</span>
        </div>
        <span className="text-xs font-bold" style={{ color: style.color }}>{days <= 0 ? "Expired" : `${days}d left`}</span>
      </div>
      {sub.notes && <p className="text-xs italic" style={{ color: "#6b7280" }}>📝 {sub.notes}</p>}
    </motion.div>
  );
}

// ── Sub Row ────────────────────────────────────────────────────
function SubRow({ sub, onEdit, onDelete, index }) {
  const days  = getDaysLeft(sub.renewalDate);
  const style = getAlertStyle(days);
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * index }}
      className="flex items-center gap-4 p-4 rounded-xl transition duration-200" style={cardStyle}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.07)"}
      onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}>
      <BrandIcon sub={sub} size={10} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-white">{sub.name}</p>
        <p className="text-xs" style={{ color: "#6b7280" }}>{sub.category}</p>
      </div>
      <div className="text-right hidden sm:block">
        <p className="text-white font-bold">₹{sub.cost}</p>
        <p className="text-xs" style={{ color: "#6b7280" }}>per month</p>
      </div>
      <div className="px-3 py-1.5 rounded-lg hidden md:flex items-center gap-2"
           style={{ background: style.bg, border: `1px solid ${style.border}` }}>
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: style.dot }} />
        <span className="text-xs font-semibold" style={{ color: style.color }}>{days <= 0 ? "Expired" : `${days}d`}</span>
      </div>
      <div className="flex gap-1 flex-shrink-0">
        <button onClick={() => onEdit(sub)} className="p-2 rounded-lg transition" style={{ color: "#6b7280" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.15)"; e.currentTarget.style.color = "#a5b4fc"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6b7280"; }}>
          <FiEdit2 />
        </button>
        <button onClick={() => onDelete(sub)} className="p-2 rounded-lg transition" style={{ color: "#6b7280" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; e.currentTarget.style.color = "#f87171"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6b7280"; }}>
          <FiTrash2 />
        </button>
      </div>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────────
export default function SubscriptionsPage() {
  const [subs, setSubs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [sortBy, setSortBy]       = useState("name");
  const [viewMode, setViewMode]   = useState("grid");
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData]   = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, sub: null });
  const [gmailOpen, setGmailOpen] = useState(false);

  useEffect(() => { fetchSubs(); }, []);

  const fetchSubs = async () => {
    try {
      setLoading(true);
      const data = await getSubscriptions();
      setSubs(data);
    } catch {
      toast.error("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd  = () => { setEditData(null); setModalOpen(true); };
  const handleEdit = (sub) => { setEditData(sub); setModalOpen(true); };

  const handleSave = async (data) => {
    try {
      if (editData) {
        const updated = await updateSubscription(editData._id, data);
        setSubs(prev => prev.map(s => s._id === updated._id ? updated : s));
        toast.success(`${data.name} updated! ✅`);
      } else {
        const created = await addSubscription(data);
        setSubs(prev => [...prev, created]);
        toast.success(`${data.name} added! 🎉`);
      }
    } catch {
      toast.error("Failed to save subscription");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteSubscription(deleteModal.sub._id);
      setSubs(prev => prev.filter(s => s._id !== deleteModal.sub._id));
      toast.success(`${deleteModal.sub.name} deleted`);
      setDeleteModal({ open: false, sub: null });
    } catch {
      toast.error("Failed to delete subscription");
    }
  };

  const handleGmailImport = async (detected) => {
    const newSubs = detected.filter(d => !subs.some(s => s.name.toLowerCase() === d.name.toLowerCase()));
    if (newSubs.length === 0) { toast("All selected subscriptions already exist!", { icon: "ℹ️" }); return; }
    try {
      const created = await Promise.all(newSubs.map(s => addSubscription(s)));
      setSubs(prev => [...prev, ...created]);
      toast.success(`🎉 Imported ${created.length} subscription${created.length > 1 ? "s" : ""} from Gmail!`);
    } catch {
      toast.error("Failed to import subscriptions");
    }
  };

  const allCategories = ["All", ...new Set(subs.map(s => s.category))];
  const filtered = subs
    .filter(s => (filterCat === "All" || s.category === filterCat) && s.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name")    return a.name.localeCompare(b.name);
      if (sortBy === "cost")    return b.cost - a.cost;
      if (sortBy === "renewal") return getDaysLeft(a.renewalDate) - getDaysLeft(b.renewalDate);
      return 0;
    });

  const totalMonthly = subs.reduce((s, x) => s + x.cost, 0);

  const selectStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#9ca3af", outline: "none", colorScheme: "dark",
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0f0a1e] flex items-center justify-center text-white">
      Loading...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0a1e] p-6 relative">
      <div className="fixed inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.06) 0%, transparent 50%)",
      }} />
      <div className="relative z-10">
        
        {/* CORRECTED PORTION: Header and Actions Bar */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold"
                style={{ background: "linear-gradient(135deg, #fff 0%, #a5b4fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              My Subscriptions
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#6b7280" }}>
              {subs.length} active · <span style={{ color: "#a5b4fc", fontWeight: 600 }}>₹{totalMonthly.toLocaleString()}/month</span>
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <motion.button onClick={() => setGmailOpen(true)} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border border-white/10 text-indigo-300 bg-white/5 whitespace-nowrap">
              <FiMail /> Scan Gmail
            </motion.button>
            <motion.button onClick={handleAdd} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 whitespace-nowrap shadow-lg">
              <FiPlus /> Add Sub
            </motion.button>
          </div>
        </motion.div>

        {/* CORRECTED PORTION: Search and Filter Bar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="space-y-4 mb-8">
          <div className="relative w-full">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" />
            <input type="text" placeholder="Search subscriptions..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none bg-white/5 border border-white/10 text-white" />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="grid grid-cols-2 gap-3 flex-1 min-w-[200px]">
              <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="p-3 rounded-xl text-sm bg-white/5 border border-white/10 text-gray-400">
                {allCategories.map(c => <option key={c} style={{ background: "#0f0a1e" }}>{c}</option>)}
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="p-3 rounded-xl text-sm bg-white/5 border border-white/10 text-gray-400">
                <option style={{ background: "#0f0a1e" }} value="name">Name</option>
                <option style={{ background: "#0f0a1e" }} value="cost">Cost</option>
              </select>
            </div>
            <div className="flex rounded-xl overflow-hidden border border-white/10">
              {[{ mode: "grid", Icon: FiGrid }, { mode: "list", Icon: FiList }].map(({ mode, Icon }) => (
                <button key={mode} onClick={() => setViewMode(mode)} className={`p-3 transition ${viewMode === mode ? "bg-indigo-600 text-white" : "bg-white/5 text-gray-500"}`}>
                  <Icon />
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content Section (Remains the same as your original) */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="font-semibold text-lg mb-2 text-white">{search ? "No results found" : "No subscriptions yet"}</h3>
              <p className="text-sm mb-6 text-gray-500">Add manually or scan your Gmail inbox</p>
            </motion.div>
          ) : viewMode === "grid" ? (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((sub, i) => <SubCard key={sub._id} sub={sub} index={i} onEdit={handleEdit} onDelete={(s) => setDeleteModal({ open: true, sub: s })} />)}
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              {filtered.map((sub, i) => <SubRow key={sub._id} sub={sub} index={i} onEdit={handleEdit} onDelete={(s) => setDeleteModal({ open: true, sub: s })} />)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <GmailScanModal isOpen={gmailOpen} onClose={() => setGmailOpen(false)} onImport={handleGmailImport} existingSubs={subs} />
      <SubModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditData(null); }} onSave={handleSave} editData={editData} />
      <DeleteModal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, sub: null })} onConfirm={handleDeleteConfirm} subName={deleteModal.sub?.name} />
    </div>
  );
}