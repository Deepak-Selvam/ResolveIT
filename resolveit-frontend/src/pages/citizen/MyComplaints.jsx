import { useEffect, useState } from "react";
import StatusBadge from "../../components/common/StatusBadge";
import { complaintApi } from "../../services/api";

const COLS = "100px 1.5fr 1.5fr 1fr 110px";

export default function MyComplaints({ onView }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    complaintApi.myComplaints()
      .then(setComplaints)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "#0f172a" }}>My Complaints</h2>
        <button className="btn-primary" style={{ fontSize: 13, padding: "9px 18px" }}>+ New Complaint</button>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <div className="table-header" style={{ gridTemplateColumns: COLS, padding: "10px 24px" }}>
          <span>ID</span>
          <span>Issue</span>
          <span>Location</span>
          <span style={{ textAlign: "center" }}>Status</span>
          <span style={{ textAlign: "right" }}>Action</span>
        </div>

        {loading && <div style={{ padding: 32, textAlign: "center", color: "#94a3b8" }}>Loading complaints…</div>}
        {error && <div style={{ padding: 32, textAlign: "center", color: "#dc2626" }}>{error}</div>}

        {!loading && complaints.length === 0 && !error && (
          <div style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <div style={{ fontWeight: 700 }}>No complaints yet</div>
          </div>
        )}

        {complaints.map(c => (
          <div key={c.id} className="table-row" style={{ gridTemplateColumns: COLS, padding: "14px 24px" }}>
            <span style={{ fontWeight: 700, color: "#1e40af", fontSize: 13 }}>{c.complaintNumber}</span>
            <div>
              <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 14 }}>{c.title}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{new Date(c.createdAt).toLocaleDateString()}</div>
            </div>
            <span style={{ color: "#64748b", fontSize: 14 }}>{c.location || "—"}</span>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <StatusBadge status={(c.status || "OPEN").replace(/_/g, " ")} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                className="btn-primary"
                style={{ padding: "6px 12px", fontSize: 12 }}
                onClick={() => onView(c.id)}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
