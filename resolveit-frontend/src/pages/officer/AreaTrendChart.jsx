import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { complaintApi } from "../../services/api";

export default function AreaTrendChart() {
  const [trendData, setTrendData] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [days,      setDays]      = useState(30);

  useEffect(() => {
    setLoading(true);
    complaintApi.trend(days)
      .then(setTrendData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [days]);

  return (
    <div className="card" style={{ padding:24 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h3 style={{ fontFamily:"var(--font-display)", fontSize:16, fontWeight:800, color:"#0f172a", margin:0 }}>Complaints Trend (Timeline)</h3>
        <select 
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          style={{ background:"#f1f5f9", border:"1px solid #e2e8f0", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:700, color:"#374151", outline: "none", cursor: "pointer" }}
        >
          <option value={7}>Last 7 Days</option>
          <option value={15}>Last 15 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={60}>Last 60 Days</option>
          <option value={90}>Last 90 Days</option>
        </select>
      </div>

      {loading ? (
        <div style={{ height:210, display:"flex", alignItems:"center", justifyContent:"center", color:"#94a3b8" }}>Loading trend…</div>
      ) : trendData.length === 0 ? (
        <div style={{ height:210, display:"flex", alignItems:"center", justifyContent:"center", color:"#94a3b8" }}>No data for the last 30 days</div>
      ) : (
        <ResponsiveContainer width="100%" height={210}>
          <AreaChart data={trendData} margin={{ top:5, right:10, bottom:5, left:0 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize:11, fill:"#94a3b8" }} />
            <YAxis tick={{ fontSize:11, fill:"#94a3b8" }} />
            <Tooltip contentStyle={{ borderRadius:8, border:"1px solid #e2e8f0", fontSize:12 }} />
            <Area type="monotone" dataKey="complaints" stroke="#3b82f6" fill="url(#areaGrad)" strokeWidth={2.5} dot={{ r:4, fill:"#3b82f6", strokeWidth:0 }} activeDot={{ r:6 }} />
          </AreaChart>
        </ResponsiveContainer>
      )}

      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:12, fontSize:12, color:"#64748b" }}>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <div style={{ width:10, height:10, background:"#3b82f6", borderRadius:"50%" }} />
          Complaints Trend
        </div>
        <span>⟳ Last {days} Days</span>
      </div>
    </div>
  );
}
