// ─── Base URL ─────────────────────────────────────────────────────────────────
const BASE = "http://localhost:8080/api";

// ─── Token helpers ────────────────────────────────────────────────────────────
export function saveToken(token) { sessionStorage.setItem("jwt", token); }
export function getToken() { return sessionStorage.getItem("jwt"); }
export function clearToken() { sessionStorage.removeItem("jwt"); }

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
async function request(method, path, body = null, auth = true) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || `Request failed (${res.status})`);
  }

  return json.data;   // unwrap { success, message, data }
}

const get = (path, auth) => request("GET", path, null, auth);
const post = (path, body, auth) => request("POST", path, body, auth);
const put = (path, body) => request("PUT", path, body);
const patch = (path, body) => request("PATCH", path, body);

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════════════════════
export const authApi = {
  /** Returns { token, user } */
  login: (email, password) => post("/auth/login", { email, password }, false),
  register: (data) => post("/auth/register", data, false),
  me: () => get("/auth/me"),
  updateMe: (data) => put("/auth/me", data),
  forgotPassword: (email) => post("/auth/forgot-password", { email }, false),
  resetPassword: (token, newPassword) => post("/auth/reset-password", { token, newPassword }, false),
  // Admin management
  createUser: (data) => post("/auth/admin/create-user", data),
  listUsers: (role) => get(`/auth/admin/users?role=${role}`),
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPLAINTS
// ═══════════════════════════════════════════════════════════════════════════════
export const complaintApi = {
  // Citizen
  submit: (data) => post("/citizen/complaints", data),
  myComplaints: () => get("/citizen/complaints"),
  getOne: (id) => get(`/citizen/complaints/${id}`),
  submitFeedback: (id, data) => post(`/citizen/complaints/${id}/feedback`, data),
  citizenStats: () => get("/citizen/stats"),

  // Officer
  officerAll: () => get("/officer/complaints"),
  assigned: () => get("/officer/complaints/assigned"),
  getOneOfficer: (id) => get(`/officer/complaints/${id}`),
  updateStatus: (id, data) => patch(`/officer/complaints/${id}/status`, data),

  // Admin
  adminAll: () => get("/admin/complaints"),
  getOneAdmin: (id) => get(`/admin/complaints/${id}`),
  assignOfficer: (id, oId) => patch(`/admin/complaints/${id}/assign?officerId=${oId}`),
  adminStatus: (id, data) => patch(`/admin/complaints/${id}/status`, data),

  // Analytics
  platformStats: () => get("/public/stats", false),
  categoryStats: () => get("/officer/analytics/categories"),
  localityStats: () => get("/officer/analytics/localities"),
  trend: (days = 30) => get(`/officer/analytics/trend?days=${days}`),
};

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════
export const notifApi = {
  getAll: () => get("/notifications"),
  unreadCount: () => get("/notifications/unread-count"),
  markAllRead: () => post("/notifications/mark-read", {}),
};

// ═══════════════════════════════════════════════════════════════════════════════
// OTHER
// ═══════════════════════════════════════════════════════════════════════════════
export const otherApi = {
  contactUs: (data) => post("/contact", data, false),
};
