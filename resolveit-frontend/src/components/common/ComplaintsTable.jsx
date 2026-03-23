import { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge";
import ComplaintDetailModal from "./ComplaintDetailModal";
import { authApi, complaintApi } from "../../services/api";

const COLS = "100px 1.2fr 1.5fr 1.2fr 1fr 130px";

/**
 * ComplaintsTable
 * Shared between Officer and Admin dashboards.
 * Fetches from the correct endpoint based on `role` prop.
 */
export default function ComplaintsTable({ role = "citizen", tab = "all", showAdvancedFilter = false, searchQuery = "" }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: "", category: "" });
  const [officers, setOfficers] = useState([]);
  const [assigning, setAssigning] = useState(null);
  const [viewId, setViewId] = useState(null);
  const [confirmStatus, setConfirmStatus] = useState(null); // { id, status }
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchData();
    if (role === "admin") {
      authApi.listUsers("OFFICER").then(setOfficers).catch(console.error);
    }
  }, [role, tab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let data;
      if (role === "admin") {
        data = await complaintApi.adminAll();
      } else if (role === "officer") {
        data = tab === "assigned" ? await complaintApi.assigned() : await complaintApi.officerAll();
      } else {
        data = await complaintApi.myComplaints();
      }
      setComplaints(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filtered = complaints.filter(c => {
    if (filter.status && c.status !== filter.status) return false;
    if (filter.category && c.category !== filter.category) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = c.complaintNumber?.toLowerCase().includes(q);
      const matchTitle = c.title?.toLowerCase().includes(q);
      const matchCitizen = c.citizenName?.toLowerCase().includes(q);
      if (!matchId && !matchTitle && !matchCitizen) return false;
    }

    return true;
  });

  async function handleStatusChange(id, newStatus) {
    setConfirmStatus({ id, status: newStatus });
  }

  async function proceedWithStatusChange() {
    const { id, status: newStatus } = confirmStatus;
    const statusLabel = newStatus.replace(/_/g, " ");
    
    try {
      const api = role === "admin" ? complaintApi.adminStatus : complaintApi.updateStatus;
      const updated = await api(id, { status: newStatus, note: `Status updated to ${statusLabel} via dashboard` });
      setComplaints(prev => prev.map(c => c.id === id ? updated : c));
      setConfirmStatus(null);
      setSuccessMsg(`Status successfully updated to ${statusLabel}`);
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) { 
      console.error(err); 
      setConfirmStatus(null);
    }
  }

  async function handleAssign(complaintId, officerId) {
    if (!officerId) return;
    try {
      const updated = await complaintApi.assignOfficer(complaintId, officerId);
      setComplaints(prev => prev.map(c => c.id === complaintId ? updated : c));
      setAssigning(null);
    } catch (err) { console.error(err); }
  }

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      {/* Filter bar */}
      <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <select
          className="input-base"
          style={{ width: "auto", padding: "7px 14px", fontSize: 13 }}
          value={filter.status}
          onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
        >
          <option value="">All Status</option>
          <option value="OPEN">Open</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>

        <select
          className="input-base"
          style={{ width: "auto", padding: "7px 14px", fontSize: 13 }}
          value={filter.category}
          onChange={e => setFilter(f => ({ ...f, category: e.target.value }))}
        >
          <option value="">All Categories</option>
          <option value="ROAD_DAMAGE">Road Damage</option>
          <option value="GARBAGE">Garbage</option>
          <option value="WATER_LEAKAGE">Water Leakage</option>
          <option value="STREETLIGHT">Streetlight</option>
          <option value="DRAINAGE">Drainage</option>
          <option value="PUBLIC_SAFETY">Public Safety</option>
        </select>

        {showAdvancedFilter && (
          <div style={{ marginLeft: "auto", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 9, padding: "7px 14px", fontSize: 13, fontWeight: 700, color: "#374151", cursor: "pointer" }}>
            Advanced Filter ▾
          </div>
        )}
      </div>

      {/* Table header */}
      <div className="table-header" style={{ gridTemplateColumns: COLS, padding: "10px 24px" }}>
        <span>ID</span><span>Citizen</span><span>Issue</span><span>Location</span><span>Status</span><span>Action</span>
      </div>

      {loading && <div style={{ padding: 32, textAlign: "center", color: "#94a3b8" }}>Loading complaints...</div>}

      {!loading && filtered.length === 0 && (
        <div style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
          <div style={{ fontWeight: 700 }}>No complaints found</div>
        </div>
      )}

      {filtered.map(c => (
        <div key={c.id} className="table-row" style={{ gridTemplateColumns: COLS, padding: "14px 24px" }}>
          <span 
            onClick={() => setViewId(c.id)}
            style={{ fontWeight: 700, color: "#1e40af", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}
          >
            {c.complaintNumber}
          </span>
          <span style={{ fontWeight: 700 }}>{c.citizenName}</span>
          <span style={{ color: "#334155" }}>{c.title}</span>
          <span style={{ color: "#64748b" }}>{c.location || "—"}</span>
          <StatusBadge status={(c.status || "OPEN").replace(/_/g, " ")} />
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {role === "admin" && !c.assignedOfficerId ? (
              <select
                className="input-base"
                style={{ padding: "5px 8px", fontSize: 11, width: "auto", background: "#eff6ff", borderColor: "#bfdbfe" }}
                onChange={e => handleAssign(c.id, e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Assign Officer...</option>
                {officers.map(o => (
                  <option key={o.id} value={o.id}>{o.fullName}</option>
                ))}
              </select>
            ) : (
              <select
                className="input-base"
                style={{ padding: "5px 8px", fontSize: 11, width: "auto" }}
                value={c.status}
                onChange={e => handleStatusChange(c.id, e.target.value)}
              >
                <option value="OPEN">Open</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            )}
          </div>
        </div>
      ))}

      {!loading && (
        <div style={{ padding: "12px 24px", borderTop: "1px solid #f1f5f9", fontSize: 12, color: "#94a3b8" }}>
          {filtered.length} complaint{filtered.length !== 1 ? "s" : ""}
        </div>
      )}

      {viewId && (
        <ComplaintDetailModal 
          complaintId={viewId} 
          role={role} 
          onClose={() => setViewId(null)} 
        />
      )}
      {confirmStatus && (
        <StatusConfirmPopup 
          status={confirmStatus.status} 
          onConfirm={proceedWithStatusChange}
          onCancel={() => setConfirmStatus(null)}
        />
      )}

      {/* Success Toast */}
      {successMsg && (
        <div style={{ position: "fixed", top: 24, right: 24, zIndex: 3000 }} className="fade-up">
           <div style={{ background: "#059669", color: "#fff", padding: "12px 24px", borderRadius: 12, fontWeight: 700, boxShadow: "0 10px 30px rgba(5,150,105,0.3)", display: "flex", alignItems: "center", gap: 12 }}>
              <span>✅</span> {successMsg}
           </div>
        </div>
      )}
    </div>
  );
}

/**
 * StatusConfirmPopup
 * A floating "Toast-style" confirmation that appears in the corner.
 */
function StatusConfirmPopup({ status, onConfirm, onCancel }) {
  const isMajor = status === "RESOLVED" || status === "CLOSED";
  const label = status.replace(/_/g, " ");

  return (
    <div style={{ 
      position: "fixed", 
      top: 0, 
      left: 0, 
      width: "100%", 
      height: "100%", 
      zIndex: 2500, 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "rgba(15, 23, 42, 0.4)", // Darker backdrop for better contrast
      backdropFilter: "blur(6px)"
    }}>
      <div className="card fade-up" style={{ 
        width: "90%",
        maxWidth: 440, 
        padding: "40px 32px", 
        boxShadow: "0 25px 70px -12px rgba(0,0,0,0.5)", 
        border: "1px solid rgba(0,0,0,0.05)", 
        background: "#fff",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        {/* Icon & Target */}
        <div style={{ position: "relative", marginBottom: 24 }}>
           <div style={{ fontSize: 64, filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.1))" }}>
             {isMajor ? "🎯" : "📝"}
           </div>
        </div>
        
        <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a", fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
          Confirm Status Update
        </h3>
        
        <p style={{ marginTop: 16, marginBottom: 0, fontSize: 16, color: "#64748b", fontWeight: 500 }}>
          You are marking this issue as <b style={{ color: "#1e40af", fontWeight: 800 }}>{label}</b>
        </p>

        {isMajor && (
          <div style={{ 
            width: "100%",
            marginTop: 24, 
            padding: "16px", 
            background: "#fff1f2", 
            color: "#be123c", 
            borderRadius: 12, 
            border: "1px solid #ffe4e6",
            display: "flex",
            alignItems: "center",
            gap: 12,
            textAlign: "left"
          }}>
            <span style={{ fontSize: 20 }}>📢</span>
            <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4 }}>
              This will trigger an automatic completion email to the citizen's registered address.
            </span>
          </div>
        )}
        
        {/* Buttons Row */}
        <div style={{ display: "flex", gap: 12, width: "100%", marginTop: 32 }}>
          <button 
            className="btn-outline" 
            style={{ 
              flex: 1, 
              height: 48, 
              justifyContent: "center", 
              fontSize: 14,
              borderWidth: "1.5px"
            }} 
            onClick={onCancel}
          >
            Go Back
          </button>
          <button 
            className="btn-primary" 
            style={{ 
              flex: 1, 
              height: 48, 
              justifyContent: "center", 
              fontSize: 14,
              background: isMajor ? "#059669" : "#3b82f6",
              boxShadow: isMajor ? "0 10px 15px -3px rgba(5,150,105,0.3)" : "0 10px 15px -3px rgba(59,130,246,0.3)"
            }} 
            onClick={onConfirm}
          >
            Confirm & Save
          </button>
        </div>
      </div>
    </div>
  );
}
