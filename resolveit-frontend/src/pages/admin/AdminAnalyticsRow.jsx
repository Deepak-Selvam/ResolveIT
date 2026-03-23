import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { complaintApi } from "../../services/api";

const AI_SUGGESTIONS = [
  "Increase Road Repairs in high-complaint zones to prevent recurring pothole issues.",
  "Install more Streetlights in areas with persistent streetlight complaints.",
  "Improve drainage infrastructure in flood-prone areas.",
  "Deploy additional sanitation workers to high-garbage-complaint streets.",
];

export default function AdminAnalyticsRow() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("heatmap"); // heatmap = locality, category = category

  useEffect(() => {
    fetchData();
  }, [view]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = view === "heatmap" 
        ? await complaintApi.localityStats() 
        : await complaintApi.categoryStats();
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 20, marginTop: 24 }}>
      {/* Chart card */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "#0f172a", margin: 0 }}>
            {view === "heatmap" ? "Regional Distribution (Areas)" : "Categorical Distribution"}
          </h3>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { id: "heatmap", label: "Heatmap" },
              { id: "category", label: "Category Wise" }
            ].map((v) => (
              <span 
                key={v.id} 
                onClick={() => setView(v.id)}
                style={{ 
                  padding: "4px 14px", 
                  background: view === v.id ? "#1e40af" : "#dbeafe", 
                  color: view === v.id ? "#fff" : "#1e40af", 
                  borderRadius: 9999, 
                  fontSize: 12, 
                  fontWeight: 700, 
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {v.label}
              </span>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", margin: "16px 0 8px" }}>
          {view === "heatmap" ? "Localities with Most Issues" : "Complaints by Category"}
        </div>

        {loading ? (
          <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>Loading chart…</div>
        ) : data.length === 0 ? (
          <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>No data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} barSize={38} margin={{ top: 16, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
              <Tooltip 
                contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} 
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar 
                dataKey="value" 
                fill={view === "heatmap" ? "#fbbf24" : "#60a5fa"} 
                radius={[6, 6, 0, 0]} 
                label={{ position: "top", fontSize: 10, fill: "#334155", fontWeight: 700 }} 
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, fontSize: 12, color: "#64748b" }}>
          <div style={{ width: 10, height: 10, background: view === "heatmap" ? "#fbbf24" : "#60a5fa", borderRadius: "50%" }} />
          {view === "heatmap" ? "Distribution by Area" : "Distribution by Category"}
        </div>
      </div>

      {/* AI Suggestions (Placeholder for future implementation) */}
      <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <span style={{ fontSize: 20 }}>💡</span>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "#0f172a", margin: 0 }}>AI Insights</h3>
        </div>
        <div style={{ padding: 32, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
          Inspecting recent complaint trends... <br />
          (Insights will appear once more data is collected)
        </div>
      </div>
    </div>
  );
}
