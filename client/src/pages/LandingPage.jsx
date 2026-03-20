import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FiBell, FiShield, FiTrendingUp, FiZap, FiArrowRight, FiMenu, FiX, FiStar, FiMail } from "react-icons/fi";
import logo from "../assets/logo.jpeg";

const BRANDS = [
  { name: "Netflix",      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png" },
  { name: "Spotify",      logo: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg" },
  { name: "Amazon Prime", logo: "https://cdn.worldvectorlogo.com/logos/amazon-prime-video-2.svg" },
  { name: "GitHub",       logo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" },
  { name: "YouTube",      logo: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" },
  { name: "Canva",        logo: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Canva_Logo.svg" },
  { name: "Figma",        logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" },
  { name: "Notion",       logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png" },
  { name: "Slack",        logo: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg" },
];

const FEATURES = [
  { icon: FiBell,       title: "Smart Renewal Alerts",  desc: "Get notified 7, 3 and 1 day before every renewal. Never get surprised.",  color: "#6366f1", emoji: "🔔" },
  { icon: FiTrendingUp, title: "Spending Analytics",    desc: "Beautiful charts show where your money goes every month and year.",        color: "#8b5cf6", emoji: "📊" },
  { icon: FiMail,       title: "Gmail Auto-Detection",  desc: "Scan your inbox and automatically detect active subscriptions.",           color: "#a78bfa", emoji: "📧" },
  { icon: FiShield,     title: "Bank-Level Security",   desc: "Your data is encrypted, never sold, and fully under your control.",        color: "#6366f1", emoji: "🔒" },
  { icon: FiZap,        title: "Instant Pay Tracking",  desc: "Pay via UPI or card. Mark subscriptions as paid. Track history.",          color: "#8b5cf6", emoji: "💳" },
  { icon: FiStar,       title: "Rewards & Badges",      desc: "Earn points for good financial habits. Climb the leaderboard.",            color: "#a78bfa", emoji: "🏆" },
];

const STATS = [
  { value: "₹800",  label: "Avg. saved/month", emoji: "💰" },
  { value: "15+",   label: "Apps supported",   emoji: "📱" },
  { value: "100%",  label: "Free forever",     emoji: "🎉" },
  { value: "99.9%", label: "Uptime",           emoji: "⚡" },
];

const STEPS = [
  { step: "01", title: "Create Account",    desc: "Sign up free with email or Google in under 30 seconds.", emoji: "👤", color: "#6366f1" },
  { step: "02", title: "Add Subscriptions", desc: "Add manually or scan Gmail to auto-detect your active subs.", emoji: "📋", color: "#8b5cf6" },
  { step: "03", title: "Get Alerts & Save", desc: "Receive alerts before renewals. Cancel what you don't use.", emoji: "💰", color: "#a78bfa" },
];

const TESTIMONIALS = [
  { name: "Priya Sharma",   role: "Freelance Designer", avatar: "PS", text: "I was paying for 3 apps I forgot about. SubTrack helped me cancel them and save ₹1,200 a month!", stars: 5 },
  { name: "Rahul Mehta",    role: "Software Engineer",  avatar: "RM", text: "The Gmail scan feature is insane. It found 6 subscriptions I didn't even know I had active.", stars: 5 },
  { name: "Sneha Kulkarni", role: "Student",            avatar: "SK", text: "Finally an app that tells me when Netflix is about to charge me. Love the countdown timer!", stars: 5 },
];

function Orb({ style, delay = 0 }) {
  return (
    <motion.div
      animate={{ y: [0, -30, 0], scale: [1, 1.05, 1], opacity: [0.25, 0.5, 0.25] }}
      transition={{ duration: 8, repeat: Infinity, delay, ease: "easeInOut" }}
      className="absolute rounded-full pointer-events-none"
      style={style}
    />
  );
}

function Marquee() {
  return (
    <div
      className="overflow-hidden py-4"
      style={{ maskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)" }}
    >
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="flex gap-5 items-center"
        style={{ width: "max-content" }}
      >
        {[...BRANDS, ...BRANDS].map((brand, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div
              className="w-6 h-6 rounded-md overflow-hidden flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.9)", padding: "3px" }}
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="w-full h-full object-contain"
                onError={e => { e.target.style.display = "none"; }}
              />
            </div>
            <span className="text-sm font-medium whitespace-nowrap" style={{ color: "#9ca3af" }}>
              {brand.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const { scrollYProgress }         = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 768) setMobileMenu(false); };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const navLinks = ["Features", "How It Works", "Testimonials"];

  const gradText = {
    background: "linear-gradient(135deg, #fff, #a5b4fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: "#0a0614" }}>

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <Orb delay={0}   style={{ width: 600, height: 600, top: "-15%",  left: "-10%",  background: "radial-gradient(circle, rgba(99,102,241,0.18), transparent 70%)" }} />
        <Orb delay={3}   style={{ width: 500, height: 500, top: "40%",   right: "-15%", background: "radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)" }} />
        <Orb delay={1.5} style={{ width: 350, height: 350, bottom: "15%",left: "25%",   background: "radial-gradient(circle, rgba(99,102,241,0.1), transparent 70%)" }} />
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
      </div>

      {/* Navbar — always has solid bg when menu is open so content never bleeds through */}
      <motion.nav
        initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300"
        style={{
          background: scrolled || mobileMenu ? "rgba(10,6,20,0.97)" : "transparent",
          backdropFilter: scrolled || mobileMenu ? "blur(20px)" : "none",
          borderBottom: scrolled || mobileMenu ? "1px solid rgba(99,102,241,0.15)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0"
              style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.4))", border: "1px solid rgba(99,102,241,0.4)" }}
            >
              <img src={logo} alt="SubTrack" className="w-full h-full object-contain p-1" />
            </div>
            <span className="font-bold text-lg">SubTrack</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: "#9ca3af" }}>
            {navLinks.map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="hover:text-white transition cursor-pointer"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium px-4 py-2 rounded-xl transition"
              style={{ color: "#9ca3af" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}
            >
              Sign In
            </Link>
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}
                className="text-sm font-bold px-5 py-2.5 rounded-xl text-white"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 6px 20px rgba(99,102,241,0.4)" }}
              >
                Get Started Free
              </motion.button>
            </Link>
          </div>

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden p-2 rounded-xl"
            style={{ background: "rgba(255,255,255,0.06)", color: "#e2e8f0" }}
          >
            {mobileMenu ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile dropdown — lives inside the navbar so it never overlaps page content */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="pt-3 pb-4 space-y-1">
                {navLinks.map(item => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                    onClick={() => setMobileMenu(false)}
                    className="block py-2.5 px-2 text-sm rounded-lg transition hover:text-white"
                    style={{ color: "#9ca3af" }}
                  >
                    {item}
                  </a>
                ))}
                <div className="flex gap-3 pt-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenu(false)}
                    className="flex-1 text-center py-2.5 rounded-xl text-sm font-medium"
                    style={{ background: "rgba(255,255,255,0.06)", color: "#9ca3af" }}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenu(false)}
                    className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero — extra top padding on mobile to clear navbar */}
      <section className="relative z-10 pt-28 sm:pt-32 pb-20 px-6 text-center">
        <motion.div style={{ y: heroY }} className="max-w-4xl mx-auto">

          {/* Badge — now shows Ayan Paul */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8"
            style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc" }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#6366f1" }} />
            Built by Ayan Paul 🚀
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight mb-6"
          >
            <span style={{ background: "linear-gradient(135deg, #fff 0%, #e2e8f0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Never get charged
            </span>
            <br />
            <span style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #c084fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              by surprise again.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: "#9ca3af" }}
          >
            SubTrack tracks all your subscriptions, alerts you before renewal dates,
            and helps you cancel what you don't need — saving you money every month.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
          >
            <Link to="/signup">
              <motion.button
                whileHover={{ y: -3, scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white w-full sm:w-auto"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)", boxShadow: "0 15px 50px rgba(99,102,241,0.45)" }}
              >
                Start for Free <FiArrowRight />
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold w-full sm:w-auto"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "#e2e8f0" }}
              >
                Already have an account
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-3 text-sm"
            style={{ color: "#6b7280" }}
          >
            <div className="flex -space-x-2">
              {["AP", "RM", "SK", "PD", "AK"].map((init, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2"
                  style={{ background: `hsl(${230 + i * 18}, 60%, 50%)`, borderColor: "#0a0614", color: "#fff" }}
                >
                  {init}
                </div>
              ))}
            </div>
            <span>Loved by <strong className="text-white">500+</strong> users</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="text-yellow-400 text-xs" style={{ fill: "#fbbf24" }} />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Marquee */}
      <section className="relative z-10 py-2" id="features">
        <p className="text-center text-xs uppercase tracking-widest mb-3" style={{ color: "#374151" }}>
          Track subscriptions from any service
        </p>
        <Marquee />
      </section>

      {/* Stats */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.1 * i }}
              className="p-5 rounded-2xl text-center"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <p className="text-2xl mb-1">{stat.emoji}</p>
              <p className="text-2xl sm:text-3xl font-black mb-1" style={gradText}>{stat.value}</p>
              <p className="text-xs" style={{ color: "#6b7280" }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black mb-4" style={gradText}>Everything you need</h2>
            <p className="text-base" style={{ color: "#6b7280" }}>Powerful features to take full control of your subscriptions</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.08 * i }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="relative p-6 rounded-2xl overflow-hidden group"
                style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${feat.color}25` }}
              >
                <div className="absolute top-0 left-4 right-4 h-px"
                     style={{ background: `linear-gradient(90deg, transparent, ${feat.color}60, transparent)` }} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                     style={{ background: `radial-gradient(circle at 50% 0%, ${feat.color}08, transparent 70%)` }} />
                <div className="text-3xl mb-4">{feat.emoji}</div>
                <h3 className="text-white font-bold text-base mb-2">{feat.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 py-16 px-6" id="how-it-works">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black mb-4" style={gradText}>3 steps to save money</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.15 * i }}
                className="relative p-6 rounded-2xl text-center"
                style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${step.color}25` }}
              >
                <div className="text-4xl mb-4">{step.emoji}</div>
                <div className="text-xs font-black mb-2 tracking-widest" style={{ color: step.color }}>STEP {step.step}</div>
                <h3 className="text-white font-bold text-base mb-2">{step.title}</h3>
                <p className="text-sm" style={{ color: "#6b7280" }}>{step.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 z-10 text-xl" style={{ color: "#374151" }}>→</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-16 px-6" id="testimonials">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black mb-4" style={gradText}>Loved by users</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.1 * i }}
                className="p-6 rounded-2xl relative overflow-hidden"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="absolute top-0 left-4 right-4 h-px"
                     style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)" }} />
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.stars)].map((_, j) => (
                    <FiStar key={j} className="text-yellow-400 text-sm" style={{ fill: "#fbbf24" }} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "#9ca3af" }}>"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff" }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-xs" style={{ color: "#6b7280" }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative p-10 sm:p-14 rounded-3xl overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))", border: "1px solid rgba(99,102,241,0.25)" }}
          >
            <div className="absolute top-0 left-0 right-0 h-px"
                 style={{ background: "linear-gradient(90deg, transparent, #6366f1, #8b5cf6, transparent)" }} />
            <div className="text-5xl mb-5">🚀</div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4" style={gradText}>Start saving today</h2>
            <p className="text-base mb-8" style={{ color: "#9ca3af" }}>
              Join SubTrack for free. No credit card. No hidden fees. Cancel anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <motion.button
                  whileHover={{ y: -3, scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white w-full sm:w-auto"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 15px 50px rgba(99,102,241,0.45)" }}
                >
                  Create Free Account <FiArrowRight />
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button
                  whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold w-full sm:w-auto"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "#e2e8f0" }}
                >
                  Sign In Instead
                </motion.button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-5 mt-8 flex-wrap">
              {["✅ Free forever", "🔒 Secure", "📧 Gmail scan", "🔔 Smart alerts"].map(item => (
                <span key={item} className="text-xs" style={{ color: "#6b7280" }}>{item}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ color: "#374151" }}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg overflow-hidden" style={{ background: "rgba(99,102,241,0.3)" }}>
              <img src={logo} alt="SubTrack" className="w-full h-full object-contain p-0.5" />
            </div>
            <span>© 2026 SubTrack · Made with ❤️ by Ayan Paul</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-white transition">Login</Link>
            <Link to="/signup" className="hover:text-white transition">Sign Up</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}