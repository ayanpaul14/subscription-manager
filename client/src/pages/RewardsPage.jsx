import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiAward, FiStar, FiZap, FiTrendingUp,
  FiCheckCircle, FiLock, FiTarget
} from "react-icons/fi";

// ── Demo Data ──────────────────────────────────────────────────
const USER_STATS = {
  points:      1250,
  level:       4,
  levelName:   "Budget Master",
  streak:      7,
  totalSaved:  4800,
  subsTracked: 6,
  paidOnTime:  5,
};

const LEVELS = [
  { level: 1, name: "Beginner",       min: 0,    max: 200,  color: "#9ca3af", emoji: "🌱" },
  { level: 2, name: "Tracker",        min: 200,  max: 500,  color: "#34d399", emoji: "📊" },
  { level: 3, name: "Saver",          min: 500,  max: 1000, color: "#60a5fa", emoji: "💰" },
  { level: 4, name: "Budget Master",  min: 1000, max: 1500, color: "#a78bfa", emoji: "🎯" },
  { level: 5, name: "Finance Pro",    min: 1500, max: 2500, color: "#f59e0b", emoji: "⚡" },
  { level: 6, name: "SubTrack Elite", min: 2500, max: 5000, color: "#f87171", emoji: "👑" },
];

const BADGES = [
  { id: 1, name: "First Sub",     desc: "Added your first subscription",   emoji: "🎉", earned: true,  points: 50   },
  { id: 2, name: "Alert Hero",    desc: "Checked alerts 7 days in a row",  emoji: "🔔", earned: true,  points: 100  },
  { id: 3, name: "On Time Payer", desc: "Paid 5 subscriptions before due", emoji: "✅", earned: true,  points: 150  },
  { id: 4, name: "Gmail Scanner", desc: "Used Gmail scan to import subs",  emoji: "📧", earned: true,  points: 200  },
  { id: 5, name: "Big Saver",     desc: "Saved ₹5,000 by cancelling subs", emoji: "💰", earned: false, points: 300  },
  { id: 6, name: "Sub Collector", desc: "Track 10+ subscriptions",         emoji: "📦", earned: false, points: 200  },
  { id: 7, name: "Streak Master", desc: "Maintain a 30-day login streak",  emoji: "🔥", earned: false, points: 500  },
  { id: 8, name: "Elite Tracker", desc: "Reach Level 6 — SubTrack Elite",  emoji: "👑", earned: false, points: 1000 },
];

const CHALLENGES = [
  { id: 1, title: "Pay on Time",   desc: "Mark 3 subs as paid before renewal", emoji: "💳", progress: 2, total: 3, points: 100, color: "#6366f1", completed: false },
  { id: 2, title: "7-Day Streak",  desc: "Log in every day for 7 days",        emoji: "🔥", progress: 7, total: 7, points: 150, color: "#f59e0b", completed: true  },
  { id: 3, title: "Budget Audit",  desc: "Review all your subscriptions",       emoji: "📋", progress: 4, total: 6, points: 200, color: "#8b5cf6", completed: false },
  { id: 4, title: "Gmail Import",  desc: "Scan Gmail to detect 3+ subs",        emoji: "📧", progress: 6, total: 3, points: 250, color: "#10b981", completed: true  },
];

const LEADERBOARD = [
  { rank: 1, name: "Priya S.",  points: 3200, level: "SubTrack Elite", emoji: "👑", isYou: false },
  { rank: 2, name: "Rahul M.",  points: 2850, level: "SubTrack Elite", emoji: "👑", isYou: false },
  { rank: 3, name: "Sneha K.",  points: 2100, level: "Finance Pro",    emoji: "⚡", isYou: false },
  { rank: 4, name: "Ayan Paul", points: 1250, level: "Budget Master",  emoji: "🎯", isYou: true  },
  { rank: 5, name: "Arjun D.",  points: 980,  level: "Saver",          emoji: "💰", isYou: false },
];

const STORE = [
  { id: 1, name: "Premium Theme",    desc: "Unlock dark gold theme",     cost: 500, emoji: "🎨", owned: false },
  { id: 2, name: "Extra Alerts",     desc: "Get alerts 14 days before",  cost: 300, emoji: "⏰", owned: true  },
  { id: 3, name: "Custom Avatar",    desc: "Personalise your profile",   cost: 200, emoji: "👤", owned: false },
  { id: 4, name: "Priority Support", desc: "Faster support replies",     cost: 800, emoji: "⚡", owned: false },
];

const cardStyle = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.08)",
};

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [redeemMsg, setRedeemMsg] = useState(null);
  const [points, setPoints]       = useState(USER_STATS.points);

  const tabs = [
    { id: "overview",    label: "Overview",    emoji: "🏠" },
    { id: "badges",      label: "Badges",      emoji: "🏅" },
    { id: "challenges",  label: "Challenges",  emoji: "⚡" },
    { id: "leaderboard", label: "Leaderboard", emoji: "🏆" },
    { id: "store",       label: "Store",       emoji: "🎁" },
  ];

  const currentLevel = LEVELS.find(l => l.level === USER_STATS.level);
  const progressPct  = ((points - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100;

  const handleRedeem = (item) => {
    if (item.owned) return;
    if (points < item.cost) {
      setRedeemMsg({ type: "error", text: `Need ${item.cost - points} more points!` });
    } else {
      setPoints(p => p - item.cost);
      setRedeemMsg({ type: "success", text: `🎉 ${item.name} unlocked!` });
    }
    setTimeout(() => setRedeemMsg(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0f0a1e] relative">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(245,158,11,0.06) 0%, transparent 50%)",
      }} />

      <div className="relative z-10 px-4 sm:px-6 py-5 max-w-5xl mx-auto">

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #fff 0%, #fbbf24 50%, #f59e0b 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
              <FiAward /> Rewards
            </h1>
            <p className="text-xs sm:text-sm mt-0.5" style={{ color: "#6b7280" }}>
              Earn points, unlock badges, climb the leaderboard
            </p>
          </div>

          {/* Points badge */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
               style={{
                 background: "rgba(245,158,11,0.12)",
                 border: "1px solid rgba(245,158,11,0.3)",
               }}>
            <FiStar className="text-yellow-400 text-sm" />
            <div>
              <p className="text-yellow-400 font-bold text-base sm:text-lg leading-none">
                {points.toLocaleString()}
              </p>
              <p className="text-xs" style={{ color: "#6b7280" }}>Points</p>
            </div>
          </div>
        </motion.div>

        {/* ── Tabs — scrollable on mobile ── */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1"
             style={{ scrollbarWidth: "none" }}>
          {tabs.map(tab => (
            <motion.button key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs
                         sm:text-sm font-semibold whitespace-nowrap transition duration-200
                         flex-shrink-0"
              style={activeTab === tab.id ? {
                background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                color: "#0f0a1e",
                boxShadow: "0 6px 16px rgba(245,158,11,0.4)",
              } : {
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#6b7280",
              }}>
              <span>{tab.emoji}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">

            {/* Level Card */}
            <div className="relative p-5 rounded-2xl overflow-hidden"
                 style={{
                   background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(99,102,241,0.1))",
                   border: "1px solid rgba(245,158,11,0.25)",
                 }}>
              <div className="absolute top-0 left-0 right-0 h-px"
                   style={{ background: "linear-gradient(90deg, transparent, #f59e0b, transparent)" }} />

              {/* Top row */}
              <div className="flex items-start justify-between mb-4 gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl">{currentLevel.emoji}</span>
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-0.5"
                       style={{ color: "#6b7280" }}>Current Level</p>
                    <h2 className="text-lg sm:text-xl font-bold text-white">
                      {currentLevel.name}
                    </h2>
                    <p className="text-xs" style={{ color: "#9ca3af" }}>
                      Level {USER_STATS.level} · {points} / {currentLevel.max} pts
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs" style={{ color: "#6b7280" }}>Next</p>
                  <p className="text-sm font-bold" style={{ color: "#fbbf24" }}>
                    {LEVELS[USER_STATS.level]?.name}
                  </p>
                  <p className="text-xs" style={{ color: "#6b7280" }}>
                    {currentLevel.max - points} pts away
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="flex justify-between text-xs mb-1.5" style={{ color: "#6b7280" }}>
                <span>{currentLevel.min}</span>
                <span style={{ color: "#fbbf24" }}>{Math.round(progressPct)}%</span>
                <span>{currentLevel.max}</span>
              </div>
              <div className="w-full h-2.5 rounded-full overflow-hidden"
                   style={{ background: "rgba(255,255,255,0.08)" }}>
                <motion.div initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #f59e0b, #fbbf24)" }}
                />
              </div>
            </div>

            {/* Stats — 2 cols on mobile, 4 on desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: "Day Streak",   value: `${USER_STATS.streak} 🔥`, color: "#f59e0b", icon: FiZap },
                { label: "Total Saved",  value: `₹${USER_STATS.totalSaved.toLocaleString()}`, color: "#34d399", icon: FiTrendingUp },
                { label: "Subs Tracked", value: USER_STATS.subsTracked,    color: "#6366f1", icon: FiTarget },
                { label: "Paid on Time", value: USER_STATS.paidOnTime,     color: "#a78bfa", icon: FiCheckCircle },
              ].map((stat, i) => (
                <motion.div key={stat.label}
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i }}
                  className="relative p-4 rounded-2xl overflow-hidden"
                  style={cardStyle}>
                  <div className="absolute top-0 left-4 right-4 h-px"
                       style={{ background: `linear-gradient(90deg, transparent, ${stat.color}60, transparent)` }} />
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2"
                       style={{ background: `${stat.color}20`, border: `1px solid ${stat.color}40` }}>
                    <stat.icon className="text-xs" style={{ color: stat.color }} />
                  </div>
                  <p className="text-lg sm:text-xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Level roadmap */}
            <div className="p-5 rounded-2xl" style={cardStyle}>
              <h3 className="text-white font-bold mb-3 flex items-center gap-2 text-sm">
                <FiTrendingUp style={{ color: "#f59e0b" }} /> Level Roadmap
              </h3>
              <div className="space-y-2">
                {LEVELS.map(lvl => (
                  <div key={lvl.level}
                    className="flex items-center gap-3 p-2.5 rounded-xl"
                    style={{
                      background: lvl.level === USER_STATS.level
                        ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${lvl.level === USER_STATS.level
                        ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.04)"}`,
                    }}>
                    <span className="text-lg">{lvl.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate"
                         style={{ color: lvl.level <= USER_STATS.level ? "#e2e8f0" : "#4b5563" }}>
                        Lv.{lvl.level} — {lvl.name}
                      </p>
                      <p className="text-xs" style={{ color: "#4b5563" }}>
                        {lvl.min}–{lvl.max} pts
                      </p>
                    </div>
                    {lvl.level < USER_STATS.level && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0"
                            style={{ background: "rgba(52,211,153,0.15)", color: "#34d399" }}>
                        ✅
                      </span>
                    )}
                    {lvl.level === USER_STATS.level && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0"
                            style={{ background: "rgba(245,158,11,0.2)", color: "#fbbf24" }}>
                        Now
                      </span>
                    )}
                    {lvl.level > USER_STATS.level && (
                      <FiLock className="text-xs flex-shrink-0" style={{ color: "#4b5563" }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── BADGES ── */}
        {activeTab === "badges" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* 2 cols on mobile, 4 on desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {BADGES.map((badge, i) => (
                <motion.div key={badge.id}
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i }}
                  className="relative p-4 rounded-2xl text-center overflow-hidden"
                  style={{
                    ...cardStyle,
                    opacity: badge.earned ? 1 : 0.5,
                    filter: badge.earned ? "none" : "grayscale(50%)",
                  }}>
                  {badge.earned && (
                    <div className="absolute top-0 left-4 right-4 h-px"
                         style={{ background: "linear-gradient(90deg, transparent, #fbbf2460, transparent)" }} />
                  )}
                  <div className="text-3xl mb-2">{badge.emoji}</div>
                  <h3 className="font-bold text-xs mb-1"
                      style={{ color: badge.earned ? "#e2e8f0" : "#4b5563" }}>
                    {badge.name}
                  </h3>
                  <p className="text-xs mb-2 leading-relaxed" style={{ color: "#6b7280" }}>
                    {badge.desc}
                  </p>
                  <div className="flex items-center justify-center gap-1">
                    <FiStar className="text-xs" style={{ color: badge.earned ? "#fbbf24" : "#4b5563" }} />
                    <span className="text-xs font-bold"
                          style={{ color: badge.earned ? "#fbbf24" : "#4b5563" }}>
                      +{badge.points}
                    </span>
                  </div>
                  {badge.earned && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full
                                    flex items-center justify-center"
                         style={{ background: "rgba(52,211,153,0.2)", border: "1px solid #34d399" }}>
                      <FiCheckCircle className="text-xs" style={{ color: "#34d399", fontSize: "8px" }} />
                    </div>
                  )}
                  {!badge.earned && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl"
                         style={{ background: "rgba(15,10,30,0.25)" }}>
                      <FiLock className="text-lg" style={{ color: "#4b5563" }} />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-2xl text-center"
                 style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)" }}>
              <p className="text-xs sm:text-sm" style={{ color: "#9ca3af" }}>
                🏅 <span className="font-bold" style={{ color: "#fbbf24" }}>
                  {BADGES.filter(b => b.earned).length}
                </span> / {BADGES.length} badges earned
              </p>
            </div>
          </motion.div>
        )}

        {/* ── CHALLENGES ── */}
        {activeTab === "challenges" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {CHALLENGES.map((ch, i) => (
              <motion.div key={ch.id}
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="relative p-4 sm:p-5 rounded-2xl overflow-hidden"
                style={{
                  ...cardStyle,
                  border: ch.completed
                    ? "1px solid rgba(52,211,153,0.3)"
                    : `1px solid ${ch.color}30`,
                }}>
                <div className="absolute top-0 left-6 right-6 h-px"
                     style={{ background: `linear-gradient(90deg, transparent, ${ch.color}60, transparent)` }} />

                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center
                                  text-xl flex-shrink-0"
                       style={{ background: `${ch.color}15`, border: `1px solid ${ch.color}30` }}>
                    {ch.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-white font-bold text-sm">{ch.title}</h3>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <FiStar className="text-xs text-yellow-400" />
                        <span className="text-xs font-bold text-yellow-400">+{ch.points}</span>
                      </div>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{ch.desc}</p>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full overflow-hidden mb-1"
                     style={{ background: "rgba(255,255,255,0.06)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((ch.progress / ch.total) * 100, 100)}%` }}
                    transition={{ duration: 0.8, delay: 0.1 * i }}
                    className="h-full rounded-full"
                    style={{ background: ch.completed ? "#34d399" : ch.color }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs" style={{ color: "#6b7280" }}>
                    {Math.min(ch.progress, ch.total)}/{ch.total} done
                  </p>
                  {ch.completed && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                          style={{ background: "rgba(52,211,153,0.15)", color: "#34d399" }}>
                      ✅ Complete
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ── LEADERBOARD ── */}
        {activeTab === "leaderboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            <p className="text-xs sm:text-sm mb-3" style={{ color: "#6b7280" }}>
              Top SubTrack users this month 🏆
            </p>
            {LEADERBOARD.map((entry, i) => (
              <motion.div key={entry.rank}
                initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl"
                style={{
                  background: entry.isYou
                    ? "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))"
                    : "rgba(255,255,255,0.04)",
                  border: entry.isYou
                    ? "1px solid rgba(99,102,241,0.35)"
                    : "1px solid rgba(255,255,255,0.07)",
                }}>

                {/* Rank */}
                <div className="w-9 h-9 rounded-xl flex items-center justify-center
                                font-bold text-base flex-shrink-0"
                     style={{
                       background: entry.rank === 1 ? "linear-gradient(135deg, #f59e0b, #fbbf24)"
                                 : entry.rank === 2 ? "linear-gradient(135deg, #9ca3af, #d1d5db)"
                                 : entry.rank === 3 ? "linear-gradient(135deg, #b45309, #d97706)"
                                 : "rgba(255,255,255,0.06)",
                       color: entry.rank <= 3 ? "#0f0a1e" : "#6b7280",
                     }}>
                  {entry.rank <= 3 ? ["🥇","🥈","🥉"][entry.rank - 1] : `#${entry.rank}`}
                </div>

                {/* Avatar */}
                <div className="w-9 h-9 rounded-full flex items-center justify-center
                                text-xs font-bold flex-shrink-0"
                     style={{
                       background: entry.isYou
                         ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                         : "rgba(255,255,255,0.08)",
                       color: "#fff",
                     }}>
                  {entry.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="font-semibold text-sm truncate"
                       style={{ color: entry.isYou ? "#a5b4fc" : "#e2e8f0" }}>
                      {entry.name}
                    </p>
                    {entry.isYou && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full flex-shrink-0"
                            style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc" }}>
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-xs" style={{ color: "#6b7280" }}>
                    {entry.emoji} {entry.level}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-sm" style={{ color: "#fbbf24" }}>
                    {entry.points.toLocaleString()}
                  </p>
                  <p className="text-xs" style={{ color: "#6b7280" }}>pts</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ── STORE ── */}
        {activeTab === "store" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            <AnimatePresence>
              {redeemMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-4 p-3 rounded-xl text-center text-sm font-semibold"
                  style={redeemMsg.type === "success" ? {
                    background: "rgba(52,211,153,0.15)",
                    border: "1px solid rgba(52,211,153,0.3)",
                    color: "#34d399",
                  } : {
                    background: "rgba(239,68,68,0.15)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: "#f87171",
                  }}>
                  {redeemMsg.text}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between mb-4">
              <p className="text-xs sm:text-sm" style={{ color: "#6b7280" }}>
                Spend points on exclusive rewards
              </p>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                   style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)" }}>
                <FiStar className="text-yellow-400 text-xs" />
                <span className="text-sm font-bold text-yellow-400">{points}</span>
              </div>
            </div>

            {/* 1 col on mobile, 2 on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STORE.map((item, i) => (
                <motion.div key={item.id}
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="relative p-4 rounded-2xl overflow-hidden"
                  style={cardStyle}>
                  <div className="absolute top-0 left-4 right-4 h-px"
                       style={{ background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.4), transparent)" }} />

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center
                                    text-2xl flex-shrink-0"
                         style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
                      {item.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-sm">{item.name}</h3>
                      <p className="text-xs" style={{ color: "#6b7280" }}>{item.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <FiStar className="text-yellow-400 text-xs" />
                      <span className="text-sm font-bold text-yellow-400">{item.cost} pts</span>
                    </div>
                    <motion.button
                      onClick={() => handleRedeem(item)}
                      whileHover={{ y: -1 }} whileTap={{ scale: 0.96 }}
                      disabled={item.owned}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold transition"
                      style={item.owned ? {
                        background: "rgba(52,211,153,0.15)",
                        border: "1px solid rgba(52,211,153,0.3)",
                        color: "#34d399",
                        cursor: "default",
                      } : points >= item.cost ? {
                        background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                        color: "#0f0a1e",
                        boxShadow: "0 4px 15px rgba(245,158,11,0.3)",
                      } : {
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#4b5563",
                        cursor: "not-allowed",
                      }}>
                      {item.owned ? "✅ Owned" : points >= item.cost ? "Redeem" : "Not enough"}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-5 p-3 rounded-2xl text-center"
                 style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.2)" }}>
              <p className="text-xs sm:text-sm" style={{ color: "#9ca3af" }}>
                💡 Earn more points by completing{" "}
                <button onClick={() => setActiveTab("challenges")}
                  className="font-semibold transition"
                  style={{ color: "#a5b4fc" }}>
                  challenges →
                </button>
              </p>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}