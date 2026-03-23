import { getStatusStyle } from "../../utils/helpers";

/**
 * StatusBadge
 * Renders a pill badge for complaint status.
 * @param {string} status - "Open" | "In Progress" | "Resolved" | "Closed"
 */
export default function StatusBadge({ status }) {
  const style = getStatusStyle(status);
  return (
    <span
      style={{
        ...style,
        padding: "3px 12px",
        borderRadius: 9999,
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "inherit",
        whiteSpace: "nowrap",
        display: "inline-block",
      }}
    >
      {status}
    </span>
  );
}
