import { useState } from "react";
import { complaintApi } from "../../services/api";

const CATEGORIES = [
  { value: "ROAD_DAMAGE", label: "Road Damage" },
  { value: "GARBAGE", label: "Garbage Accumulation" },
  { value: "WATER_LEAKAGE", label: "Water Leakage" },
  { value: "STREETLIGHT", label: "Streetlight Failure" },
  { value: "DRAINAGE", label: "Drainage Blockage" },
  { value: "PUBLIC_SAFETY", label: "Public Safety" },
];

export default function SubmitComplaint({ onDone }) {
  const [form, setForm] = useState({ title: "", category: "", description: "", location: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handle(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })); }

  async function submit() {
    if (!form.title || !form.category || !form.description) {
      setError("Please fill in all required fields."); return;
    }
    setLoading(true); setError("");
    try {
      await complaintApi.submit({ ...form });
      setSuccess(true);
      setForm({ title: "", category: "", description: "", location: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) return (
    <div style={{ maxWidth: 640, textAlign: "center", padding: "80px 40px" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Complaint Submitted!</h2>
      <p style={{ color: "#64748b" }}>Your complaint has been received. We've sent you a confirmation email with all details.</p>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
        <button className="btn-outline" onClick={() => setSuccess(false)}>Submit Another</button>
        <button className="btn-primary" onClick={onDone}>View My Complaints</button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 640 }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>Submit New Complaint</h2>
      <p style={{ color: "#64748b", marginBottom: 28, fontSize: 14 }}>Fill in the details below to report a civic issue.</p>

      <div className="card" style={{ padding: 36 }}>
        <Field label="Issue Title" required>
          <input className="input-base" name="title" placeholder="Enter a concise title" value={form.title} onChange={handle} />
        </Field>
        <Field label="Category" required>
          <select className="input-base" name="category" value={form.category} onChange={handle}>
            <option value="">Select category</option>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </Field>
        <Field label="Description" required>
          <textarea className="input-base" name="description" rows={4} placeholder="Describe the issue in detail…" value={form.description} onChange={handle} style={{ resize: "vertical", lineHeight: 1.6 }} />
        </Field>
        <Field label="Location">
          <input className="input-base" name="location" placeholder="Street / area name" value={form.location} onChange={handle} />
        </Field>

        <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 10, padding: "13px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 28, fontSize: 13, color: "#0369a1" }}>
          <input type="checkbox" defaultChecked style={{ accentColor: "#3b82f6" }} />
          <span>📍 Auto-detect my location</span>
        </div>

        {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626", marginBottom: 16 }}>⚠️ {error}</div>}

        <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 16 }} onClick={submit} disabled={loading}>
          {loading ? "Submitting…" : "📋 Submit Complaint"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children, required = false }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <label style={{ fontWeight: 700, fontSize: 13, color: "#374151", display: "block", marginBottom: 7 }}>
        {label}{required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  );
}
