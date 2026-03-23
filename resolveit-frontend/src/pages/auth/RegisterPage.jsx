import { useState } from "react";
import PublicNavbar from "../../components/layout/PublicNavbar";
import CityscapeBanner from "../../components/layout/CityscapeBanner";
import { authApi } from "../../services/api";

export default function RegisterPage({ onNavigate }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    city: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);
    setError("");

    try {
      await authApi.register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        city: form.city,
        locality: form.city // Using city for both for now
      });
      // Auto login or redirect to login
      onNavigate("login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: "var(--font-body)", minHeight: "100vh", background: "linear-gradient(160deg,#e0e7ff,#dbeafe,#e0f2fe)", display: "flex", flexDirection: "column" }}>
      <PublicNavbar onNavigate={onNavigate} />
      <CityscapeBanner height={120} />

      <div style={{ display: "flex", justifyContent: "center", marginTop: -64, paddingBottom: 52, flex: 1 }}>
        <div className="card fade-up" style={{ padding: "42px 48px", width: 500, boxShadow: "var(--shadow-lg)" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ width: 56, height: 56, background: "#dbeafe", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 26 }}>
              🏛️
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "#0f172a", margin: 0 }}>
              Create Account
            </h2>
            <p style={{ color: "#64748b", fontSize: 13, marginTop: 8 }}>Join the civic platform</p>
          </div>

          {error && (
            <div style={{ background: "#fef2f2", color: "#b91c1c", padding: 12, borderRadius: 8, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <Field label="First Name" name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} required />
              <Field label="Last Name" name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} required />
            </div>

            <Field label="Email Address" name="email" placeholder="your@email.com" type="email" mb={14} value={form.email} onChange={handleChange} required />
            <Field label="Phone Number" name="phone" placeholder="+91 XXXXX XXXXX" mb={14} value={form.phone} onChange={handleChange} required />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <Field label="Password" name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} required />
              <Field label="Confirm Password" name="confirmPassword" placeholder="Confirm" type="password" value={form.confirmPassword} onChange={handleChange} required />
            </div>

            <Field label="City / Locality" name="city" placeholder="Your city" mb={22} value={form.city} onChange={handleChange} required />

            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 15 }}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "🏛️ Create Account"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 13, color: "#64748b", marginTop: 18 }}>
            Already have an account?{" "}
            <span
              style={{ color: "#1e40af", fontWeight: 800, cursor: "pointer" }}
              onClick={() => onNavigate("login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, placeholder, type = "text", mb = 0, value, onChange, required = false }) {
  return (
    <div style={{ marginBottom: mb }}>
      <label style={{ fontWeight: 700, fontSize: 12, color: "#374151", display: "block", marginBottom: 5 }}>
        {label}
      </label>
      <input
        className="input-base"
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}
