import { useEffect, useState } from "react";
import PublicNavbar from "../components/layout/PublicNavbar";
import { complaintApi, otherApi } from "../services/api";

const HOW_IT_WORKS = [
  { icon: "📋", title: "Submit", desc: "Submit your complaint with details and location." },
  { icon: "🔍", title: "Track", desc: "Track the status of your complaint in real-time." },
  { icon: "🔧", title: "Resolve", desc: "See the issue getting resolved by authorities." },
];

const FOOTER_COLS = [
  { title: "Contact us", items: ["✉ support@resolveit.gov.in", "📞 1800-456-7890"] },
  { title: "Help & Support", items: ["FAQ", "Privacy Policy"] },
  { title: "Governance", items: ["Municipal Terms", "Data Privacy"] },
  { title: "Follow Platform", items: ["Facebook", "Twitter", "LinkedIn"] },
];

export default function LandingPage({ onNavigate, user }) {
  const [stats, setStats] = useState({ totalComplaints: 0, resolved: 0, inProgress: 0 });

  useEffect(() => {
    complaintApi.platformStats()
      .then(setStats)
      .catch(() => { }); // silently fall back to zeros
  }, []);

  const STAT_CARDS = [
    { n: stats.totalComplaints.toLocaleString(), l: "Total Complaints", icon: "📋" },
    { n: stats.resolved.toLocaleString(), l: "Resolved", icon: "✅" },
    { n: stats.inProgress.toLocaleString(), l: "In Progress", icon: "⏳" },
  ];

  return (
    <div style={{ fontFamily: "var(--font-body)", background: "#f0f4f8", minHeight: "100vh" }}>
      <PublicNavbar onNavigate={onNavigate} activePage="home" user={user} />

      {/* Hero */}
      <section style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "72px 60px 56px", maxWidth: 1200, margin: "0 auto", gap: 48 }} className="fade-up">
        <div style={{ flex: 1 }}>
          <div style={{ display: "inline-block", background: "#dbeafe", color: "#1e40af", borderRadius: 9999, padding: "5px 16px", fontSize: 12, fontWeight: 700, marginBottom: 18 }}>
            🏛️ Smart Civic Platform
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 46, fontWeight: 800, color: "#0f172a", lineHeight: 1.15, marginBottom: 20 }}>
            Report Civic Issues Easily<br />
            <span style={{ color: "#3b82f6" }}>&amp; Track in Real-Time</span>
          </h1>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, maxWidth: 480, marginBottom: 36 }}>
            A smart platform to report, track, and resolve local issues efficiently.
            Connecting citizens directly with government authorities.
          </p>
          <div style={{ display: "flex", gap: 14 }}>
            <button className="btn-primary" style={{ fontSize: 15, padding: "13px 28px" }} onClick={() => onNavigate("login")}>
              📋 Report Complaint
            </button>
            <button className="btn-outline" style={{ fontSize: 15, padding: "12px 24px" }}>Learn More</button>
          </div>
        </div>
        <div id="about" className="floating" style={{ flex: "0 0 380px", textAlign: "center" }}>
          <div style={{ width: 320, height: 320, margin: "0 auto", background: "linear-gradient(135deg,#dbeafe,#eff6ff)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <span style={{ fontSize: 110 }}>📱</span>
            {[{ em: "📍", top: "-8px", left: "-8px" }, { em: "🔔", bottom: "12px", left: "-8px" }, { em: "✅", bottom: "12px", right: "-8px" }, { em: "🔧", top: "-8px", right: "-8px" }].map(({ em, ...pos }, i) => (
              <div key={i} style={{ position: "absolute", width: 46, height: 46, background: "#fff", borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 4px 16px rgba(0,0,0,0.1)", animation: `float ${3 + i * 0.5}s ease-in-out infinite`, ...pos }}>{em}</div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works / Services */}
      <section id="services" style={{ background: "#fff", padding: "64px 60px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>How It Works</h2>
        <p style={{ color: "#64748b", marginBottom: 48 }}>Submit your complaint with details and location real-time.</p>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", maxWidth: 900, margin: "0 auto" }}>
          {HOW_IT_WORKS.map(({ icon, title, desc }) => (
            <div key={title} className="card card-hover" style={{ flex: 1, padding: "38px 26px", textAlign: "center" }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>{icon}</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, marginBottom: 10, color: "#0f172a" }}>{title}</h3>
              <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: "64px 60px", textAlign: "center", maxWidth: 1000, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, color: "#0f172a", marginBottom: 44 }}>Platform Stats</h2>
        <div style={{ display: "flex", gap: 24 }}>
          {STAT_CARDS.map(({ n, l, icon }) => (
            <div key={l} className="card card-hover" style={{ flex: 1, padding: 28, display: "flex", alignItems: "center", gap: 18 }}>
              <span style={{ fontSize: 36 }}>{icon}</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 800, color: "#1e40af" }}>{n}</div>
                <div style={{ color: "#64748b", fontWeight: 600, fontSize: 14 }}>{l}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Us */}
      <section id="contact" style={{ padding: "80px 60px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 60, alignItems: "center" }}>
          <div className="fade-up">
            <div style={{ display: "inline-block", background: "#f0fdf4", color: "#166534", borderRadius: 9999, padding: "5px 16px", fontSize: 12, fontWeight: 700, marginBottom: 18 }}>
              💬 Communication
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>Get in Touch</h2>
            <p style={{ color: "#64748b", lineHeight: 1.8, marginBottom: 32 }}>
              Have questions or suggestions? We'd love to hear from you.
              Our team usually responds within 24 hours.
            </p>
            <div style={{ display: "grid", gap: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 44, height: 44, background: "#f0fdf4", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>✉️</div>
                <div>
                  <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 14 }}>Email Us</div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>support@resolveit.gov.in</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 44, height: 44, background: "#eff6ff", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📞</div>
                <div>
                  <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 14 }}>Helpline</div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>1800-456-7890 (Toll Free)</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card fade-up" style={{ padding: 40, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.08)" }}>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#0f172a", color: "#94a3b8", padding: "52px 60px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 36 }}>
        {FOOTER_COLS.map(({ title, items }) => (
          <div key={title}>
            <div style={{ color: "#fff", fontWeight: 700, marginBottom: 14, fontSize: 15 }}>{title}</div>
            {items.map(item => <div key={item} style={{ fontSize: 13, marginBottom: 9, cursor: "pointer" }}>{item}</div>)}
          </div>
        ))}
      </footer>
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", text: "" });

    try {
      await otherApi.contactUs(form);
      setStatus({ type: "success", text: "Message sent! We'll get back to you soon." });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {status.text && (
        <div style={{
          background: status.type === "success" ? "#f0fdf4" : "#fef2f2",
          color: status.type === "success" ? "#166534" : "#991b1b",
          padding: 12, borderRadius: 8, fontSize: 13, fontWeight: 600, marginBottom: 20
        }}>
          {status.type === "success" ? "✅" : "⚠️"} {status.text}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 6 }}>Name</label>
          <input
            type="text" className="input-field" placeholder="Deepak" required
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 6 }}>Email</label>
          <input
            type="email" className="input-field" placeholder="deepak@example.com" required
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
          />
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 6 }}>Subject</label>
        <input
          type="text" className="input-field" placeholder="How can we help?" required
          value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 6 }}>Message</label>
        <textarea
          className="input-field" rows="4" placeholder="Your message..." required
          style={{ resize: "none" }}
          value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
        />
      </div>

      <button type="submit" className="btn-primary" style={{ width: "100%", padding: 12 }} disabled={loading}>
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
