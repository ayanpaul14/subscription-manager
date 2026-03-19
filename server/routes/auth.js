const express    = require("express");
const jwt        = require("jsonwebtoken");
const User       = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ── POST /api/auth/signup ──────────────────────────────────────
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already registered" });

    const user  = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ message: "Server error. Try again." });
  }
});

// ── POST /api/auth/login ───────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error. Try again." });
  }
});

// ── GET /api/auth/me ───────────────────────────────────────────
router.get("/me", protect, async (req, res) => {
  res.json({ user: req.user });
});

// ── PUT /api/auth/update-profile ──────────────────────────────
router.put("/update-profile", protect, async (req, res) => {
  try {
    const { name, phone, currency, notifications } = req.body;
    const user = await User.findById(req.user._id);
    if (name)          user.name     = name;
    if (phone)         user.phone    = phone;
    if (currency)      user.currency = currency;
    if (notifications) user.notifications = { ...user.notifications, ...notifications };
    await user.save();
    res.json({ message: "Profile updated", user });
  } catch (err) {
    console.error("Update profile error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ── PUT /api/auth/change-password ─────────────────────────────
router.put("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });
    user.password = newPassword;
    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ── POST /api/auth/forgot-password ────────────────────────────
router.post("/forgot-password", async (req, res) => {
  res.json({ message: "If this email exists, a reset link has been sent." });
});

module.exports = router;

// ── DELETE /api/auth/delete-account ───────────────────────────
router.delete("/delete-account", protect, async (req, res) => {
  try {
    await require("../models/Subscription").deleteMany({ user: req.user._id });
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── POST /api/auth/google ──────────────────────────────────────
router.post("/google", async (req, res) => {
  try {
    const { name, email, uid, photo } = req.body;

    if (!email || !uid)
      return res.status(400).json({ message: "Invalid Google data" });

    // Check if user exists, if not create one
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user (no password for Google users)
      user = await User.create({
        name:     name || email.split("@")[0],
        email,
        password: uid + process.env.JWT_SECRET, // dummy password
        photo,
      });
    }

    const token = generateToken(user._id);

    res.json({
      message: "Google login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });

  } catch (err) {
    console.error("Google auth error:", err.message);
    res.status(500).json({ message: "Google login failed" });
  }
});