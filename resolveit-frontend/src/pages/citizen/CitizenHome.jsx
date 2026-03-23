import { useEffect, useState } from "react";
import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";
import { complaintApi } from "../../services/api";

const STAT_BG = ["#dbeafe", "#dcfce7", "#fef9c3", "#f3e8ff"];
const STAT_ICONS = ["📋", "✅", "⏳", "⭐"];
const STAT_LABELS = ["Complaints Raised", "Resolved", "In Progress", "Feedback Given"];

export default function CitizenHome({ user, setTab }) {
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([complaintApi.citizenStats(), complaintApi.myComplaints()])
      .then(([s, c]) => { setStats(s); setComplaints(c.slice(0, 4)); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statValues = stats
    ? [stats.totalRaised, stats.resolved, stats.inProgress, stats.feedbackGiven]
    : [0, 0, 0, 0];

  return (
    <div style={{ display: "flex", gap: 24 }}>
      <div style={{ flex: 1 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
          Welcome back, {user?.firstName || "there"}! 👋
        </h2>
        <p style={{ color: "#64748b", marginBottom: 28, fontSize: 14 }}>Here's your activity overview.</p>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
          {STAT_LABELS.map((label, i) => (
            <StatCard key={label} icon={STAT_ICONS[i]} value={loading ? "…" : String(statValues[i]).padStart(2, "0")} label={label} bg={STAT_BG[i]} />
          ))}
        </div>

        {/* Recent complaints */}
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "#0f172a", margin: 0 }}>Recent Complaints</h3>
            <button
              onClick={() => setTab("mycomplaints")}
              style={{ background: "none", border: "none", color: "#3b82f6", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
            >
              View All →
            </button>
          </div>
          {loading && <div style={{ padding: 32, textAlign: "center", color: "#94a3b8" }}>Loading…</div>}
          {!loading && complaints.length === 0 && (
            <div style={{ padding: 32, textAlign: "center", color: "#94a3b8" }}>No complaints yet. Submit your first one!</div>
          )}
          {complaints.map(c => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", padding: "15px 24px", borderBottom: "1px solid #f8fafc", gap: 16, cursor: "pointer" }} className="card-hover">
              <span style={{ fontSize: 22 }}>📋</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{c.complaintNumber} — {c.title}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>{c.location} · {new Date(c.createdAt).toLocaleDateString()}</div>
              </div>
              <StatusBadge status={c.status.replace(/_/g, " ")} />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access Sidebar */}
      <div style={{ width: 280, display: "flex", flexDirection: "column", gap: 20 }}>

        <div className="card" style={{ padding: 24, background: "linear-gradient(135deg, #1e40af, #3b82f6)", color: "#fff" }}>
          <div style={{ fontSize: 24, marginBottom: 12 }}>🏛️</div>
          <h4 style={{ fontSize: 15, fontWeight: 800, marginBottom: 8 }}>Need Help?</h4>
          <p style={{ fontSize: 12, opacity: 0.9, lineHeight: 1.5, marginBottom: 16 }}>
            Our support team is available 24/7 for any civic coordination issues.
          </p>
          <button style={{ width: "100%", background: "#fff", color: "#1e40af", border: "none", borderRadius: 8, padding: "10px", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}


