import { useState } from "react";
import PublicNavbar from "../../components/layout/PublicNavbar";
import { authApi } from "../../services/api";

export default function ResetPasswordPage({ onNavigate, token }) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }
        if (password.length < 6) {
            return setError("Password must be at least 6 characters");
        }

        setLoading(true);
        setError("");

        try {
            await authApi.resetPassword(token, password);
            setSuccess(true);
            setTimeout(() => onNavigate("login"), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div style={{ fontFamily: "var(--font-body)", background: "#f8fafc", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="card" style={{ maxWidth: 400, padding: 40, textAlign: "center" }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                    <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a" }}>Password Reset Successful</h2>
                    <p style={{ color: "#64748b", margin: "12px 0 24px" }}>Your password has been updated. Redirecting to login...</p>
                    <button className="btn-primary" onClick={() => onNavigate("login")}>Go to Login</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ fontFamily: "var(--font-body)", background: "#f8fafc", minHeight: "100vh" }}>
            <PublicNavbar onNavigate={onNavigate} activePage="login" />

            <div style={{ display: "flex", justifyContent: "center", padding: "80px 20px" }}>
                <div className="card fade-up" style={{ width: "100%", maxWidth: 420, padding: 36 }}>
                    <div style={{ textAlign: "center", marginBottom: 32 }}>
                        <div style={{ fontSize: 42, marginBottom: 12 }}>🛡️</div>
                        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: "#0f172a" }}>Reset Password</h1>
                        <p style={{ color: "#64748b", marginTop: 8 }}>Set a secure new password for your account</p>
                    </div>

                    {error && (
                        <div style={{ background: "#fef2f2", color: "#b91c1c", padding: 14, borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 7 }}>New Password</label>
                            <input
                                type="password"
                                className="input-field"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div style={{ marginBottom: 28 }}>
                            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 7 }}>Confirm New Password</label>
                            <input
                                type="password"
                                className="input-field"
                                placeholder="••••••••"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn-primary" style={{ width: "100%", padding: 12, fontSize: 15 }} disabled={loading}>
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
