import { useState } from "react";
import Logo from "../../components/common/Logo";
import DashboardTopbar from "../../components/layout/DashboardTopbar";
import ComplaintsTable from "../../components/common/ComplaintsTable";
import AreaTrendChart from "./AreaTrendChart";
import AdminAnalyticsRow from "../admin/AdminAnalyticsRow";


const NAV_ITEMS = [
  { id: "complaints", icon: "📋", label: "All Complaints" },
  { id: "assigned", icon: "📌", label: "My Assigned Complaints", sub: true },
  { id: "category", icon: "🏷️", label: "Filter by Category", sub: true },
  { id: "area", icon: "📍", label: "Area Analysis", sub: true },
];

/**
 * OfficerDashboard
 * Shell layout for the officer role.
 */
export default function OfficerDashboard({ user, onLogout, onNavigate }) {
  const [tab, setTab] = useState("complaints");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div style={{ fontFamily: "var(--font-body)", display: "flex", minHeight: "100vh", background: "#f0f4f8" }}>

      {/* ── Sidebar ── */}
      <aside
        style={{
          width: 208,
          background: "#fff",
          borderRight: "1px solid #e2e8f0",
          padding: "18px 12px",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <div style={{ padding: "6px 4px", marginBottom: 18 }}>
          <Logo size={30} fontSize={16} />
        </div>

        {NAV_ITEMS.map((n) => (
          <div
            key={n.id}
            className={`nav-item ${tab === n.id ? "active" : ""}`}
            onClick={() => setTab(n.id)}
          >
            <span>{n.icon}</span>
            <span style={{ flex: 1 }}>{n.label}</span>
            {n.sub && <span style={{ fontSize: 11, opacity: 0.6 }}>›</span>}
          </div>
        ))}

        <div style={{ marginTop: "auto" }}>
          <div className="nav-item danger" onClick={onLogout}>
            <span>🚪</span><span>Logout</span>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <DashboardTopbar 
          user={user} 
          avatarEmoji="👮" 
          showSearch 
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onNavigate={onNavigate} 
        />

        <div style={{ padding: "28px 32px" }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>
              {tab === "complaints" ? "All Platform Complaints" : "My Assigned Tasks"}
            </h2>
            <p style={{ fontSize: 13, color: "#64748b" }}>
              {tab === "complaints"
                ? "View all active civic issues across the platform."
                : "Manage and resolve issues specifically assigned to you."}
            </p>
          </div>

          <ComplaintsTable 
            role="officer" 
            tab={tab} 
            showAdvancedFilter={false} 
            searchQuery={searchQuery}
          />

          {tab === "complaints" && (
            <div style={{ marginTop: 24 }}>
              <AreaTrendChart />
              <div style={{ marginTop: 24 }}>
                <AdminAnalyticsRow />
              </div>
            </div>
          )}

          {tab === "area" && (
            <div className="fade-up" style={{ marginTop: 24 }}>
              <AreaTrendChart />
              <div style={{ marginTop: 24 }}>
                <AdminAnalyticsRow />
              </div>
            </div>
          )}

          {tab === "category" && (
            <div className="fade-up" style={{ marginTop: 24 }}>
              <AdminAnalyticsRow />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
