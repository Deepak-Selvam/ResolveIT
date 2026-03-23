import { useEffect, useState } from "react";
import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";
import { authApi, complaintApi } from "../../services/api";



export default function CitizenProfile({ user, setTab }) {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [profile, setProfile] = useState(user || {});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Promise.all([complaintApi.citizenStats(), complaintApi.myComplaints()])
      .then(([s, c]) => {
        setStats(s);
        setRecent(c.slice(0, 3));
      })
      .catch(console.error);
  }, []);

  const statCards = stats ? [
    { l: "Complaints Raised", v: String(stats.totalRaised), icon: "📋", bg: "#dbeafe" },
    { l: "Resolved", v: String(stats.resolved), icon: "✅", bg: "#dcfce7" },
    { l: "In Progress", v: String(stats.inProgress), icon: "⏳", bg: "#fef9c3" },
    { l: "Feedback Given", v: String(stats.feedbackGiven), icon: "⭐", bg: "#f3e8ff" },
  ] : [];

  function handleChange(e) {
    setProfile(p => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await authApi.updateMe(profile);
      setProfile(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }



  return (
    <div>
      <div style={{ display: "flex", gap: 22, marginBottom: 22 }}>
        {/* Profile form */}
        <div className="card" style={{ flex: 2, padding: 28 }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Home › Profile</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "4px 0 0" }}>My Profile</h2>
          </div>

          {/* Identity strip */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, background: "#f8fafc", borderRadius: 12, padding: "16px 18px", marginBottom: 22 }}>
            <div style={{ width: 58, height: 58, background: "linear-gradient(135deg,#dbeafe,#bfdbfe)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>👤</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: "#0f172a" }}>{profile.fullName || (profile.firstName + " " + profile.lastName)}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>ID: {profile.id}</div>
              <span style={{ background: "#dcfce7", color: "#16a34a", fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 9999 }}>✓ Verified</span>
            </div>
            <div style={{ marginLeft: "auto", fontSize: 13, color: "#64748b" }}>📍 {profile.city || "—"}</div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "2px solid #f1f5f9", marginBottom: 22 }}>
            {["Personal Information", "Grievance History", "Feedback"].map((t, i) => (
              <div key={t} style={{ padding: "10px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer", color: i === 0 ? "#1e40af" : "#64748b", borderBottom: i === 0 ? "2px solid #1e40af" : "2px solid transparent", marginBottom: -2 }}>{t}</div>
            ))}
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            <PFRow label="Full Name">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <PFInput label="First Name" name="firstName" value={profile.firstName || ""} onChange={handleChange} />
                <PFInput label="Last Name" name="lastName" value={profile.lastName || ""} onChange={handleChange} />
              </div>
            </PFRow>
            <PFInput label="Email Address" name="email" value={profile.email || ""} onChange={handleChange} type="email" readOnly />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              <PFInput label="Phone" name="phone" value={profile.phone || ""} onChange={handleChange} />
              <PFInput label="Gender" name="gender" value={profile.gender || ""} onChange={handleChange} />
              <PFInput label="Date of Birth" name="dateOfBirth" value={profile.dateOfBirth || ""} onChange={handleChange} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <PFInput label="Locality" name="locality" value={profile.locality || ""} onChange={handleChange} />
              <PFInput label="City" name="city" value={profile.city || ""} onChange={handleChange} />
            </div>
          </div>

          <button className="btn-primary" style={{ marginTop: 22, padding: "11px 26px", fontSize: 14 }} onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : saved ? "✓ Saved!" : "Update Profile"}
          </button>
        </div>

        {/* Right: stats */}
        <div style={{ flex: "0 0 238px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: "#0f172a", marginBottom: 14 }}>Account Stats</div>
            {statCards.map(s => <StatCard key={s.l} icon={s.icon} value={s.v} label={s.l} bg={s.bg} compact />)}
          </div>

        </div>
      </div>

      {/* Recent */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", marginBottom: 16 }}>Recent Activities</div>
        {recent.length === 0 && <div style={{ color: "#94a3b8", fontSize: 14 }}>No recent activity.</div>}
        {recent.map((c, i) => (
          <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 0", borderBottom: i < recent.length - 1 ? "1px solid #f8fafc" : "none" }}>
            <div style={{ width: 40, height: 40, background: "#f1f5f9", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📋</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{c.complaintNumber}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>{c.title}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <StatusBadge status={c.status.replace(/_/g, " ")} />
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{new Date(c.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: "14px 24px", display: "flex", gap: 32 }}>
        {["✉ Support@resolveit.gov", "📞 1800-123-4567", "📍 New Delhi, India"].map(c => (
          <span key={c} style={{ fontSize: 13, color: "#64748b" }}>{c}</span>
        ))}
      </div>
    </div>
  );
}

function PFRow({ label, children }) {
  return <div>{children}</div>;
}

function PFInput({ label, name, value, onChange, type = "text", readOnly = false }) {
  return (
    <div>
      <label style={{ fontWeight: 700, fontSize: 12, color: "#374151", display: "block", marginBottom: 5 }}>{label}</label>
      <input className="input-base" type={type} name={name} value={value} onChange={onChange} readOnly={readOnly} style={readOnly ? { background: "#f1f5f9", cursor: "not-allowed" } : {}} />
    </div>
  );
}
