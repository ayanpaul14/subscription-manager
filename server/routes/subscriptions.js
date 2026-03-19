const express      = require("express");
const Subscription = require("../models/Subscription");
const { protect }  = require("../middleware/auth");

const router = express.Router();

// All routes are protected
router.use(protect);

// ── GET /api/subscriptions ─────────────────────────────────────
// Get all subscriptions for logged-in user
router.get("/", async (req, res) => {
  try {
    const subs = await Subscription
      .find({ user: req.user._id })
      .sort({ renewalDate: 1 });
    res.json({ subscriptions: subs });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── POST /api/subscriptions ────────────────────────────────────
// Add a new subscription
router.post("/", async (req, res) => {
  try {
    const { name, cost, category, renewalDate, notes, logo, icon } = req.body;

    if (!name || !cost || !category || !renewalDate)
      return res.status(400).json({ message: "All fields are required" });

    const sub = await Subscription.create({
      user: req.user._id,
      name, cost, category, renewalDate, notes, logo, icon,
    });

    res.status(201).json({ message: "Subscription added", subscription: sub });
  } catch (err) {
    console.error("Add subscription error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ── PUT /api/subscriptions/:id ─────────────────────────────────
// Update a subscription
router.put("/:id", async (req, res) => {
  try {
    const sub = await Subscription.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!sub)
      return res.status(404).json({ message: "Subscription not found" });

    const { name, cost, category, renewalDate, notes, logo, icon } = req.body;
    if (name)        sub.name        = name;
    if (cost)        sub.cost        = cost;
    if (category)    sub.category    = category;
    if (renewalDate) sub.renewalDate = renewalDate;
    if (notes !== undefined) sub.notes = notes;
    if (logo  !== undefined) sub.logo  = logo;
    if (icon  !== undefined) sub.icon  = icon;

    await sub.save();
    res.json({ message: "Subscription updated", subscription: sub });
  } catch (err) {
    console.error("Update subscription error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ── DELETE /api/subscriptions/:id ─────────────────────────────
// Delete a subscription
router.delete("/:id", async (req, res) => {
  try {
    const sub = await Subscription.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!sub)
      return res.status(404).json({ message: "Subscription not found" });

    res.json({ message: "Subscription deleted" });
  } catch (err) {
    console.error("Delete subscription error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ── PUT /api/subscriptions/:id/mark-paid ──────────────────────
// Mark a subscription as paid / unpaid
router.put("/:id/mark-paid", async (req, res) => {
  try {
    const sub = await Subscription.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!sub)
      return res.status(404).json({ message: "Subscription not found" });

    sub.isPaid = !sub.isPaid;
    sub.paidAt = sub.isPaid ? new Date() : null;
    await sub.save();

    res.json({
      message: sub.isPaid ? "Marked as paid" : "Marked as unpaid",
      subscription: sub,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET /api/subscriptions/alerts ─────────────────────────────
// Get subscriptions due within 7 days
router.get("/alerts", async (req, res) => {
  try {
    const today   = new Date();
    const in7days = new Date();
    in7days.setDate(today.getDate() + 7);

    const urgentSubs = await Subscription.find({
      user:        req.user._id,
      renewalDate: { $gte: today, $lte: in7days },
      isPaid:      false,
    }).sort({ renewalDate: 1 });

    res.json({ alerts: urgentSubs, count: urgentSubs.length });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;