const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendReminderEmail = async (to, userName, subscriptions) => {
  const subRows = subscriptions.map(sub => {
    const days = Math.ceil((new Date(sub.renewalDate) - new Date()) / (1000 * 60 * 60 * 24));
    const urgency = days <= 0 ? "🔴 EXPIRED" : days <= 3 ? "🔴 Critical" : days <= 7 ? "🟠 This Week" : "🟡 Upcoming";
    return `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #1e1b4b;">
          <strong style="color:#fff;">${sub.name}</strong>
          <div style="color:#6b7280;font-size:12px;">${sub.category}</div>
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #1e1b4b;color:#a5b4fc;font-weight:bold;">
          ₹${sub.cost}
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #1e1b4b;color:#9ca3af;">
          ${new Date(sub.renewalDate).toDateString()}
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #1e1b4b;">
          <span style="color:${days <= 3 ? '#f87171' : days <= 7 ? '#fb923c' : '#facc15'};font-weight:bold;">
            ${urgency} ${days > 0 ? `(${days}d left)` : ""}
          </span>
        </td>
      </tr>
    `;
  }).join("");

  const totalCost = subscriptions.reduce((sum, s) => sum + s.cost, 0);

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#0f0a1e;font-family:'Segoe UI',sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:32px 16px;">

        <!-- Header -->
        <div style="text-align:center;margin-bottom:32px;">
          <h1 style="color:#fff;font-size:28px;margin:0;">
            🔔 SubTrack
          </h1>
          <p style="color:#6b7280;margin:8px 0 0;">Subscription Renewal Reminder</p>
        </div>

        <!-- Greeting -->
        <div style="background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.3);
                    border-radius:16px;padding:24px;margin-bottom:24px;">
          <p style="color:#fff;margin:0;font-size:16px;">
            Hey <strong>${userName}</strong>! 👋
          </p>
          <p style="color:#9ca3af;margin:8px 0 0;font-size:14px;">
            You have <strong style="color:#a5b4fc;">${subscriptions.length} subscription${subscriptions.length > 1 ? "s" : ""}</strong> 
            coming up for renewal soon. Total at risk: 
            <strong style="color:#a5b4fc;">₹${totalCost.toLocaleString()}</strong>
          </p>
        </div>

        <!-- Table -->
        <div style="background:#0f0a1e;border:1px solid rgba(255,255,255,0.1);
                    border-radius:16px;overflow:hidden;margin-bottom:24px;">
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="background:rgba(99,102,241,0.15);">
                <th style="padding:12px 16px;text-align:left;color:#a5b4fc;font-size:12px;text-transform:uppercase;">Service</th>
                <th style="padding:12px 16px;text-align:left;color:#a5b4fc;font-size:12px;text-transform:uppercase;">Cost</th>
                <th style="padding:12px 16px;text-align:left;color:#a5b4fc;font-size:12px;text-transform:uppercase;">Date</th>
                <th style="padding:12px 16px;text-align:left;color:#a5b4fc;font-size:12px;text-transform:uppercase;">Status</th>
              </tr>
            </thead>
            <tbody>${subRows}</tbody>
          </table>
        </div>

        <!-- CTA Button -->
        <div style="text-align:center;margin-bottom:24px;">
          <a href="${process.env.CLIENT_URL}/alerts"
             style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);
                    color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;
                    font-weight:bold;font-size:15px;box-shadow:0 8px 30px rgba(99,102,241,0.4);">
            View All Alerts →
          </a>
        </div>

        <!-- Footer -->
        <div style="text-align:center;border-top:1px solid rgba(255,255,255,0.06);padding-top:24px;">
          <p style="color:#4b5563;font-size:12px;margin:0;">
            You're receiving this because you have an account on SubTrack.<br/>
            <a href="${process.env.CLIENT_URL}" style="color:#6366f1;">Visit SubTrack</a>
          </p>
        </div>

      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"SubTrack 🔔" <${process.env.EMAIL_USER}>`,
    to,
    subject: `⚠️ ${subscriptions.length} subscription${subscriptions.length > 1 ? "s" : ""} renewing soon — ₹${totalCost} at risk`,
    html,
  });
};

module.exports = { sendReminderEmail };


const sendWelcomeEmail = async (to, userName) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#0f0a1e;font-family:'Segoe UI',sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:32px 16px;">

        <div style="text-align:center;margin-bottom:32px;">
          <h1 style="color:#fff;font-size:28px;margin:0;">🎉 Welcome to SubTrack!</h1>
        </div>

        <div style="background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.3);
                    border-radius:16px;padding:24px;margin-bottom:24px;">
          <p style="color:#fff;margin:0;font-size:16px;">
            Hey <strong>${userName}</strong>! 👋
          </p>
          <p style="color:#9ca3af;margin:8px 0 0;font-size:14px;">
            Welcome to SubTrack — your personal subscription manager. 
            You're all set to track, manage and never miss a renewal again!
          </p>
        </div>

        <div style="background:#0f0a1e;border:1px solid rgba(255,255,255,0.1);
                    border-radius:16px;padding:24px;margin-bottom:24px;">
          <p style="color:#a5b4fc;font-weight:bold;margin:0 0 12px;">What you can do:</p>
          <div style="color:#9ca3af;font-size:14px;line-height:2;">
            ✅ Track all your subscriptions in one place<br/>
            🔔 Get renewal reminders before you're charged<br/>
            📊 See how much you spend monthly & yearly<br/>
            📧 Scan Gmail to auto-detect subscriptions
          </div>
        </div>

        <div style="text-align:center;margin-bottom:24px;">
          <a href="${process.env.CLIENT_URL}"
             style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);
                    color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;
                    font-weight:bold;font-size:15px;">
            Get Started →
          </a>
        </div>

        <div style="text-align:center;border-top:1px solid rgba(255,255,255,0.06);padding-top:24px;">
          <p style="color:#4b5563;font-size:12px;margin:0;">
            SubTrack — Never miss a renewal again 🚀
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"SubTrack 🚀" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Welcome to SubTrack, ${userName}! 🎉`,
    html,
  });
};

module.exports = { sendReminderEmail, sendWelcomeEmail };