import { useState } from "react";
import Logo from "../../components/common/Logo";
import DashboardTopbar from "../../components/layout/DashboardTopbar";
import ComplaintsTable from "../../components/common/ComplaintsTable";
import AdminAnalyticsRow from "./AdminAnalyticsRow";
import UserManagement from "./UserManagement";
import AreaTrendChart from "../officer/AreaTrendChart";

const NAV_ITEMS = [
  { id: "complaints", icon: "📋", label: "All Complaints" },
  { id: "users", icon: "👥", label: "Manage Staff" },
  { id: "category", icon: "🏷️", label: "Filter by Category", sub: true },
  { id: "area", icon: "📍", label: "Area Analysis", sub: true },
];

/**
 * AdminDashboard
 * Shell layout for the super-admin role.
 */
export default function AdminDashboard({ user, onLogout, onNavigate }) {
  const [tab, setTab] = useState("complaints");
  const [search, setSearch] = useState("");

  const displayName = (user?.firstName && user?.lastName)
    ? `${user.firstName} ${user.lastName}`
    : (user?.fullName && user.fullName !== "null null")
      ? user.fullName
      : "Administrator";

  const getTitle = () => {
    switch (tab) {
      case "users": return "Staff Management";
      case "category": return "Categorical Distribution";
      case "area": return "Area Analysis & Insights";
      default: return "Admin Dashboard - All Complaints";
    }
  };

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
        <div style={{ padding: "6px 4px", marginBottom: 16 }}>
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
          user={{ ...user, fullName: displayName }}
          avatarEmoji="👮‍♀️"
          showSearch
          searchQuery={search}
          onSearch={setSearch}
          onNavigate={onNavigate}
        />

        <div style={{ padding: "28px 32px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>
            {getTitle()}
          </h2>

          {tab === "complaints" && (
            <>
              <ComplaintsTable role="admin" showAdvancedFilter searchQuery={search} />
              <AdminAnalyticsRow />
            </>
          )}

          {tab === "category" && (
            <div className="fade-up">
              <ComplaintsTable role="admin" showAdvancedFilter searchQuery={search} />
            </div>
          )}

          {tab === "area" && (
            <div className="fade-up">
              <AreaTrendChart />
              <div style={{ marginTop: 24 }}>
                <AdminAnalyticsRow />
              </div>
              <div style={{ marginTop: 24 }}>
                <ComplaintsTable role="admin" showAdvancedFilter searchQuery={search} />
              </div>
            </div>
          )}

          {tab === "users" && <UserManagement />}
        </div>
      </div>
    </div>
  );
}
