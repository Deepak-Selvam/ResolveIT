import Logo from "../common/Logo";

/**
 * PublicNavbar
 * Top navigation bar used on Landing, Login, and Register pages.
 * @param {function} onNavigate - routing callback("home"|"login"|"register")
 * @param {string}   activePage - highlights the active link
 */
export default function PublicNavbar({ onNavigate, activePage = "home", user }) {
  const links = ["Home", "About", "Services", "Contact"];

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 52px",
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 1px 12px rgba(0,0,0,0.06)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ cursor: "pointer" }} onClick={() => onNavigate("home")}>
        <Logo />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        {links.map((l) => (
          <span
            key={l}
            onClick={() => {
              if (l === "Contact") {
                onNavigate("home");
                setTimeout(() => {
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              } else {
                onNavigate("home");
              }
            }}
            style={{
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14,
              color: activePage === l.toLowerCase() ? "#1e40af" : "#475569",
              transition: "color 0.2s",
            }}
          >
            {l}
          </span>
        ))}

        {!user ? (
          <>
            <button className="btn-outline" style={{ padding: "7px 18px", fontSize: 13 }} onClick={() => onNavigate("login")}>
              Login
            </button>
            <button className="btn-primary" style={{ padding: "8px 18px", fontSize: 13 }} onClick={() => onNavigate("register")}>
              Register
            </button>
          </>
        ) : (
          <button className="btn-primary" style={{ padding: "8px 18px", fontSize: 13 }} onClick={() => onNavigate("dashboard")}>
            Go to Dashboard
          </button>
        )}
      </div>
    </nav>
  );
}
