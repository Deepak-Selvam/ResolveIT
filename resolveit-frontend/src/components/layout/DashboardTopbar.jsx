import Logo from "../common/Logo";

/**
 * DashboardTopbar
 * Sticky top bar inside ALL authenticated dashboard layouts.
 * Always shows the logged-in user's name + avatar on the right.
 * Never shows Login / Register buttons.
 *
 * @param {object}  user        - logged-in user object { name, role, ... }
 * @param {string}  avatarEmoji - emoji shown in the avatar circle
 * @param {boolean} showSearch  - if true: shows a search bar on the left
 *                                if false: shows Logo + nav links on the left
 */
export default function DashboardTopbar({ user, avatarEmoji = "👤", showSearch = false, searchQuery = "", onSearch, onNavigate }) {
  const ROLE_LABEL = {
    citizen: "Citizen",
    officer: "Officer",
    admin: "Admin",
  };

  const dashboardTab = user?.role === "citizen" ? "dashboard" : "complaints";

  return (
    <div
      style={{
        background: "#fff",
        borderBottom: "1px solid #e2e8f0",
        padding: "13px 28px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* ── Left side ── */}
      {showSearch ? (
        /* Search bar (officer / admin) */
        <div
          style={{
            flex: 1,
            background: "#f1f5f9",
            borderRadius: 10,
            padding: "4px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            transition: "all 0.2s ease",
            border: "1px solid transparent",
          }}
          onFocus={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.borderColor = "#3b82f6";
            e.currentTarget.style.boxShadow = "0 0 0 4px rgba(59, 130, 246, 0.1)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.background = "#f1f5f9";
            e.currentTarget.style.borderColor = "transparent";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <span style={{ fontSize: 18, color: "#94a3b8" }}>🔍</span>
          <input
            type="text"
            placeholder="Search by ID, Title or Citizen Name..."
            value={searchQuery}
            onChange={(e) => onSearch?.(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              outline: "none",
              fontSize: 14,
              color: "#0f172a",
              fontWeight: 500,
              padding: "8px 0",
            }}
          />
        </div>
      ) : (
        /* Logo + nav links (citizen) */
        <>
          <div style={{ cursor: "pointer" }} onClick={() => onNavigate?.("home")}>
            <Logo size={30} fontSize={16} />
          </div>
          <div style={{ flex: 1 }} />
          <nav style={{ display: "flex", gap: 24, alignItems: "center" }}>
            {["Home", "About", "Services", "Dashboard"].map((l) => (
              <span
                key={l}
                onClick={() => {
                  if (l === "Dashboard") onNavigate?.("dashboard");
                  else if (l === "Home") onNavigate?.("home");
                  else if (l === "About" || l === "Services") {
                    onNavigate?.("home");
                    setTimeout(() => {
                      const id = l.toLowerCase().replace(" ", "-");
                      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }
                }}
                style={{ cursor: "pointer", fontWeight: 600, fontSize: 13, color: "#64748b" }}
              >
                {l}
              </span>
            ))}
          </nav>
        </>
      )}

      {/* ── Right side: always shows user info, never Login/Register ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Name + role */}
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", lineHeight: 1.2 }}>
            {user?.fullName || user?.name || "User"}
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>
            {ROLE_LABEL[user?.role] || ""}
          </div>
        </div>

        {/* Avatar */}
        <div
          style={{
            width: 38, height: 38,
            background: "linear-gradient(135deg,#dbeafe,#bfdbfe)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20,
          }}
        >
          {avatarEmoji}
        </div>
      </div>
    </div>
  );
}
