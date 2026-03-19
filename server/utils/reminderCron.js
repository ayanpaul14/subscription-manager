const cron        = require("node-cron");
const Subscription = require("../models/Subscription");
const User        = require("../models/User");
const { sendReminderEmail } = require("./mailer");

const startReminderCron = () => {
  // Runs every day at 9:00 AM
  cron.schedule("0 9 * * *", async () => {
    console.log("⏰ Running daily subscription reminder check...");

    try {
      const today    = new Date();
      const in14days = new Date();
      in14days.setDate(today.getDate() + 14);

      // Find all unpaid subscriptions due in next 14 days
      const upcoming = await Subscription.find({
        renewalDate: { $gte: today, $lte: in14days },
        isPaid: false,
      }).populate("user");

      if (upcoming.length === 0) {
        console.log("✅ No upcoming renewals today.");
        return;
      }

      // Group subscriptions by user
      const byUser = {};
      upcoming.forEach(sub => {
        const userId = sub.user._id.toString();
        if (!byUser[userId]) {
          byUser[userId] = { user: sub.user, subs: [] };
        }
        byUser[userId].subs.push(sub);
      });

      // Send one email per user
      const results = await Promise.allSettled(
        Object.values(byUser).map(({ user, subs }) =>
          sendReminderEmail(user.email, user.name, subs)
        )
      );

      const sent   = results.filter(r => r.status === "fulfilled").length;
      const failed = results.filter(r => r.status === "rejected").length;
      console.log(`📧 Reminders sent: ${sent} success, ${failed} failed`);

    } catch (err) {
      console.error("❌ Cron job error:", err.message);
    }
  });

  console.log("✅ Reminder cron job started — runs daily at 9:00 AM");
};

module.exports = { startReminderCron };