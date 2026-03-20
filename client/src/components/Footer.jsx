import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiGithub, FiTwitter, FiInstagram, FiMail,
  FiHeart,
  FiLinkedin
} from "react-icons/fi";
import logo from "../assets/logo.jpeg";

const FOOTER_LINKS = {
  Product: [
    { label: "Dashboard",     to: "/dashboard" },
    { label: "Subscriptions", to: "/subscriptions" },
    { label: "Alerts",        to: "/alerts" },
    { label: "Profile",       to: "/profile" },
  ],
  Support: [
    { label: "Help Center",    to: "/help" },
{ label: "Privacy Policy", to: "/privacy-policy" },
  ],
};

const SOCIAL_LINKS = [
  {
    icon: FiGithub,
    href: "https://github.com",
    label: "GitHub",
    color: "#e2e8f0",
  },
  {
    icon: FiLinkedin,
    href: "https://www.linkedin.com/in/ayan-paul-0b63a2336/",
    label: "Twitter",
    color: "#1d9bf0",
  },
  {
    icon: FiInstagram,
    href: "https://www.instagram.com/__.shershaah.__/",
    label: "Instagram",
    color: "#e1306c",
  },
  {
    icon: FiMail,
    href: "mailto:support@subtrack.com",
    label: "Email",
    color: "#a5b4fc",
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="relative mt-auto"
      style={{
        background: "rgba(15,10,30,0.95)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(99,102,241,0.15)",
      }}
    >
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px"
           style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(139,92,246,0.5), transparent)" }} />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* ── Brand Column ── */}
          <div className="md:col-span-2">
            {/* Logo + Name */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0"
                   style={{
                     background: "linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.4))",
                     border: "1px solid rgba(99,102,241,0.3)",
                   }}>
                <img src={logo} alt="SubTrack" className="w-full h-full object-contain p-1" />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-none">SubTrack</p>
                <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>
                  Subscription Manager
                </p>
              </div>
            </div>

            {/* Tagline */}
            <p className="text-sm leading-relaxed mb-5 max-w-xs"
               style={{ color: "#6b7280" }}>
              Never get charged by surprise again. Track all your subscriptions,
              get renewal alerts, and save money every month.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center
                             transition duration-200"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#6b7280",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = social.color;
                    e.currentTarget.style.borderColor = social.color + "50";
                    e.currentTarget.style.background = social.color + "15";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = "#6b7280";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  }}
                  title={social.label}
                >
                  <social.icon className="text-sm" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* ── Links Columns ── */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4"
                  style={{ color: "#a5b4fc" }}>
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm transition duration-200"
                      style={{ color: "#6b7280" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#e2e8f0"}
                      onMouseLeave={e => e.currentTarget.style.color = "#6b7280"}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom Bar ── */}
        <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center
                        justify-between gap-3"
             style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>

          <p className="text-xs flex items-center gap-1.5"
             style={{ color: "#4b5563" }}>
            © {year} SubTrack. Made with
            <FiHeart className="text-red-500 text-xs" style={{ fill: "#ef4444" }} />
            by Ayan Paul
          </p>

          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full animate-pulse"
                 style={{ background: "#34d399" }} />
            <p className="text-xs" style={{ color: "#4b5563" }}>
              All systems operational
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}