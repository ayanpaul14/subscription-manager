import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";
import { signInWithGoogle } from "../utils/firebase";
import {
  FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle
} from "react-icons/fi";
import logo from "../assets/logo.jpeg";

// ── Validation ─────────────────────────────────────────────────
const schema = yup.object({
  email:    yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Min 6 characters").required("Password is required"),
});

// ── Floating Bubbles ───────────────────────────────────────────
const bubbles = [
  { w: 300, h: 300, top: "-10%", left: "-5%",  delay: 0   },
  { w: 200, h: 200, top: "60%",  left: "70%",  delay: 1   },
  { w: 150, h: 150, top: "30%",  left: "80%",  delay: 2   },
  { w: 250, h: 250, top: "70%",  left: "-8%",  delay: 0.5 },
  { w: 120, h: 120, top: "10%",  left: "55%",  delay: 1.5 },
];

export default function LoginPage() {
  const [showPass, setShowPass]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login }                   = useAuth();
  const navigate                    = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  // ── Email/Password Login ───────────────────────────────────
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/login", data);
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name?.split(" ")[0]}! 👋`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Google Login ───────────────────────────────────────────
  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      const { user } = await signInWithGoogle();

      const res = await api.post("/auth/google", {
        name:  user.name,
        email: user.email,
        uid:   user.uid,
        photo: user.photo,
      });

      login(res.data.user, res.data.token);
      toast.success(`Welcome, ${res.data.user.name?.split(" ")[0]}! 🎉`);
      navigate("/dashboard");
    } catch (err) {
      console.error("Google login error:", err);
      toast.error("Google login failed. Try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const inputClass = (hasError) =>
    `w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white
     placeholder-gray-600 outline-none transition duration-200
     ${hasError
       ? "border border-red-500/60 bg-red-500/5"
       : "border border-white/10 bg-white/5 focus:border-indigo-500/60 focus:bg-indigo-500/5"
     }`;

  return (
    <div className="min-h-screen relative flex items-center justify-center
                    overflow-hidden bg-[#0f0a1e]">

      {/* ── Background ── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.3) 0%, transparent 60%), radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.15) 0%, transparent 70%)",
        }} />
        {bubbles.map((b, i) => (
          <motion.div key={i}
            animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 6 + i, repeat: Infinity, delay: b.delay, ease: "easeInOut" }}
            className="absolute rounded-full"
            style={{
              width: b.w, height: b.h, top: b.top, left: b.left,
              background: "radial-gradient(circle, rgba(99,102,241,0.15), transparent)",
              border: "1px solid rgba(99,102,241,0.1)",
            }}
          />
        ))}
      </div>

      {/* ── Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="relative p-8 rounded-3xl overflow-hidden" style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(30px)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}>

          {/* Top glow */}
          <div className="absolute top-0 left-0 right-0 h-px"
               style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)" }} />

          {/* ── Logo + Title ── */}
          <div className="text-center mb-7">
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16
                         rounded-2xl mb-4 overflow-hidden shadow-lg"
              style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))",
                border: "1px solid rgba(99,102,241,0.3)",
              }}
            >
              <img src={logo} alt="SubTrack" className="w-12 h-12 object-contain" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold mb-1"
              style={{
                background: "linear-gradient(135deg, #fff 0%, #a5b4fc 50%, #c084fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
              Welcome Back
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }} className="text-gray-400 text-sm">
              Never get charged by surprise again.
            </motion.p>
          </div>

          {/* ── Google Button ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <motion.button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 rounded-xl text-sm font-semibold
                         flex items-center justify-center gap-3 transition duration-200
                         disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#e2e8f0",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
              }}
            >
              {googleLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor"
                            strokeWidth="3" strokeDasharray="30" strokeDashoffset="10" />
                  </svg>
                  Connecting to Google...
                </>
              ) : (
                <>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                    alt="Google" className="w-5 h-5"
                  />
                  Continue with Google
                </>
              )}
            </motion.button>
          </motion.div>

          {/* ── Divider ── */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            <span className="text-xs" style={{ color: "#4b5563" }}>or sign in with email</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* ── Email/Password Form ── */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

            {/* Email */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}>
              <label className="block text-xs font-semibold text-gray-400
                                uppercase tracking-widest mb-2">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2
                                   text-indigo-400 text-base pointer-events-none" />
                <input type="email" placeholder="you@example.com"
                  {...register("email")}
                  className={inputClass(errors.email)} />
              </div>
              {errors.email && (
                <p className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5">
                  <FiAlertCircle /> {errors.email.message}
                </p>
              )}
            </motion.div>

            {/* Password */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-400
                                  uppercase tracking-widest">Password</label>
                <Link to="/forgot-password"
                  className="text-xs font-medium transition"
                  style={{ color: "#6366f1" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#a5b4fc"}
                  onMouseLeave={e => e.currentTarget.style.color = "#6366f1"}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2
                                   text-indigo-400 text-base pointer-events-none" />
                <input type={showPass ? "text" : "password"} placeholder="••••••••"
                  {...register("password")}
                  className={`${inputClass(errors.password)} pr-12`} />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2
                             text-gray-500 hover:text-indigo-400 transition">
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && (
                <p className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5">
                  <FiAlertCircle /> {errors.password.message}
                </p>
              )}
            </motion.div>

            {/* Submit */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}>
              <motion.button type="submit" disabled={loading}
                whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl text-sm font-bold text-white
                           transition duration-200 relative overflow-hidden
                           disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)",
                  boxShadow: "0 10px 40px rgba(99,102,241,0.4)",
                }}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent
                                via-white/10 to-transparent -skew-x-12" />
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor"
                              strokeWidth="3" strokeDasharray="30" strokeDashoffset="10" />
                    </svg>
                    Signing in...
                  </span>
                ) : "Sign In →"}
              </motion.button>
            </motion.div>

          </form>

          {/* ── Sign up link ── */}
          <p className="text-center text-sm mt-5" style={{ color: "#6b7280" }}>
            Don't have an account?{" "}
            <Link to="/signup"
              className="font-semibold transition"
              style={{ color: "#6366f1" }}
              onMouseEnter={e => e.currentTarget.style.color = "#a5b4fc"}
              onMouseLeave={e => e.currentTarget.style.color = "#6366f1"}>
              Create one free →
            </Link>
          </p>

          {/* ── Demo hint ── */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-4 p-3 rounded-xl text-center"
            style={{
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.15)",
            }}>
            <p className="text-xs" style={{ color: "#6b7280" }}>
              🔑 Demo:{" "}
              <span className="font-mono" style={{ color: "#a5b4fc" }}>demo@subtrack.com</span>
              {" / "}
              <span className="font-mono" style={{ color: "#a5b4fc" }}>demo123</span>
            </p>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}