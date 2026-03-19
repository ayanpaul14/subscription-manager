const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name:        { type: String, required: true, trim: true },
  cost:        { type: Number, required: true, min: 0 },
  category:    { type: String, required: true, enum: ["Entertainment","Health","Tech","Shopping","Education","Utility","Finance","Other"] },
  renewalDate: { type: Date,   required: true },
  notes:       { type: String, default: "" },
  logo:        { type: String, default: null },
  icon:        { type: String, default: "📦" },
  isPaid:      { type: Boolean, default: false },
  paidAt:      { type: Date,   default: null },
  alertSent:   { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);