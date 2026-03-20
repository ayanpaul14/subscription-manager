import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiHelpCircle, FiChevronDown, FiChevronRight,
  FiUser, FiList, FiBell, FiCreditCard,
  FiSettings, FiMail, FiSearch
} from "react-icons/fi";

// ── FAQ Data ───────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: "getting-started",
    icon: FiUser,
    title: "Getting Started",
    color: "#6366f1",
    faqs: [
      {
        q: "How do I create an account?",
        a: "Click 'Create one free →' on the login page. Fill in your name, email and password, then click 'Create Free Account'. You'll be redirected to the dashboard immediately.",
      },
      {
        q: "Can I sign in with Google?",
        a: "Yes! Click 'Continue with Google' on the login or signup page. A Google popup will appear — select your account and you'll be signed in instantly. No password needed.",
      },
      {
        q: "Is SubTrack free to use?",
        a: "Yes, SubTrack is completely free. There are no hidden charges, no premium plans, and no credit card required to sign up.",
      },
      {
        q: "What devices can I use SubTrack on?",
        a: "SubTrack works on any device with a browser — desktop, laptop, tablet, or mobile. It's fully responsive and works on Chrome, Edge, Firefox, and Safari.",
      },
    ],
  },
  {
    id: "subscriptions",
    icon: FiList,
    title: "Managing Subscriptions",
    color: "#8b5cf6",
    faqs: [
      {
        q: "How do I add a subscription?",
        a: "Go to the Subscriptions page and click 'Add Subscription'. Fill in the service name, monthly cost, renewal date, and category. Click 'Add Subscription' to save.",
      },
      {
        q: "What is the Gmail Scan feature?",
        a: "Gmail Scan automatically detects your active subscriptions by scanning your inbox for receipts from Netflix, Spotify, Amazon, and more. Click 'Scan Gmail' on the Subscriptions page to use it.",
      },
      {
        q: "How do I edit or delete a subscription?",
        a: "On each subscription card, click the ✏️ edit icon to modify details, or the 🗑️ delete icon to remove it. A confirmation popup will appear before deleting.",
      },
      {
        q: "Can I filter and sort my subscriptions?",
        a: "Yes! Use the filter dropdown to show subscriptions by category, and the sort dropdown to sort by name, cost, or renewal date. You can also switch between grid and list views.",
      },
    ],
  },
  {
    id: "alerts",
    icon: FiBell,
    title: "Alerts & Notifications",
    color: "#a78bfa",
    faqs: [
      {
        q: "How do renewal alerts work?",
        a: "SubTrack automatically calculates how many days are left before each subscription renews. Alerts are color-coded: 🔴 Critical (≤3 days), 🟠 Warning (≤7 days), 🟡 Upcoming (≤14 days), 🟢 Safe.",
      },
      {
        q: "What does the countdown timer show?",
        a: "Each alert card shows a live countdown timer with days, hours, minutes, and seconds remaining until the renewal date. It updates every second in real time.",
      },
      {
        q: "How do I mark a subscription as paid?",
        a: "On the Alerts page, each subscription card has a green 'Mark as Paid' button. Click it to mark it paid — the card will show a ✅ Paid badge. You can undo this anytime.",
      },
      {
        q: "How do I change notification preferences?",
        a: "Go to Profile → Notification Preferences. You can toggle email alerts, push notifications, weekly reports, 3-day advance alerts, and same-day alerts on or off.",
      },
    ],
  },
  {
    id: "payments",
    icon: FiCreditCard,
    title: "Payments",
    color: "#6366f1",
    faqs: [
      {
        q: "How does Pay Now work?",
        a: "On the Alerts page, click 'Pay Now' on any subscription card. A payment modal opens where you can pay via UPI (Google Pay, PhonePe, Paytm, BHIM) or enter card details.",
      },
      {
        q: "What payment methods are supported?",
        a: "SubTrack supports UPI apps (Google Pay, PhonePe, Paytm, BHIM UPI), UPI ID entry, and credit/debit cards (Visa, Mastercard, RuPay, Amex).",
      },
      {
        q: "Does SubTrack charge my subscriptions automatically?",
        a: "No. SubTrack is a tracking and alert tool only. It never charges anything automatically. Pay Now is a manual payment feature for your convenience.",
      },
      {
        q: "Is my payment information stored?",
        a: "No. We never store your card or UPI details. Payment information is only used during the transaction and is never saved to our servers.",
      },
    ],
  },
  {
    id: "account",
    icon: FiSettings,
    title: "Account & Profile",
    color: "#8b5cf6",
    faqs: [
      {
        q: "How do I update my profile?",
        a: "Go to Profile page and click 'Edit Profile'. You can update your name, email, phone number, and preferred currency. Click 'Save Changes' when done.",
      },
      {
        q: "How do I change my password?",
        a: "Go to Profile → Change Password section. Enter your current password, then your new password twice. Click 'Update Password' to save.",
      },
      {
        q: "How do I delete my account?",
        a: "Go to Profile → Danger Zone → Delete Account. Type 'DELETE' in the confirmation box and click 'Delete Forever'. This permanently removes all your data.",
      },
      {
        q: "What happens to my data when I delete my account?",
        a: "All your data — profile, subscriptions, and settings — is permanently and irreversibly deleted from our database. This cannot be undone.",
      },
    ],
  },
];

// ── FAQ Item ───────────────────────────────────────────────────
function FaqItem({ faq, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4
                   text-left transition duration-200"
        style={{
          background: open ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.03)",
        }}
        onMouseEnter={e => !open && (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
        onMouseLeave={e => !open && (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
      >
        <span className="text-sm font-semibold pr-4"
              style={{ color: open ? "#a5b4fc" : "#e2e8f0" }}>
          {faq.q}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
          className="flex-shrink-0">
          <FiChevronDown className="text-base" style={{ color: open ? "#a5b4fc" : "#6b7280" }} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-5 py-4"
                 style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
                {faq.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main Help Center ───────────────────────────────────────────
export default function HelpCenterPage() {
  const [search, setSearch]         = useState("");
  const [activeCategory, setActive] = useState("getting-started");

  const activeData = CATEGORIES.find(c => c.id === activeCategory);

  const filteredFaqs = search.trim()
    ? CATEGORIES.flatMap(c => c.faqs).filter(
        f =>
          f.q.toLowerCase().includes(search.toLowerCase()) ||
          f.a.toLowerCase().includes(search.toLowerCase())
      )
    : activeData?.faqs || [];

  return (
    <div className="min-h-screen bg-[#0f0a1e] relative">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.06) 0%, transparent 50%)",
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10">

          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 mb-6 text-xs"
               style={{ color: "#6b7280" }}>
            <Link to="/dashboard" className="hover:text-indigo-400 transition">Home</Link>
            <FiChevronRight className="text-xs" />
            <span style={{ color: "#a5b4fc" }}>Help Center</span>
          </div>

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
               style={{
                 background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))",
                 border: "1px solid rgba(99,102,241,0.3)",
               }}>
            <FiHelpCircle className="text-2xl" style={{ color: "#a5b4fc" }} />
          </div>

          <h1 className="text-4xl font-bold mb-3"
              style={{
                background: "linear-gradient(135deg, #fff 0%, #a5b4fc 50%, #c084fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
            Help Center
          </h1>
          <p className="text-sm" style={{ color: "#6b7280" }}>
            Find answers to common questions about SubTrack
          </p>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-md mx-auto mt-6">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-base pointer-events-none"
                      style={{ color: "#6366f1" }} />
            <input
              type="text"
              placeholder="Search for answers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-white
                         placeholder-gray-600 outline-none transition"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              onFocus={e => {
                e.target.style.borderColor = "rgba(99,102,241,0.5)";
                e.target.style.background = "rgba(99,102,241,0.07)";
              }}
              onBlur={e => {
                e.target.style.borderColor = "rgba(255,255,255,0.1)";
                e.target.style.background = "rgba(255,255,255,0.05)";
              }}
            />
          </motion.div>
        </motion.div>

        {/* Main Layout */}
        {search.trim() ? (
          /* Search Results */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-sm mb-4" style={{ color: "#6b7280" }}>
              {filteredFaqs.length} result{filteredFaqs.length !== 1 ? "s" : ""} for "
              <span style={{ color: "#a5b4fc" }}>{search}</span>"
            </p>
            {filteredFaqs.length > 0 ? (
              <div className="space-y-2">
                {filteredFaqs.map((faq, i) => (
                  <FaqItem key={i} faq={faq} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">🔍</p>
                <p className="text-white font-semibold mb-1">No results found</p>
                <p className="text-sm" style={{ color: "#6b7280" }}>
                  Try a different search term or browse the categories below
                </p>
                <button onClick={() => setSearch("")}
                  className="mt-4 text-sm font-semibold transition"
                  style={{ color: "#6366f1" }}>
                  Clear search
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* Category sidebar */}
            <div className="space-y-2">
              {CATEGORIES.map((cat, i) => (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  onClick={() => setActive(cat.id)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                             text-sm font-medium text-left transition duration-200"
                  style={activeCategory === cat.id ? {
                    background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))",
                    border: `1px solid ${cat.color}40`,
                    color: "#a5b4fc",
                  } : {
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    color: "#6b7280",
                  }}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                       style={{ background: `${cat.color}20` }}>
                    <cat.icon className="text-sm" style={{ color: cat.color }} />
                  </div>
                  {cat.title}
                </motion.button>
              ))}
            </div>

            {/* FAQ content */}
            <div className="lg:col-span-3">
              {activeData && (
                <motion.div key={activeCategory}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Category header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                         style={{ background: `${activeData.color}20`, border: `1px solid ${activeData.color}40` }}>
                      <activeData.icon className="text-base" style={{ color: activeData.color }} />
                    </div>
                    <h2 className="text-white font-bold text-xl">{activeData.title}</h2>
                  </div>

                  {/* FAQ items */}
                  <div className="space-y-2">
                    {activeData.faqs.map((faq, i) => (
                      <FaqItem key={i} faq={faq} index={i} />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* Still need help */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 rounded-2xl text-center"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.08))",
            border: "1px solid rgba(99,102,241,0.25)",
          }}>
          <h3 className="text-white font-bold text-lg mb-2">Still need help?</h3>
          <p className="text-sm mb-4" style={{ color: "#9ca3af" }}>
            Can't find what you're looking for? Our support team is ready to help.
          </p>
          <a href="mailto:support@subtrack.com"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl
                       text-sm font-semibold text-white transition"
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              boxShadow: "0 8px 25px rgba(99,102,241,0.35)",
            }}>
            <FiMail /> Contact Support
          </a>
        </motion.div>

        {/* Back link */}
        <div className="text-center mt-8">
          <Link to="/dashboard"
            className="text-sm transition"
            style={{ color: "#6b7280" }}
            onMouseEnter={e => e.currentTarget.style.color = "#a5b4fc"}
            onMouseLeave={e => e.currentTarget.style.color = "#6b7280"}>
            ← Back to Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}