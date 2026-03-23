import { useState } from "react";
import PublicNavbar from "../../components/layout/PublicNavbar";
import CityscapeBanner from "../../components/layout/CityscapeBanner";
export default function LoginPage({ onLogin, onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit() {
    setLoading(true);
    setError("");
    setTimeout(() => {
      onLogin(email, password)
        .then(res => {
          if (!res.success) setError(res.error);
        })
        .finally(() => setLoading(false));
    }, 700);
  }

  return (
    <div style={{ fontFamily: "var(--font-body)", minHeight: "100vh", background: "linear-gradient(160deg,#e0e7ff,#dbeafe,#e0f2fe)", display: "flex", flexDirection: "column" }}>
      <PublicNavbar onNavigate={onNavigate} />
      <CityscapeBanner height={148} />

      {/* Card */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: -80, paddingBottom: 48, flex: 1 }}>
        <div
          className="card"
          style={{ padding: "44px 48px", width: 460, boxShadow: "var(--shadow-lg)" }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <div
              style={{
                width: 58, height: 58, background: "#dbeafe", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px", fontSize: 28,
              }}
            >
              🌿
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, color: "#0f172a", margin: 0 }}>
              Welcome Back!
            </h2>
            <p style={{ color: "#64748b", fontSize: 14, marginTop: 8 }}>Sign in to continue</p>
          </div>

          {/* Email */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: 700, fontSize: 13, color: "#374151", display: "block", marginBottom: 6 }}>
              Email Address
            </label>
            <input
              className="input-base"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <label style={{ fontWeight: 700, fontSize: 13, color: "#374151" }}>Password</label>
              <span
                style={{ color: "#3b82f6", fontSize: 12, cursor: "pointer", fontWeight: 600 }}
                onClick={() => onNavigate("forgot-password")}
              >
                Forgot password?
              </span>
            </div>
            <input
              className="input-base"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          {/* Remember me */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <input type="checkbox" id="rem" defaultChecked style={{ accentColor: "#3b82f6", width: 15, height: 15 }} />
            <label htmlFor="rem" style={{ fontSize: 13, color: "#374151", fontWeight: 600, cursor: "pointer" }}>
              Remember me
            </label>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                background: "#fef2f2", border: "1px solid #fecaca",
                borderRadius: 8, padding: "10px 14px",
                fontSize: 13, color: "#dc2626", marginBottom: 16,
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* Submit */}
          <button
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 16 }}
            onClick={handleSubmit}
          >
            {loading ? "Signing in…" : "Login"}
          </button>

          <p style={{ textAlign: "center", fontSize: 13, color: "#64748b", marginTop: 18 }}>
            Don't have an account?{" "}
            <span
              style={{ color: "#1e40af", fontWeight: 800, cursor: "pointer" }}
              onClick={() => onNavigate("register")}
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
