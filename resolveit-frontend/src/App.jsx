import { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import "./styles/globals.css";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import OfficerDashboard from "./pages/officer/OfficerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

/**
 * App
 */
export default function App() {
  const { user, loading, login, logout } = useAuth();
  const [page, setPage] = useState(() => {
    // Detect reset-password from URL on load
    const params = new URLSearchParams(window.location.search);
    if (params.get("token")) return "reset-password";
    return "home";
  });

  // Effect to sync page with user if needed
  useEffect(() => {
    if (user && page === "home") setPage("dashboard");
  }, [user]);

  // Extract token if on reset page
  const resetToken = new URLSearchParams(window.location.search).get("token");

  // ── Auth handler ─────────────────────────────────────────────
  function handleLogin(email, password) {
    return login(email, password).then(res => {
      if (res.success) setPage("dashboard");
      return res;
    });
  }

  function handleLogout() {
    logout();
    setPage("home");
  }

  // ── Loading ──────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <div style={{ color: "#3b82f6", fontWeight: "bold" }}>Loading ResolveIT...</div>
      </div>
    );
  }

  // ── Authenticated ────────────────────────────────────
  if (user && page === "dashboard") {
    if (user.role === "citizen") return <CitizenDashboard user={user} onLogout={handleLogout} onNavigate={setPage} />;
    if (user.role === "officer") return <OfficerDashboard user={user} onLogout={handleLogout} onNavigate={setPage} />;
    if (user.role === "admin") return <AdminDashboard user={user} onLogout={handleLogout} onNavigate={setPage} />;
  }

  // ── Public routes ─────────────────────────────────────────────────────────
  if (page === "login") return <LoginPage onLogin={handleLogin} onNavigate={setPage} />;
  if (page === "register") return <RegisterPage onNavigate={setPage} />;
  if (page === "forgot-password") return <ForgotPasswordPage onNavigate={setPage} />;
  if (page === "reset-password") return <ResetPasswordPage onNavigate={setPage} token={resetToken} />;

  return <LandingPage onNavigate={setPage} user={user} />;
}
