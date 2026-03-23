import { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge";
import { complaintApi } from "../../services/api";

export default function ComplaintDetailModal({ complaintId, role, onClose }) {
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, [complaintId]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      let data;
      if (role === "admin") data = await complaintApi.getOneAdmin(complaintId);
      else if (role === "officer") data = await complaintApi.getOneOfficer(complaintId);
      else data = await complaintApi.getOne(complaintId);
      setComplaint(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!complaintId) return null;

  return (
    <div 
      style={{ 
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
        background: "rgba(15, 23, 42, 0.6)", 
        display: "flex", alignItems: "center", justifyContent: "center", 
        zIndex: 1000, 
        backdropFilter: "blur(4px)" 
      }}
      onClick={onClose}
    >
      <div 
        style={{ 
          background: "#fff", width: "90%", maxWidth: 800, 
          borderRadius: 20, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
          maxHeight: "90vh", overflowY: "auto", position: "relative"
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{ position: "absolute", top: 20, right: 20, background: "#f1f5f9", border: "none", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontWeight: 800, color: "#64748b" }}
        >✕</button>

        {loading ? (
          <div style={{ padding: 60, textAlign: "center", color: "#94a3b8" }}>Loading details...</div>
        ) : !complaint ? (
          <div style={{ padding: 60, textAlign: "center", color: "#94a3b8" }}>Could not fetch details</div>
        ) : (
          <div style={{ padding: 32 }}>
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#2563eb", background: "#eff6ff", padding: "4px 10px", borderRadius: 6, textTransform: "uppercase" }}>
                {complaint.complaintNumber}
              </span>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: "12px 0 8px" }}>{complaint.title}</h2>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <StatusBadge status={complaint.status} />
                <span style={{ fontSize: 13, color: "#64748b" }}>Registered: {new Date(complaint.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 32 }}>
              <div>
                <div style={{ marginBottom: 24 }}>
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 8 }}>Description</h4>
                  <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.6, margin: 0 }}>{complaint.description}</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <h4 style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 6 }}>Category</h4>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: 0 }}>{complaint.category?.replace(/_/g, " ")}</p>
                  </div>
                  <div>
                    <h4 style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 6 }}>Citizen</h4>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: 0 }}>{complaint.citizenName}</p>
                  </div>
                </div>

                <div style={{ marginTop: 24 }}>
                   <h4 style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 8 }}>Precise Location</h4>
                   <p style={{ fontSize: 14, color: "#334155", margin: 0 }}>{complaint.location}</p>
                </div>
              </div>

              <div>
                {complaint.imageUrl && (
                  <div style={{ marginBottom: 24 }}>
                    <h4 style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 8 }}>Attachment</h4>
                    <img src={complaint.imageUrl} style={{ width: "100%", borderRadius: 12, border: "1px solid #e2e8f0" }} alt="Evidence" />
                  </div>
                )}

                <h4 style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 12 }}>Status History</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {complaint.statusHistory?.map((h, i) => (
                    <div key={i} style={{ padding: "8px 12px", borderLeft: "2px solid #e2e8f0", background: "#f8fafc" }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: "#334155" }}>{h.status.replace(/_/g, " ")}</div>
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>By: {h.updatedBy}</div>
                      {h.note && <div style={{ fontSize: 11, color: "#64748b", fontStyle: "italic", marginTop: 2 }}>"{h.note}"</div>}
                    </div>
                  )).reverse()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
