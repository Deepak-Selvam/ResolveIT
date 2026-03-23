/**
 * StatCard
 * Displays a single metric (icon + number + label).
 */
export default function StatCard({ icon, value, label, bg = "#dbeafe", compact = false }) {
  if (compact) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div
          style={{
            width: 36, height: 36, background: bg,
            borderRadius: 10, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 16, flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div>
          <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{value}</div>
          <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>{label}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 20 }}>
      <div
        style={{
          width: 44, height: 44, background: bg,
          borderRadius: 12, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 20, marginBottom: 12,
        }}
      >
        {icon}
      </div>
      <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 28, fontWeight: 800, color: "#0f172a" }}>{value}</div>
      <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600, marginTop: 2 }}>{label}</div>
    </div>
  );
}
