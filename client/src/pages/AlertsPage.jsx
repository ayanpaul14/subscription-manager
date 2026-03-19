import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBell, FiAlertCircle, FiClock,
  FiCheckCircle, FiCreditCard, FiX, FiCheck,
  FiSmartphone, FiDollarSign
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getSubscriptions, togglePaid } from "../api/subscriptionsApi";

// ── Brand Logos ────────────────────────────────────────────────
const BRAND_LOGOS = {
  "netflix":         "https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png",
  "spotify":         "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg",
  "amazon prime":    "https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.svg",
  "hotstar":         "https://upload.wikimedia.org/wikipedia/commons/1/1e/Disney%2B_Hotstar_logo.svg",
  "github":          "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
  "youtube":         "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg",
  "microsoft":       "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  "canva":           "https://upload.wikimedia.org/wikipedia/commons/b/bb/Canva_Logo.svg",
};
const getLogoForName = (name) => BRAND_LOGOS[name?.toLowerCase().trim()] || null;

// ── Helpers ────────────────────────────────────────────────────
const getDaysLeft = (dateStr) =>
  Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));

const getAlertLevel = (days) => {
  if (days <= 0)  return "expired";
  if (days <= 3)  return "critical";
  if (days <= 7)  return "warning";
  if (days <= 14) return "upcoming";
  return "safe";
};

const ALERT_STYLES = {
  expired:  { color: "#9ca3af", bg: "rgba(107,114,128,0.08)", border: "rgba(107,114,128,0.2)", dot: "#9ca3af", barColor: "#9ca3af", label: "Expired",  emoji: "💀", glow: "rgba(107,114,128,0.15)" },
  critical: { color: "#f87171", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.2)",   dot: "#f87171", barColor: "#ef4444", label: "Critical", emoji: "🔴", glow: "rgba(239,68,68,0.2)" },
  warning:  { color: "#fb923c", bg: "rgba(249,115,22,0.08)",  border: "rgba(249,115,22,0.2)",  dot: "#fb923c", barColor: "#f97316", label: "Warning",  emoji: "🟠", glow: "rgba(249,115,22,0.15)" },
  upcoming: { color: "#facc15", bg: "rgba(234,179,8,0.08)",   border: "rgba(234,179,8,0.2)",   dot: "#facc15", barColor: "#eab308", label: "Upcoming", emoji: "🟡", glow: "rgba(234,179,8,0.15)" },
  safe:     { color: "#34d399", bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.2)",  dot: "#34d399", barColor: "#10b981", label: "Safe",     emoji: "🟢", glow: "rgba(52,211,153,0.15)" },
};

const UPI_APPS = [
  { id: "gpay",    name: "Google Pay", icon: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",   color: "#4285F4" },
  { id: "phonepe", name: "PhonePe",    icon: "https://upload.wikimedia.org/wikipedia/commons/6/6b/PhonePe_Logo.svg",           color: "#5f259f" },
  { id: "paytm",   name: "Paytm",      icon: "https://upload.wikimedia.org/wikipedia/commons/4/42/Paytm_logo.png",             color: "#00BAF2" },
  { id: "bhim",    name: "BHIM UPI",   icon: "https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg",        color: "#FF6B00" },
];

// ── Brand Icon ─────────────────────────────────────────────────
function BrandIcon({ sub, size = 12 }) {
  const [imgError, setImgError] = useState(false);
  const logo = sub.logo || getLogoForName(sub.name);
  const sz = size === 12 ? "w-12 h-12" : "w-9 h-9";
  return (
    <div className={`${sz} rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0`}
         style={{ background: "rgba(255,255,255,0.92)", padding: size === 12 ? "8px" : "6px" }}>
      {logo && !imgError
        ? <img src={logo} alt={sub.name} className="w-full h-full object-contain" onError={() => setImgError(true)} />
        : <span className={size === 12 ? "text-2xl" : "text-lg"}>{sub.icon || "📦"}</span>
      }
    </div>
  );
}

// ── Countdown Timer ────────────────────────────────────────────
function CountdownTimer({ renewalDate }) {
  const [timeLeft, setTimeLeft] = useState({});
  useEffect(() => {
    const calc = () => {
      const diff = new Date(renewalDate) - new Date();
      if (diff <= 0) { setTimeLeft({ expired: true }); return; }
      setTimeLeft({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [renewalDate]);

  if (timeLeft.expired)
    return <span className="font-mono text-xs" style={{ color: "#9ca3af" }}>Expired</span>;

  return (
    <div className="flex items-center gap-1">
      {[{ v: timeLeft.days, l: "d" }, { v: timeLeft.hours, l: "h" },
        { v: timeLeft.minutes, l: "m" }, { v: timeLeft.seconds, l: "s" }].map(({ v, l }, i) => (
        <div key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-xs" style={{ color: "#374151" }}>:</span>}
          <div className="flex flex-col items-center">
            <span className="font-mono font-bold text-sm text-white w-7 text-center rounded px-1 py-0.5"
                  style={{ background: "rgba(255,255,255,0.08)" }}>
              {String(v ?? 0).padStart(2, "0")}
            </span>
            <span className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{l}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Pay Now Modal ──────────────────────────────────────────────
function PayNowModal({ isOpen, onClose, sub, onPaymentSuccess }) {
  const [tab, setTab]         = useState("upi");
  const [upiId, setUpiId]     = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry]   = useState("");
  const [cvv, setCvv]         = useState("");
  const [name, setName]       = useState("");
  const [paying, setPaying]   = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTab("upi"); setUpiId(""); setSelectedApp(null);
      setCardNum(""); setExpiry(""); setCvv(""); setName("");
      setPaying(false); setSuccess(false);
    }
  }, [isOpen]);

  const handlePay = async () => {
    setPaying(true);
    await new Promise(r => setTimeout(r, 2000));
    setPaying(false);
    setSuccess(true);
    await new Promise(r => setTimeout(r, 1500));
    onPaymentSuccess(sub);
    onClose();
  };

  const inputCls = "w-full px-4 py-3 rounded-xl text-sm text-white transition outline-none";
  const inputSty = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" };

  if (!sub) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={!paying ? onClose : undefined} className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)" }} />
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-md rounded-3xl overflow-hidden"
                 style={{ background: "rgba(15,10,30,0.99)", border: "1px solid rgba(99,102,241,0.3)", boxShadow: "0 40px 100px rgba(0,0,0,0.8)" }}>
              <div className="absolute top-0 left-0 right-0 h-px"
                   style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.8), transparent)" }} />

              <AnimatePresence>
                {success && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-3xl"
                    style={{ background: "rgba(15,10,30,0.98)" }}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
                      className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                      style={{ background: "rgba(52,211,153,0.15)", border: "2px solid #34d399" }}>
                      <FiCheck className="text-3xl" style={{ color: "#34d399" }} />
                    </motion.div>
                    <h3 className="text-white text-xl font-bold mb-1">Payment Successful! 🎉</h3>
                    <p className="text-sm" style={{ color: "#9ca3af" }}>₹{sub.cost} paid for {sub.name}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <BrandIcon sub={sub} size={9} />
                    <div>
                      <h2 className="text-white font-bold text-lg">{sub.name}</h2>
                      <p className="text-xs" style={{ color: "#6b7280" }}>{sub.renewalDate?.split("T")[0]}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ background: "linear-gradient(135deg, #a5b4fc, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>₹{sub.cost}</p>
                    <p className="text-xs" style={{ color: "#6b7280" }}>to pay</p>
                  </div>
                  <button onClick={onClose} className="p-2 rounded-xl ml-3" style={{ background: "rgba(255,255,255,0.05)", color: "#9ca3af" }}><FiX /></button>
                </div>

                <div className="flex gap-2 mb-5 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  {[{ id: "upi", label: "UPI", icon: <FiSmartphone className="text-sm" /> }, { id: "card", label: "Card", icon: <FiCreditCard className="text-sm" /> }].map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition"
                      style={tab === t.id ? { background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", boxShadow: "0 4px 15px rgba(99,102,241,0.3)" } : { color: "#6b7280" }}>
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>

                {tab === "upi" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#6b7280" }}>Pay with App</p>
                      <div className="grid grid-cols-4 gap-2">
                        {UPI_APPS.map(app => (
                          <motion.button key={app.id} onClick={() => setSelectedApp(app.id)} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}
                            className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition"
                            style={selectedApp === app.id ? { background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.4)" } : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center" style={{ background: "rgba(255,255,255,0.9)", padding: "4px" }}>
                              <img src={app.icon} alt={app.name} className="w-full h-full object-contain" onError={e => { e.target.style.display = "none"; }} />
                            </div>
                            <span className="text-xs" style={{ color: selectedApp === app.id ? "#a5b4fc" : "#6b7280" }}>{app.name.split(" ")[0]}</span>
                            {selectedApp === app.id && <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "#6366f1" }}><FiCheck className="text-white" style={{ fontSize: "8px" }} /></div>}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                      <span className="text-xs" style={{ color: "#4b5563" }}>or enter UPI ID</span>
                      <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                    </div>
                    <div className="relative">
                      <FiSmartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: "#6366f1" }} />
                      <input type="text" placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)}
                        className={`${inputCls} pl-11`} style={inputSty}
                        onFocus={e => { e.target.style.borderColor = "rgba(99,102,241,0.5)"; e.target.style.background = "rgba(99,102,241,0.07)"; }}
                        onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.05)"; }} />
                    </div>
                  </motion.div>
                )}

                {tab === "card" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    <div className="relative">
                      <FiCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: "#6366f1" }} />
                      <input type="text" placeholder="Card number" value={cardNum}
                        onChange={e => setCardNum(e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim())}
                        className={`${inputCls} pl-11`} style={inputSty}
                        onFocus={e => { e.target.style.borderColor = "rgba(99,102,241,0.5)"; e.target.style.background = "rgba(99,102,241,0.07)"; }}
                        onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.05)"; }} />
                    </div>
                    <input type="text" placeholder="Cardholder name" value={name} onChange={e => setName(e.target.value)}
                      className={inputCls} style={inputSty}
                      onFocus={e => { e.target.style.borderColor = "rgba(99,102,241,0.5)"; e.target.style.background = "rgba(99,102,241,0.07)"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.05)"; }} />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="MM / YY" value={expiry}
                        onChange={e => { let v = e.target.value.replace(/\D/g, "").slice(0, 4); if (v.length >= 3) v = v.slice(0, 2) + " / " + v.slice(2); setExpiry(v); }}
                        className={inputCls} style={inputSty}
                        onFocus={e => { e.target.style.borderColor = "rgba(99,102,241,0.5)"; e.target.style.background = "rgba(99,102,241,0.07)"; }}
                        onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.05)"; }} />
                      <input type="password" placeholder="CVV" maxLength={3} value={cvv}
                        onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                        className={inputCls} style={inputSty}
                        onFocus={e => { e.target.style.borderColor = "rgba(99,102,241,0.5)"; e.target.style.background = "rgba(99,102,241,0.07)"; }}
                        onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.05)"; }} />
                    </div>
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-xs" style={{ color: "#4b5563" }}>Accepted:</span>
                      {["Visa", "MC", "RuPay", "Amex"].map(c => (
                        <span key={c} className="text-xs px-2 py-0.5 rounded font-bold" style={{ background: "rgba(255,255,255,0.06)", color: "#6b7280" }}>{c}</span>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div className="flex items-center gap-2 mt-4 p-3 rounded-xl" style={{ background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.15)" }}>
                  <span className="text-sm">🔒</span>
                  <p className="text-xs" style={{ color: "#6ee7b7" }}>256-bit SSL secured. Your payment info is never stored.</p>
                </div>

                <motion.button onClick={handlePay} disabled={paying} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                  className="w-full mt-4 py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-70"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)", boxShadow: "0 10px 30px rgba(99,102,241,0.4)" }}>
                  {paying ? (
                    <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 rounded-full border-2 border-t-transparent border-white" />Processing payment...</>
                  ) : (
                    <><FiDollarSign /> Pay ₹{sub.cost} Now</>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Alert Card ─────────────────────────────────────────────────
function AlertCard({ sub, index, onMarkPaid, onPayNow }) {
  const days  = getDaysLeft(sub.renewalDate);
  const level = getAlertLevel(days);
  const style = ALERT_STYLES[level];
  const isPaid = sub.isPaid;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index }} whileHover={{ y: -4, scale: 1.01 }}
      className="relative p-5 rounded-2xl overflow-hidden"
      style={{
        background: isPaid ? "rgba(52,211,153,0.04)" : "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${isPaid ? "rgba(52,211,153,0.25)" : style.border}`,
        boxShadow: `0 10px 40px rgba(0,0,0,0.3), 0 0 20px ${isPaid ? "rgba(52,211,153,0.1)" : style.glow}`,
        opacity: isPaid ? 0.8 : 1,
      }}>
      <div className="absolute top-0 left-4 right-4 h-px"
           style={{ background: `linear-gradient(90deg, transparent, ${isPaid ? "#34d399" : style.dot}, transparent)` }} />

      {isPaid && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full z-10"
             style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)" }}>
          <FiCheckCircle className="text-xs" style={{ color: "#34d399" }} />
          <span className="text-xs font-bold" style={{ color: "#34d399" }}>Paid</span>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <BrandIcon sub={sub} size={12} />
          <div>
            <h3 className="text-white font-bold text-base">{sub.name}</h3>
            <p className="text-xs" style={{ color: "#6b7280" }}>{sub.category}</p>
          </div>
        </div>
        {!isPaid && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
               style={{ background: style.bg, border: `1px solid ${style.border}` }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: style.dot }} />
            <span className="text-xs font-bold" style={{ color: style.color }}>{style.emoji} {style.label}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-xs mb-1" style={{ color: "#6b7280" }}>Monthly Cost</p>
          <p className="text-white font-bold text-lg">₹{sub.cost}</p>
        </div>
        <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-xs mb-1" style={{ color: "#6b7280" }}>Renewal Date</p>
          <p className="text-white font-semibold text-sm">{sub.renewalDate?.split("T")[0]}</p>
        </div>
      </div>

      {!isPaid && (
        <div className="flex items-center justify-between p-3 rounded-xl mb-4"
             style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2">
            <FiClock className="text-sm" style={{ color: style.color }} />
            <span className="text-xs" style={{ color: "#6b7280" }}>Time remaining</span>
          </div>
          <CountdownTimer renewalDate={sub.renewalDate} />
        </div>
      )}

      {days > 0 && !isPaid && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1" style={{ color: "#4b5563" }}>
            <span>0 days</span>
            <span className="font-semibold" style={{ color: style.color }}>{days} days left</span>
            <span>30 days</span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((days / 30) * 100, 100)}%` }}
              transition={{ duration: 0.8, delay: 0.1 * index }} className="h-full rounded-full"
              style={{ background: style.barColor }} />
          </div>
        </div>
      )}

      {!isPaid ? (
        <div className="flex gap-2 mt-2">
          <motion.button onClick={() => onMarkPaid(sub)} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition"
            style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.25)", color: "#34d399" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(52,211,153,0.15)"; e.currentTarget.style.borderColor = "rgba(52,211,153,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(52,211,153,0.08)"; e.currentTarget.style.borderColor = "rgba(52,211,153,0.25)"; }}>
            <FiCheckCircle /> Mark as Paid
          </motion.button>
          <motion.button onClick={() => onPayNow(sub)} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 6px 20px rgba(99,102,241,0.35)" }}>
            <FiCreditCard /> Pay Now
          </motion.button>
        </div>
      ) : (
        <motion.button onClick={() => onMarkPaid(sub)} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
          className="w-full py-2.5 rounded-xl text-xs font-semibold transition mt-2"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#6b7280" }}>
          ↩ Undo — Mark as Unpaid
        </motion.button>
      )}
    </motion.div>
  );
}

// ── Summary Banner ─────────────────────────────────────────────
function SummaryBanner({ subs }) {
  const counts = {
    critical: subs.filter(s => getAlertLevel(getDaysLeft(s.renewalDate)) === "critical").length,
    warning:  subs.filter(s => getAlertLevel(getDaysLeft(s.renewalDate)) === "warning").length,
    upcoming: subs.filter(s => getAlertLevel(getDaysLeft(s.renewalDate)) === "upcoming").length,
    safe:     subs.filter(s => getAlertLevel(getDaysLeft(s.renewalDate)) === "safe").length,
  };
  const paidSubs  = subs.filter(s => s.isPaid);
  const paidTotal = paidSubs.reduce((sum, s) => sum + s.cost, 0);

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {[
        { label: "Critical", value: counts.critical, ...ALERT_STYLES.critical },
        { label: "Warning",  value: counts.warning,  ...ALERT_STYLES.warning  },
        { label: "Upcoming", value: counts.upcoming, ...ALERT_STYLES.upcoming },
        { label: "Safe",     value: counts.safe,     ...ALERT_STYLES.safe     },
        { label: "Paid", value: paidSubs.length, emoji: "✅", color: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)", dot: "#34d399", glow: "rgba(52,211,153,0.15)", sub: `₹${paidTotal.toLocaleString()} cleared` },
      ].map((card, i) => (
        <motion.div key={card.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 * i }} whileHover={{ y: -3, scale: 1.02 }}
          className="relative p-4 rounded-2xl text-center overflow-hidden"
          style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: `1px solid ${card.border}`, boxShadow: `0 10px 30px rgba(0,0,0,0.2), 0 0 15px ${card.glow}` }}>
          <div className="absolute top-0 left-4 right-4 h-px"
               style={{ background: `linear-gradient(90deg, transparent, ${card.dot}, transparent)` }} />
          <p className="text-2xl mb-1">{card.emoji}</p>
          <p className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</p>
          <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{card.label}</p>
          {card.sub && <p className="text-xs mt-0.5" style={{ color: "#34d399" }}>{card.sub}</p>}
        </motion.div>
      ))}
    </motion.div>
  );
}

// ── Main Alerts Page ───────────────────────────────────────────
export default function AlertsPage() {
  const [subs, setSubs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [payModal, setPayModal] = useState({ open: false, sub: null });
  const navigate = useNavigate();

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

  const handleMarkPaid = async (sub) => {
    try {
      const updated = await togglePaid(sub._id);
      setSubs(prev => prev.map(s => s._id === updated._id ? updated : s));
      toast[updated.isPaid ? "success" : "default"](
        updated.isPaid ? `${sub.name} marked as paid! ✅` : `${sub.name} marked as unpaid`,
        { icon: updated.isPaid ? undefined : "↩️" }
      );
    } catch {
      toast.error("Failed to update payment status");
    }
  };

  const handlePaymentSuccess = async (sub) => {
    try {
      const updated = await togglePaid(sub._id);
      setSubs(prev => prev.map(s => s._id === updated._id ? updated : s));
      toast.success(`₹${sub.cost} paid for ${sub.name}! 🎉`);
    } catch {
      toast.error("Failed to record payment");
    }
  };

  const tabs = [
    { id: "all",      label: "All",        emoji: "📋" },
    { id: "critical", label: "Critical",   emoji: "🔴" },
    { id: "warning",  label: "This Week",  emoji: "🟠" },
    { id: "upcoming", label: "This Month", emoji: "🟡" },
    { id: "safe",     label: "Safe",       emoji: "🟢" },
    { id: "paid",     label: "Paid",       emoji: "✅" },
  ];

  const filtered = subs
    .filter(s => {
      if (activeTab === "paid")    return s.isPaid;
      if (activeTab === "all")     return true;
      return getAlertLevel(getDaysLeft(s.renewalDate)) === activeTab;
    })
    .sort((a, b) => getDaysLeft(a.renewalDate) - getDaysLeft(b.renewalDate));

  const urgentCount = subs.filter(s => {
    const d = getDaysLeft(s.renewalDate);
    return d <= 7 && d > 0 && !s.isPaid;
  }).length;

  const urgentCost = subs
    .filter(s => { const d = getDaysLeft(s.renewalDate); return d <= 7 && d > 0 && !s.isPaid; })
    .reduce((sum, s) => sum + s.cost, 0);

  if (loading) return (
    <div className="min-h-screen bg-[#0f0a1e] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border-2"
          style={{ borderColor: "#6366f1", borderTopColor: "transparent" }} />
        <p className="text-sm" style={{ color: "#6b7280" }}>Loading alerts...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0a1e] p-6 relative">
      <div className="fixed inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.06) 0%, transparent 50%)",
      }} />

      <div className="relative z-10">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"
                style={{ background: "linear-gradient(135deg, #fff 0%, #a5b4fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              <FiBell /> Renewal Alerts
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#6b7280" }}>Stay ahead of your subscription renewals</p>
          </div>
          {urgentCount > 0 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", boxShadow: "0 0 20px rgba(239,68,68,0.15)" }}>
              <FiAlertCircle style={{ color: "#f87171" }} />
              <div>
                <p className="text-xs font-bold" style={{ color: "#f87171" }}>{urgentCount} due this week</p>
                <p className="text-xs" style={{ color: "#9ca3af" }}>₹{urgentCost} at risk</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        <SummaryBanner subs={subs} />

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => {
            const count = tab.id === "paid"
              ? subs.filter(s => s.isPaid).length
              : tab.id === "all"
                ? subs.length
                : subs.filter(s => getAlertLevel(getDaysLeft(s.renewalDate)) === tab.id).length;
            const isActive = activeTab === tab.id;
            return (
              <motion.button key={tab.id} onClick={() => setActiveTab(tab.id)}
                whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition duration-200"
                style={isActive ? {
                  background: tab.id === "paid" ? "linear-gradient(135deg, #10b981, #34d399)" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "#fff",
                  boxShadow: tab.id === "paid" ? "0 8px 20px rgba(16,185,129,0.3)" : "0 8px 20px rgba(99,102,241,0.4)",
                } : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#6b7280" }}>
                {tab.emoji} {tab.label}
                <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                      style={isActive ? { background: "rgba(255,255,255,0.2)", color: "#fff" } : { background: "rgba(255,255,255,0.06)", color: "#6b7280" }}>
                  {count}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-6xl mb-4">{activeTab === "paid" ? "💳" : "✅"}</div>
              <h3 className="font-semibold text-lg mb-2 text-white">
                {activeTab === "paid" ? "No payments recorded yet" : "All clear!"}
              </h3>
              <p className="text-sm" style={{ color: "#6b7280" }}>
                {activeTab === "paid" ? "Mark subscriptions as paid or use Pay Now" : "No subscriptions in this category."}
              </p>
            </motion.div>
          ) : (
            <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((sub, i) => (
                <AlertCard key={sub._id} sub={sub} index={i}
                  onMarkPaid={handleMarkPaid}
                  onPayNow={(s) => setPayModal({ open: true, sub: s })} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {urgentCount > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="mt-8 p-4 rounded-2xl flex items-center gap-3"
            style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(99,102,241,0.2)" }}>
            <div className="text-2xl">💡</div>
            <div>
              <p className="text-white text-sm font-semibold">Pro tip: Review subscriptions before renewal</p>
              <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>
                Cancel what you don't use before renewal to avoid charges.{" "}
                <button onClick={() => navigate("/subscriptions")} className="font-semibold transition" style={{ color: "#a5b4fc" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#818cf8"}
                  onMouseLeave={e => e.currentTarget.style.color = "#a5b4fc"}>
                  Manage subscriptions →
                </button>
              </p>
            </div>
          </motion.div>
        )}
      </div>

      <PayNowModal isOpen={payModal.open} onClose={() => setPayModal({ open: false, sub: null })}
        sub={payModal.sub} onPaymentSuccess={handlePaymentSuccess} />
    </div>
  );
}