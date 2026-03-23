import { useEffect, useState } from "react";
import StatusBadge from "../../components/common/StatusBadge";
import { complaintApi } from "../../services/api";

export default function ComplaintDetail({ complaintId, onBack }) {
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        complaintApi.getOne(complaintId)
            .then(setComplaint)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [complaintId]);

    if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Loading details...</div>;
    if (error) return <div style={{ padding: 40, textAlign: "center", color: "#dc2626" }}>Error: {error}</div>;
    if (!complaint) return null;

    return (
        <div className="fade-up">
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24 }}>
                <button
                    onClick={onBack}
                    style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontWeight: 700 }}
                >
                    ← Back
                </button>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    Complaint Details
                </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
                {/* Main Info */}
                <div className="card" style={{ padding: 32 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
                        <div>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                {complaint.complaintNumber}
                            </span>
                            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", margin: "8px 0" }}>{complaint.title}</h1>
                            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                <StatusBadge status={complaint.status.replace(/_/g, " ")} />
                                <span style={{ color: "#64748b", fontSize: 14 }}>• Registered on {new Date(complaint.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: 32 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>Description</h3>
                        <p style={{ color: "#475569", lineHeight: 1.7, fontSize: 15 }}>{complaint.description}</p>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, padding: "24px 0", borderTop: "1px solid #f1f5f9" }}>
                        <div>
                            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase" }}>Category</h3>
                            <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>{complaint.category.replace(/_/g, " ")}</div>
                        </div>
                        <div>
                            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase" }}>Location</h3>
                            <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>{complaint.location}</div>
                        </div>
                    </div>

                    {complaint.imageUrl && (
                        <div style={{ marginTop: 24 }}>
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>Attached Photo</h3>
                            <img src={complaint.imageUrl} alt="Complaint" style={{ width: "100%", borderRadius: 12, maxHeight: 400, objectFit: "cover" }} />
                        </div>
                    )}
                </div>

                {/* Sidebar: Timeline */}
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    <div className="card" style={{ padding: 24 }}>
                        <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>Resolution Timeline</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                            {complaint.statusHistory.map((log, i) => (
                                <div key={i} style={{ display: "flex", gap: 16, position: "relative", paddingBottom: 24 }}>
                                    {i < complaint.statusHistory.length - 1 && (
                                        <div style={{ position: "absolute", left: 7, top: 20, bottom: 0, width: 2, background: "#e2e8f0" }} />
                                    )}
                                    <div style={{
                                        width: 16, height: 16, borderRadius: "50%",
                                        background: i === 0 ? "#3b82f6" : "#e2e8f0",
                                        border: "4px solid #fff", boxShadow: "0 0 0 1px #e2e8f0",
                                        zIndex: 1, marginTop: 4
                                    }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{log.status.replace(/_/g, " ")}</span>
                                            <span style={{ fontSize: 11, color: "#94a3b8" }}>{new Date(log.timestamp).toLocaleDateString()}</span>
                                        </div>
                                        {log.note && <p style={{ fontSize: 13, color: "#64748b", marginTop: 4, margin: 0 }}>{log.note}</p>}
                                        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>— by {log.updatedBy}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {complaint.status === "RESOLVED" && !complaint.rating && (
                        <div className="card" style={{ padding: 24, background: "#f0fdf4", border: "1px solid #bcf0da" }}>
                            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#166534", marginBottom: 8 }}>Issue Resolved!</h3>
                            <p style={{ fontSize: 13, color: "#166534", marginBottom: 16 }}>The authorities have marked this as completed. Please share your feedback.</p>
                            <button className="btn-primary" style={{ width: "100%", background: "#166534" }}>Submit Feedback</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
