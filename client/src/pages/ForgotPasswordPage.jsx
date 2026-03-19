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

// ── Validation Schema ──────────────────────────────────────────
const schema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email address")
    .required("Email is required"),
});

// ── Main ForgotPassword Page ───────────────────────────────────
export default function ForgotPasswordPage() {
  const [loading, setLoading]   = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentTo, setSentTo]     = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

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
    <div className="min-h-screen overflow-hidden bg-white text-black px-8">

      {/* ── Header ── */}
      <motion.header
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="max-w-7xl mx-auto mt-8 rounded-2xl
                   bg-black/80 backdrop-blur-xl border border-white/10
                   px-8 py-6 shadow-[0_20px_45px_rgba(0,0,0,0.6)]
                   flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <img
              src={logo}
              alt="Subscription Alert Logo"
              className="h-14 w-auto object-contain"
            />
          </h1>
          <p className="text-base text-gray-400 mt-1">
            Track renewals. Kill forgotten subscriptions. Save money.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-3 text-gray-400 text-sm">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-white font-semibold border border-white/20
                       px-4 py-1.5 rounded-lg hover:bg-white/10 transition duration-200"
          >
            Sign In
          </Link>
        </div>
      </motion.header>

      {/* ── Centered Content ── */}
      <main className="max-w-7xl mx-auto py-10 flex flex-col items-center">

        <AnimatePresence mode="wait">

          {/* ── STEP 1: Enter Email ── */}
          {!emailSent && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="w-full flex flex-col items-center"
            >
              {/* Lock icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 rounded-2xl bg-black/90 border border-white/10
                           flex items-center justify-center text-4xl mb-6
                           shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
              >
                🔐
              </motion.div>

              <h2 className="text-5xl lg:text-6xl font-extrabold leading-tight text-center
                             bg-gradient-to-br from-black/90 via-black/60 to-black/90
                             bg-clip-text text-transparent mb-3">
                Forgot Password?
              </h2>
              <p className="text-gray-500 text-lg mb-10 text-center max-w-md">
                No worries! Enter your email address and we'll send you a link to reset your password.
              </p>

              {/* Form Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative p-8 rounded-2xl w-full max-w-md
                           bg-gradient-to-br from-black/90 via-black/85 to-black/90
                           backdrop-blur-2xl border border-white/10
                           shadow-[0_30px_80px_rgba(0,0,0,0.5)] text-white"
              >
                {/* Shimmer */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br
                                from-white/5 to-transparent pointer-events-none" />

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  className="relative z-10 space-y-5"
                >

                  {/* Email Field */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-400
                                      uppercase tracking-widest mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2
                                         text-gray-500 text-lg pointer-events-none" />
                      <input
                        type="email"
                        placeholder="you@example.com"
                        {...register("email")}
                        className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-sm
                                    bg-white/5 border text-white placeholder-gray-600
                                    outline-none transition duration-200
                                    focus:bg-white/10 focus:border-white/40
                                    focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]
                                    ${errors.email ? "border-red-500/60" : "border-white/10"}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5">
                        <FiAlertCircle /> {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={!loading ? { y: -4, scale: 0.98 } : {}}
                    whileTap={!loading ? { scale: 0.97 } : {}}
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                    className="w-full py-3.5 rounded-xl font-bold text-base
                               bg-gradient-to-r from-white via-gray-100 to-white
                               text-black shadow-[0_15px_40px_rgba(255,255,255,0.15)]
                               hover:shadow-[0_20px_50px_rgba(255,255,255,0.25)]
                               transition duration-300 disabled:opacity-50
                               disabled:cursor-not-allowed
                               flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/30
                                        border-t-black rounded-full animate-spin" />
                        Sending reset link...
                      </>
                    ) : "Send Reset Link →"}
                  </motion.button>

                  {/* Divider */}
                  <div className="flex items-center gap-3 text-gray-600 text-xs">
                    <div className="flex-1 h-px bg-white/10" />
                    or
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  {/* Back to login */}
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2
                               text-sm text-gray-500 hover:text-white transition"
                  >
                    <FiArrowLeft /> Back to Sign In
                  </Link>

                </form>
              </motion.div>
            </motion.div>
          )}

          {/* ── STEP 2: Email Sent Success Screen ── */}
          {emailSent && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full flex flex-col items-center"
            >
              {/* Success icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-24 h-24 rounded-full bg-green-500/20 border border-green-500/30
                           flex items-center justify-center text-5xl mb-6
                           shadow-[0_20px_60px_rgba(34,197,94,0.2)]"
              >
                ✅
              </motion.div>

              <h2 className="text-5xl lg:text-6xl font-extrabold leading-tight text-center
                             bg-gradient-to-br from-black/90 via-black/60 to-black/90
                             bg-clip-text text-transparent mb-3">
                Check Your Email!
              </h2>
              <p className="text-gray-500 text-lg mb-10 text-center max-w-md">
                We've sent a password reset link to your email address.
              </p>

              {/* Success Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative p-8 rounded-2xl w-full max-w-md
                           bg-gradient-to-br from-black/90 via-black/85 to-black/90
                           backdrop-blur-2xl border border-white/10
                           shadow-[0_30px_80px_rgba(0,0,0,0.5)] text-white"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br
                                from-white/5 to-transparent pointer-events-none" />

                <div className="relative z-10 space-y-5">

                  {/* Email sent to */}
                  <div className="flex items-center gap-3 p-4 rounded-xl
                                  bg-green-500/10 border border-green-500/20">
                    <FiCheckCircle className="text-green-400 text-xl flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Reset link sent to</p>
                      <p className="text-sm font-semibold text-white">{sentTo}</p>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="space-y-3 text-sm text-gray-400">
                    <div className="flex items-start gap-3">
                      <span className="text-lg">1️⃣</span>
                      <p>Open your email inbox and look for an email from <span className="text-white">SubTrack</span></p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-lg">2️⃣</span>
                      <p>Click the <span className="text-white font-semibold">"Reset Password"</span> button in the email</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-lg">3️⃣</span>
                      <p>Create a new strong password and sign in</p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3 text-gray-600 text-xs">
                    <div className="flex-1 h-px bg-white/10" />
                    didn't receive it?
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  {/* Resend button */}
                  <motion.button
                    onClick={() => setEmailSent(false)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-3 rounded-xl font-semibold text-sm
                               bg-white/5 border border-white/10 text-gray-300
                               hover:bg-white/10 hover:text-white
                               transition duration-200"
                  >
                    Try a different email
                  </motion.button>

                  {/* Back to login */}
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2
                               text-sm text-gray-500 hover:text-white transition"
                  >
                    <FiArrowLeft /> Back to Sign In
                  </Link>

                </div>
              </motion.div>

              {/* Expiry note */}
              <p className="text-xs text-gray-400 mt-6 text-center">
                ⏱️ The reset link will expire in <span className="text-white">15 minutes</span>
              </p>

            </motion.div>
          )}

        </AnimatePresence>

        {/* bottom spacing */}
        <div className="h-16" />

      </main>
    </div>
  );
}