/**
 * CityscapeBanner
 * Decorative city skyline strip used on Login and Register pages.
 * @param {number} height - banner height in px (default 150)
 */
export default function CityscapeBanner({ height = 150 }) {
  return (
    <div
      style={{
        height,
        background: "linear-gradient(180deg,#bfdbfe,#dbeafe)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          fontSize: 56,
          letterSpacing: 4,
          opacity: 0.38,
          marginBottom: -12,
          userSelect: "none",
        }}
      >
        🏙️🌳🏢🌳🏗️🌳🏢🌳🏙️
      </div>
    </div>
  );
}
