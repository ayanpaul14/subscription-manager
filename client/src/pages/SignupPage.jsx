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
  FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle
} from "react-icons/fi";
import logo from "../assets/logo.jpeg";
import Footer from "../components/Footer";

const schema = yup.object({
  name:            yup.string().min(2, "Min 2 characters").required("Name is required"),
  email:           yup.string().email("Invalid email").required("Email is required"),
  password:        yup.string().min(6, "Min 6 characters").required("Password is required"),
  confirmPassword: yup.string()
    .oneOf([yup.ref("password")], "Passwords don't match")
    .required("Please confirm your password"),
});

const getStrength = (password) => {
  if (!password) return { score: 0, label: "", color: "", bg: "" };
  let score = 0;
  if (password.length >= 6)           score++;
  if (password.length >= 10)          score++;
  if (/[A-Z]/.test(password))         score++;
  if (/[0-9]/.test(password))         score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const levels = [
    { label: "",       color: "",                bg: "" },
    { label: "Weak",   color: "text-red-400",    bg: "bg-red-400" },
    { label: "Fair",   color: "text-orange-400", bg: "bg-orange-400" },
    { label: "Good",   color: "text-yellow-400", bg: "bg-yellow-400" },
    { label: "Strong", color: "text-green-400",  bg: "bg-green-400" },
    { label: "Strong", color: "text-green-400",  bg: "bg-green-400" },
  ];
  return { score, ...levels[Math.min(score, 5)] };
};

const bubbles = [
  { w: 300, h: 300, top: "-10%", left: "-5%",  delay: 0   },
  { w: 200, h: 200, top: "60%",  left: "70%",  delay: 1   },
  { w: 150, h: 150, top: "30%",  left: "80%",  delay: 2   },
  { w: 250, h: 250, top: "70%",  left: "-8%",  delay: 0.5 },
  { w: 120, h: 120, top: "10%",  left: "55%",  delay: 1.5 },
];

export default function SignupPage() {
  const [showPass, setShowPass]           = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [loading, setLoading]             = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login }                         = useAuth();
  const navigate                          = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const watchedPassword = watch("password", "");
  const strength        = getStrength(watchedPassword);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/signup", {
        name:     data.name,
        email:    data.email,
        password: data.password,
      });
      login(res.data.user, res.data.token);
      toast.success(`Welcome to SubTrack, ${res.data.user.name?.split(" ")[0]}! 🎉`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setGoogleLoading(true);
      const { user, token } = await signInWithGoogle();
      const res = await api.post("/auth/google", {
        name:  user.name,
        email: user.email,
        uid:   user.uid,
        photo: user.photo,
        token,
      });
      login(res.data.user, res.data.token);
      toast.success(`Welcome to SubTrack, ${res.data.user.name?.split(" ")[0]}! 🎉`);
      navigate("/dashboard");
    } catch (err) {
      console.error("Google signup error:", err);
      toast.error("Google login failed. Check Firebase console settings.");
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
    // ── KEY CHANGE: flex-col so Footer sits at bottom ──────────
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#0f0a1e]">

      {/* ── Background Bubbles ── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.3) 0%, transparent 60%)",
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

      {/* ── Main content — flex-1 centers card vertically ── */}
      <div className="flex-1 flex items-center justify-center relative z-10 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md mx-4"
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

            {/* Logo + Title */}
            <div className="text-center mb-6">
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
                Create Account
              </motion.h1>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }} className="text-gray-400 text-sm">
                Never get charged by surprise again.
              </motion.p>
            </div>

            {/* Google Button */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }} className="mb-5">
              <motion.button
                type="button"
                onClick={handleGoogleSignup}
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
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor"
                              strokeWidth="3" strokeDasharray="30" strokeDashoffset="10" />
                    </svg>
                    Connecting...
                  </div>
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

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-gray-500">or sign up with email</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-400
                                  uppercase tracking-widest mb-2">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2
                                     text-indigo-400 text-base pointer-events-none" />
                  <input type="text" placeholder="Your Name" {...register("name")}
                    className={inputClass(errors.name)} />
                </div>
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <FiAlertCircle /> {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-400
                                  uppercase tracking-widest mb-2">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2
                                     text-indigo-400 text-base pointer-events-none" />
                  <input type="email" placeholder="you@example.com" {...register("email")}
                    className={inputClass(errors.email)} />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <FiAlertCircle /> {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-400
                                  uppercase tracking-widest mb-2">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2
                                     text-indigo-400 text-base pointer-events-none" />
                  <input type={showPass ? "text" : "password"} placeholder="••••••••"
                    {...register("password")}
                    className={`${inputClass(errors.password)} pr-12`} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2
                               text-gray-500 hover:text-indigo-400 transition">
                    {showPass ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                {/* Strength bar */}
                {watchedPassword && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-white/10">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: strength.score >= i ? "100%" : "0%" }}
                            transition={{ duration: 0.3 }}
                            className={`h-full rounded-full ${strength.bg}`}
                          />
                        </div>
                      ))}
                    </div>
                    {strength.label && (
                      <p className={`text-xs ${strength.color}`}>
                        Strength: <span className="font-semibold">{strength.label}</span>
                      </p>
                    )}
                  </motion.div>
                )}
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <FiAlertCircle /> {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-400
                                  uppercase tracking-widest mb-2">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2
                                     text-indigo-400 text-base pointer-events-none" />
                  <input type={showConfirm ? "text" : "password"} placeholder="••••••••"
                    {...register("confirmPassword")}
                    className={`${inputClass(errors.confirmPassword)} pr-12`} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2
                               text-gray-500 hover:text-indigo-400 transition">
                    {showConfirm ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <FiAlertCircle /> {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button type="submit" disabled={loading}
                whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl text-sm font-bold text-white
                           relative overflow-hidden mt-2 disabled:opacity-60
                           disabled:cursor-not-allowed"
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
                    Creating account...
                  </span>
                ) : "Create Free Account →"}
              </motion.button>

            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-gray-600">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Sign in link */}
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login"
                className="font-semibold text-indigo-400 hover:text-indigo-300 transition">
                Sign in →
              </Link>
            </p>

            {/* Terms */}
            <p className="text-center text-xs text-gray-600 mt-4">
              By signing up you agree to our{" "}
              <span className="text-indigo-400/70 cursor-pointer hover:text-indigo-400 transition">
                Terms of Service
              </span>{" "}and{" "}
              <span className="text-indigo-400/70 cursor-pointer hover:text-indigo-400 transition">
                Privacy Policy
              </span>
            </p>

          </div>
        </motion.div>
      </div>

      {/* ── Footer at bottom ── */}
      <Footer />

    </div>
  );
}