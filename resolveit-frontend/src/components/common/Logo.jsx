/**
 * Logo
 * Shared brand mark used across all pages.
 * @param {number} size - icon box size in px (default 34)
 * @param {number} fontSize - brand text size (default 18)
 */
export default function Logo({ size = 34, fontSize = 18 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: size,
          height: size,
          background: "linear-gradient(135deg,#1e40af,#3b82f6)",
          borderRadius: size * 0.27,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ color: "#fff", fontSize: size * 0.48 }}>✓</span>
      </div>
      <span
        style={{
          fontFamily: "'Sora', sans-serif",
          fontWeight: 800,
          fontSize,
          color: "#1e3a8a",
          lineHeight: 1,
        }}
      >
        Resolve{" "}
        <span style={{ color: "#3b82f6" }}>IT</span>
      </span>
    </div>
  );
}
