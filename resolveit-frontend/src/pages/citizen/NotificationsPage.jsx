import { useEffect, useState } from "react";
import { notifApi } from "../../services/api";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60)  return `${m}m ago`;
  if (m < 1440) return `${Math.floor(m/60)}h ago`;
  return `${Math.floor(m/1440)}d ago`;
}

export default function NotificationsPage() {
  const [notifs,  setNotifs]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notifApi.getAll()
      .then(setNotifs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function markAllRead() {
    notifApi.markAllRead().then(() => setNotifs(n => n.map(x => ({ ...x, read:true }))));
  }

  return (
    <div style={{ maxWidth:620 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <h2 style={{ fontFamily:"var(--font-display)", fontSize:22, fontWeight:800, color:"#0f172a" }}>Notifications</h2>
        <span style={{ fontSize:12, color:"#3b82f6", cursor:"pointer", fontWeight:700 }} onClick={markAllRead}>Mark all as read</span>
      </div>

      <div className="card" style={{ overflow:"hidden" }}>
        {loading && <div style={{ padding:32, textAlign:"center", color:"#94a3b8" }}>Loading…</div>}

        {!loading && notifs.length === 0 && (
          <div style={{ padding:48, textAlign:"center", color:"#94a3b8" }}>
            <div style={{ fontSize:36, marginBottom:12 }}>🔔</div>
            <div style={{ fontWeight:700 }}>No notifications yet</div>
          </div>
        )}

        {notifs.map((n, i) => (
          <div key={n.id} style={{ padding:"17px 24px", borderBottom: i < notifs.length-1 ? "1px solid #f1f5f9" : "none", display:"flex", gap:14, background: n.read ? "#fff" : "#f0f9ff" }}>
            <div style={{ width:42, height:42, background: n.read ? "#f1f5f9" : "#dbeafe", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
              {n.icon || "🔔"}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontWeight:700, fontSize:14, color:"#0f172a" }}>{n.title}</span>
                <span style={{ fontSize:11, color:"#94a3b8", whiteSpace:"nowrap", marginLeft:12 }}>{timeAgo(n.createdAt)}</span>
              </div>
              <p style={{ fontSize:13, color:"#64748b", margin:0, lineHeight:1.5 }}>{n.message}</p>
            </div>
            {!n.read && <div style={{ width:8, height:8, background:"#3b82f6", borderRadius:"50%", flexShrink:0, marginTop:6 }} />}
          </div>
        ))}
      </div>
    </div>
  );
}
