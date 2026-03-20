import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiShield, FiDatabase, FiLock, FiEye,
  FiTrash2, FiMail, FiChevronRight
} from "react-icons/fi";

const sections = [
  {
    icon: FiDatabase,
    title: "What Data We Collect",
    color: "#6366f1",
    points: [
      "Full name and email address when you register",
      "Subscription details you manually enter (name, cost, renewal date)",
      "Login method — email/password or Google OAuth",
      "Profile preferences such as currency and notification settings",
    ],
  },
  {
    icon: FiEye,
    title: "How We Use Your Data",
    color: "#8b5cf6",
    points: [
      "To display your subscriptions and calculate monthly/yearly spend",
      "To send renewal alert notifications before due dates",
      "To personalise your dashboard and profile settings",
      "We never sell, share, or rent your data to third parties — ever",
    ],
  },
  {
    icon: FiLock,
    title: "Data Storage & Security",
    color: "#a78bfa",
    points: [
      "All data is stored securely in a MongoDB database",
      "Passwords are hashed using bcrypt — we never store plain text",
      "JWT authentication tokens expire automatically after 7 days",
      "All API communications are protected",
    ],
  },
  {
    icon: FiShield,
    title: "Google Login & Firebase",
    color: "#6366f1",
    points: [
      "We only access your name and email address from Google",
      "We never read your Gmail content or any other Google data",
      "Firebase handles Google authentication securely",
      "You can revoke Google access anytime from your Google account settings",
    ],
  },
  {
    icon: FiTrash2,
    title: "Your Rights",
    color: "#8b5cf6",
    points: [
      "You can update your profile information anytime from the Profile page",
      "You can delete your account permanently from the Danger Zone in Profile",
      "All your data is permanently deleted when you delete your account",
      "You can opt out of email notifications from Notification Preferences",
    ],
  },
  {
    icon: FiMail,
    title: "Cookies & Local Storage",
    color: "#a78bfa",
    points: [
      "We use localStorage to store your login token for session management",
      "No tracking cookies or third-party analytics are used",
      "No advertising cookies of any kind",
      "You can clear your localStorage anytime from browser settings",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0f0a1e] relative">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.06) 0%, transparent 50%)",
      }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12">

          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 mb-6 text-xs"
               style={{ color: "#6b7280" }}>
            <Link to="/dashboard" className="hover:text-indigo-400 transition">Home</Link>
            <FiChevronRight className="text-xs" />
            <span style={{ color: "#a5b4fc" }}>Privacy Policy</span>
          </div>

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
               style={{
                 background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))",
                 border: "1px solid rgba(99,102,241,0.3)",
               }}>
            <FiShield className="text-2xl" style={{ color: "#a5b4fc" }} />
          </div>

          <h1 className="text-4xl font-bold mb-3"
              style={{
                background: "linear-gradient(135deg, #fff 0%, #a5b4fc 50%, #c084fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
            Privacy Policy
          </h1>
          <p className="text-sm" style={{ color: "#6b7280" }}>
            Last updated: March 2026 · SubTrack is committed to protecting your privacy.
          </p>

          {/* Intro card */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 p-4 rounded-2xl text-left"
            style={{
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.2)",
            }}>
            <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
              At <span style={{ color: "#a5b4fc" }} className="font-semibold">SubTrack</span>,
              your privacy is our top priority. This policy explains what information we collect,
              how we use it, and the choices you have. We believe in complete transparency —
              no hidden data collection, no selling your information, ever.
            </p>
          </motion.div>
        </motion.div>

        {/* Sections */}
        <div className="space-y-5">
          {sections.map((section, i) => (
            <motion.div key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="relative p-6 rounded-2xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}>
              {/* Top glow */}
              <div className="absolute top-0 left-6 right-6 h-px"
                   style={{ background: `linear-gradient(90deg, transparent, ${section.color}60, transparent)` }} />

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                     style={{ background: `${section.color}20`, border: `1px solid ${section.color}40` }}>
                  <section.icon className="text-base" style={{ color: section.color }} />
                </div>
                <div className="flex-1">
                  <h2 className="text-white font-bold text-base mb-3">{section.title}</h2>
                  <ul className="space-y-2">
                    {section.points.map((point, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm"
                          style={{ color: "#9ca3af" }}>
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                             style={{ background: section.color }} />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 p-6 rounded-2xl text-center"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.08))",
            border: "1px solid rgba(99,102,241,0.25)",
          }}>
          <h3 className="text-white font-bold text-lg mb-2">Questions about your privacy?</h3>
          <p className="text-sm mb-4" style={{ color: "#9ca3af" }}>
            We're always here to help. Reach out to us anytime.
          </p>
          <a href="mailto:support@subtrack.com"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl
                       text-sm font-semibold text-white transition"
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              boxShadow: "0 8px 25px rgba(99,102,241,0.35)",
            }}>
            <FiMail /> support@subtrack.com
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