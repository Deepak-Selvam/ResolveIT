import { useState } from "react";
import PublicNavbar from "../../components/layout/PublicNavbar";
import { authApi } from "../../services/api";

export default function ForgotPasswordPage({ onNavigate }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            await authApi.forgotPassword(email);
            setMessage("If an account exists for this email, you will receive a password reset link shortly.");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ fontFamily: "var(--font-body)", background: "#f8fafc", minHeight: "100vh" }}>
            <PublicNavbar onNavigate={onNavigate} activePage="login" />

            <div style={{ display: "flex", justifyContent: "center", padding: "80px 20px" }}>
                <div className="card fade-up" style={{ width: "100%", maxWidth: 420, padding: 36 }}>
                    <div style={{ textAlign: "center", marginBottom: 32 }}>
                        <div style={{ fontSize: 42, marginBottom: 12 }}>🔑</div>
                        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: "#0f172a" }}>Forgot Password</h1>
                        <p style={{ color: "#64748b", marginTop: 8 }}>Enter your email to receive a reset link</p>
                    </div>

                    {message && (
                        <div style={{ background: "#f0fdf4", color: "#15803d", padding: 14, borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
                            ✅ {message}
                        </div>
                    )}

                    {error && (
                        <div style={{ background: "#fef2f2", color: "#b91c1c", padding: 14, borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 7 }}>Email Address</label>
                            <input
                                type="email"
                                className="input-field"
                                placeholder="john@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn-primary" style={{ width: "100%", padding: 12, fontSize: 15 }} disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>

                    <div style={{ textAlign: "center", marginTop: 24, fontSize: 14 }}>
                        <span style={{ color: "#64748b" }}>Remember your password? </span>
                        <span
                            style={{ color: "#3b82f6", fontWeight: 700, cursor: "pointer" }}
                            onClick={() => onNavigate("login")}
                        >
                            Login
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
