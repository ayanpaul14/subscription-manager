import api from "./axios";

// ── Get all subscriptions ──────────────────────────────────────
export const getSubscriptions = async () => {
  const res = await api.get("/subscriptions");
  return res.data.subscriptions;
};

// ── Add subscription ───────────────────────────────────────────
export const addSubscription = async (data) => {
  const res = await api.post("/subscriptions", data);
  return res.data.subscription;
};

// ── Update subscription ────────────────────────────────────────
export const updateSubscription = async (id, data) => {
  const res = await api.put(`/subscriptions/${id}`, data);
  return res.data.subscription;
};

// ── Delete subscription ────────────────────────────────────────
export const deleteSubscription = async (id) => {
  await api.delete(`/subscriptions/${id}`);
};

// ── Mark as paid / unpaid ──────────────────────────────────────
export const togglePaid = async (id) => {
  const res = await api.put(`/subscriptions/${id}/mark-paid`);
  return res.data.subscription;
};

// ── Get urgent alerts (due in 7 days) ─────────────────────────
export const getAlerts = async () => {
  const res = await api.get("/subscriptions/alerts");
  return res.data;
};