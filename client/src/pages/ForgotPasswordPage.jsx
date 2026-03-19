import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiAlertCircle, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import logo from "../assets/logo.jpeg";

const schema = yup.object({
  email: yup.string().email("Enter a valid email address").required("Email is required"),
});

const bubbles = [
  { w: 300, h: 300, top: "-10%", left: "-5%",  delay: 0   },
  { w: 200, h: 200, top: "60%",  left: "70%",  delay: 1   },
  { w: 150, h: 150, top: "30%",  left: "80%",  delay: 2   },
  { w: 250, h: 250, top: "70%",  left: "-8%",  delay: 0.5 },
  { w: 120, h: 120, top: "10%",  left: "55%",  delay: 1.5 },
];

export default function ForgotPasswordPage() {
  const [loading, setLoading]     = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentTo, setSentTo]       = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email: formData.email });
      setSentTo(formData.email);
      setEmailSent(true);
      toast.success("Reset link sent! Check your inbox.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#0f0a1e]">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.3) 0%, transparent 60%)",
        }} />
        {bubbles.map((b, i) => (
          <motion.div key={i}
            animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 6 + i, repeat: Infinity, delay: b.delay, ease: "easeInOut" }}
            className="absolute rounded-full"
            style={{ width: b.w, height: b.h, top: b.top, left: b.left, background: "radial-gradient(circle, rgba(99,102,241,0.15), transparent)", border: "1px solid rgba(99,102,241,0.1)" }} />
        ))}
      </div>

      {/* Card */}
      <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }} className="relative z-10 w-full max-w-md mx-4">

        <AnimatePresence mode="wait">

          {/* ── STEP 1: Enter Email ── */}
          {!emailSent && (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>

              <div className="relative p-8 rounded-3xl overflow-hidden"
                   style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(30px)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 40px 100px rgba(0,0,0,0.5)" }}>

                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />

                {/* Logo + Title */}
                <div className="text-center mb-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 overflow-hidden shadow-lg"
                    style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))", border: "1px solid rgba(99,102,241,0.3)" }}>
                    <img src={logo} alt="SubTrack" className="w-12 h-12 object-contain" />
                  </motion.div>

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
                    style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)" }}>
                    🔐
                  </motion.div>

                  <h1 className="text-3xl font-bold mb-2"
                      style={{ background: "linear-gradient(135deg, #fff 0%, #a5b4fc 50%, #c084fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Forgot Password?
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Enter your email and we'll send you a reset link.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 text-base pointer-events-none" />
                      <input type="email" placeholder="you@example.com" {...register("email")}
                        className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition duration-200
                          ${errors.email ? "border border-red-500/60 bg-red-500/5" : "border border-white/10 bg-white/5 focus:border-indigo-500/60 focus:bg-indigo-500/5"}`}
                        style={{ backdropFilter: "blur(10px)" }} />
                    </div>
                    {errors.email && (
                      <p className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5">
                        <FiAlertCircle /> {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <motion.button type="submit" disabled={loading}
                    whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)", boxShadow: "0 10px 40px rgba(99,102,241,0.4)" }}>
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30" strokeDashoffset="10" />
                        </svg>
                        Sending reset link...
                      </>
                    ) : "Send Reset Link →"}
                  </motion.button>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-gray-600 text-xs">or</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  {/* Back to login */}
                  <Link to="/login"
                    className="flex items-center justify-center gap-2 text-sm font-semibold transition"
                    style={{ color: "#a5b4fc" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#818cf8"}
                    onMouseLeave={e => e.currentTarget.style.color = "#a5b4fc"}>
                    <FiArrowLeft /> Back to Sign In
                  </Link>
                </form>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Success Screen ── */}
          {emailSent && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>

              <div className="relative p-8 rounded-3xl overflow-hidden"
                   style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(30px)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 40px 100px rgba(0,0,0,0.5)" }}>

                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

                {/* Success icon */}
                <div className="text-center mb-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4"
                    style={{ background: "rgba(52,211,153,0.15)", border: "2px solid rgba(52,211,153,0.3)", boxShadow: "0 0 40px rgba(52,211,153,0.2)" }}>
                    ✅
                  </motion.div>
                  <h1 className="text-3xl font-bold mb-2"
                      style={{ background: "linear-gradient(135deg, #fff 0%, #6ee7b7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Check Your Email!
                  </h1>
                  <p className="text-gray-400 text-sm">We've sent a reset link to your inbox.</p>
                </div>

                <div className="space-y-5">

                  {/* Email sent to */}
                  <div className="flex items-center gap-3 p-4 rounded-xl"
                       style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}>
                    <FiCheckCircle className="text-xl flex-shrink-0" style={{ color: "#34d399" }} />
                    <div>
                      <p className="text-xs mb-0.5" style={{ color: "#6b7280" }}>Reset link sent to</p>
                      <p className="text-sm font-semibold text-white">{sentTo}</p>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="space-y-3 p-4 rounded-xl"
                       style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    {[
                      { step: "1️⃣", text: <>Open your inbox and find the email from <span className="text-white">SubTrack</span></> },
                      { step: "2️⃣", text: <>Click the <span className="text-white font-semibold">"Reset Password"</span> button</> },
                      { step: "3️⃣", text: "Create a new strong password and sign in" },
                    ].map((item, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="flex items-start gap-3 text-sm" style={{ color: "#9ca3af" }}>
                        <span className="text-base flex-shrink-0">{item.step}</span>
                        <p>{item.text}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Expiry note */}
                  <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl"
                       style={{ background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.2)" }}>
                    <span>⏱️</span>
                    <p className="text-xs" style={{ color: "#fbbf24" }}>
                      Reset link expires in <span className="font-bold">15 minutes</span>
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-gray-600 text-xs">didn't receive it?</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  {/* Resend */}
                  <motion.button onClick={() => setEmailSent(false)}
                    whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                    className="w-full py-3 rounded-xl text-sm font-semibold transition duration-200"
                    style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", color: "#a5b4fc" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.2)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; }}>
                    Try a different email
                  </motion.button>

                  {/* Back to login */}
                  <Link to="/login"
                    className="flex items-center justify-center gap-2 text-sm font-semibold transition"
                    style={{ color: "#a5b4fc" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#818cf8"}
                    onMouseLeave={e => e.currentTarget.style.color = "#a5b4fc"}>
                    <FiArrowLeft /> Back to Sign In
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
}