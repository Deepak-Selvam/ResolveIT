import { useState } from "react";
import DashboardTopbar from "../../components/layout/DashboardTopbar";
import Logo from "../../components/common/Logo";

import CitizenHome from "./CitizenHome";
import MyComplaints from "./MyComplaints";
import SubmitComplaint from "./SubmitComplaint";
import NotificationsPage from "./NotificationsPage";
import CitizenProfile from "./CitizenProfile";
import ComplaintDetail from "./ComplaintDetail";

const NAV_ITEMS = [
  { id: "dashboard", icon: "⊞", label: "Dashboard" },
  { id: "mycomplaints", icon: "📋", label: "My Complaints" },
  { id: "submit", icon: "✏️", label: "Submit Complaint" },
  { id: "notifications", icon: "🔔", label: "Notifications" },
  { id: "profile", icon: "👤", label: "Profile" },
];

/**
 * CitizenDashboard
 * Shell layout for the citizen role — sidebar + routed content area.
 */
export default function CitizenDashboard({ user, onLogout, onNavigate }) {
  const [tab, setTab] = useState("dashboard");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  function handleNavClick(id) {
    setTab(id);
    setSelectedComplaint(null); // Clear selected complaint on nav change
  }

  function handleViewComplaint(id) {
    setSelectedComplaint(id);
    setTab("complaint-detail");
  }

  function handleTopNav(target) {
    if (target === "dashboard") {
      setTab("dashboard");
    } else {
      onNavigate(target);
    }
  }

  return (
    <div style={{ fontFamily: "var(--font-body)", display: "flex", minHeight: "100vh", background: "#f0f4f8" }}>

      {/* ── Sidebar ── */}
      <aside
        style={{
          width: 224,
          background: "#fff",
          borderRight: "1px solid #e2e8f0",
          padding: "22px 14px",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <div style={{ padding: "6px 4px", marginBottom: 20 }}>
          <Logo size={30} fontSize={16} />
        </div>

        {/* Nav items */}
        {NAV_ITEMS.map((n) => (
          <div
            key={n.id}
            className={`nav-item ${tab === n.id ? "active" : ""}`}
            onClick={() => handleNavClick(n.id)}
          >
            <span>{n.icon}</span>
            <span style={{ flex: 1 }}>{n.label}</span>
          </div>
        ))}

        {/* Emergencies Area (Branding focus) */}
        <div style={{ marginTop: "auto" }}>
          <div
            style={{
              background: "#fef2f2", borderRadius: 12,
              padding: 14, marginBottom: 12,
            }}
          >
            <div style={{ fontSize: 12, color: "#dc2626", fontWeight: 800 }}>🏛️ Official Support</div>
            <div style={{ fontSize: 13, color: "#dc2626", marginTop: 5, lineHeight: 1.4 }}>
              For urgent civic hazards, contact the municipal helpline.
            </div>
          </div>
          <div className="nav-item danger" onClick={onLogout}>
            <span>🚪</span><span>Logout</span>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <DashboardTopbar user={user} showSearch={false} onNavigate={handleTopNav} />
        <div style={{ padding: "30px 32px" }}>
          {tab === "dashboard" && <CitizenHome user={user} setTab={setTab} />}
          {tab === "mycomplaints" && <MyComplaints onView={handleViewComplaint} />}
          {tab === "submit" && <SubmitComplaint onDone={() => setTab("mycomplaints")} />}
          {tab === "complaint-detail" && <ComplaintDetail complaintId={selectedComplaint} onBack={() => setTab("mycomplaints")} />}
          {tab === "notifications" && <NotificationsPage />}
          {tab === "profile" && <CitizenProfile user={user} setTab={setTab} />}
        </div>
      </div>
    </div>
  );
}
