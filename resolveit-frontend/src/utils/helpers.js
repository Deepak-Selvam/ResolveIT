/**
 * Returns inline-style object for a given complaint status.
 */
export function getStatusStyle(status) {
  const map = {
    "Open":        { background: "#3b82f6", color: "#fff" },
    "In Progress": { background: "#f59e0b", color: "#fff" },
    "Resolved":    { background: "#10b981", color: "#fff" },
    "Closed":      { background: "#6b7280", color: "#fff" },
  };
  return map[status] || map["Open"];
}

/**
 * Parses a semicolon-separated "key:value" CSS string into a style object.
 * e.g. "color:red;font-size:14px" → { color: "red", fontSize: "14px" }
 */
export function parseInlineStyle(str = "") {
  return Object.fromEntries(
    str
      .split(";")
      .filter(Boolean)
      .map((s) => {
        const [k, v] = s.split(":");
        // convert kebab-case to camelCase
        const camel = k.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        return [camel, v.trim()];
      })
  );
}

/**
 * Returns a greeting based on the current hour.
 */
export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
