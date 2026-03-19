const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, minlength: 6, default: "" },
  photo:    { type: String, default: "" },
  phone:      { type: String, default: "" },
  currency:   { type: String, default: "INR" },
  avatar:     { type: String, default: "" },
  provider:   { type: String, default: "local" },
  googleId:   { type: String, default: "" },
  isVerified: { type: Boolean, default: false },
  notifications: {
    emailAlerts:   { type: Boolean, default: true  },
    pushAlerts:    { type: Boolean, default: false },
    weeklyReport:  { type: Boolean, default: true  },
    threeDayAlert: { type: Boolean, default: true  },
    sameDayAlert:  { type: Boolean, default: true  },
  },
}, { timestamps: true });

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (entered) {
  if (!this.password) return false;
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model("User", userSchema);