import { useState, useEffect } from "react";
import { authApi } from "../../services/api";

export default function UserManagement() {
    const [role, setRole] = useState("OFFICER");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", phone: "", department: "", fullAccess: false });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const CATEGORIES = [
        { id: "ROAD_DAMAGE", label: "Road Damage" },
        { id: "GARBAGE", label: "Garbage" },
        { id: "WATER_LEAKAGE", label: "Water Leakage" },
        { id: "STREETLIGHT", label: "Streetlight" },
        { id: "DRAINAGE", label: "Drainage" },
        { id: "PUBLIC_SAFETY", label: "Public Safety" }
    ];

    useEffect(() => { fetchUsers(); }, [role]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await authApi.listUsers(role);
            setUsers(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        try {
            await authApi.createUser({ ...form, role });
            setShowModal(false);
            setForm({ firstName: "", lastName: "", email: "", password: "", phone: "", department: "", fullAccess: false });
            fetchUsers();
        } catch (err) { setError(err.message); }
        finally { setSubmitting(false); }
    };

    return (
        <div className="fade-up">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div style={{ display: "flex", gap: 12 }}>
                    {["OFFICER", "ADMIN"].map(r => (
                        <button
                            key={r}
                            className={role === r ? "btn-primary" : "btn-outline"}
                            onClick={() => setRole(r)}
                            style={{ padding: "8px 20px", fontSize: 13 }}
                        >
                            {r}s
                        </button>
                    ))}
                </div>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    + Add New {role === "OFFICER" ? "Officer" : "Admin"}
                </button>
            </div>

            <div className="card" style={{ overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                        <tr>
                            <th style={{ padding: "14px 24px", fontSize: 13, color: "#64748b" }}>Name</th>
                            <th style={{ padding: "14px 24px", fontSize: 13, color: "#64748b" }}>Email</th>
                            <th style={{ padding: "14px 24px", fontSize: 13, color: "#64748b" }}>Phone</th>
                            {role === "OFFICER" && <th style={{ padding: "14px 24px", fontSize: 13, color: "#64748b" }}>Department</th>}
                            <th style={{ padding: "14px 24px", fontSize: 13, color: "#64748b" }}>Access</th>
                            <th style={{ padding: "14px 24px", fontSize: 13, color: "#64748b" }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={role === "OFFICER" ? 6 : 5} style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Loading users...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan={role === "OFFICER" ? 6 : 5} style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>No {role.toLowerCase()}s found.</td></tr>
                        ) : users.map(u => (
                            <tr key={u.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                <td style={{ padding: "14px 24px", fontWeight: 700, fontSize: 14 }}>{u.fullName}</td>
                                <td style={{ padding: "14px 24px", fontSize: 14, color: "#475569" }}>{u.email}</td>
                                <td style={{ padding: "14px 24px", fontSize: 14, color: "#475569" }}>{u.phone || "—"}</td>
                                {role === "OFFICER" && <td style={{ padding: "14px 24px", fontSize: 14, color: "#475569" }}>{u.department ? u.department.replace(/_/g, " ") : "General"}</td>}
                                <td style={{ padding: "14px 24px" }}>
                                    <span style={{ fontSize: 12, color: u.fullAccess ? "#1e40af" : "#64748b", fontWeight: 600 }}>
                                        {u.role === "ADMIN" || u.fullAccess ? "Full Access" : "Restricted"}
                                    </span>
                                </td>
                                <td style={{ padding: "14px 24px" }}>
                                    <span style={{ background: "#dcfce7", color: "#166534", padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700 }}>Active</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }}>
                    <div className="card scale-in" style={{ width: 450, padding: 32, position: "relative" }}>
                        <h3 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 800 }}>Add New {role.toLowerCase()}</h3>

                        {error && <div style={{ background: "#fef2f2", color: "#991b1b", padding: 12, borderRadius: 8, fontSize: 13, marginBottom: 16 }}>⚠️ {error}</div>}

                        <form onSubmit={handleCreate}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                                <Field label="First Name" value={form.firstName} onChange={v => setForm({ ...form, firstName: v })} required />
                                <Field label="Last Name" value={form.lastName} onChange={v => setForm({ ...form, lastName: v })} required />
                            </div>
                            <Field label="Email Address" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} required />
                            <div style={{ marginBottom: 14 }} />
                            <Field label="Password" type="password" value={form.password} onChange={v => setForm({ ...form, password: v })} required />
                            
                            <div style={{ marginBottom: 14 }} />
                            <div style={{ marginBottom: 14 }}>
                                <Field label="Phone" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
                            </div>

                            {role === "OFFICER" && (
                                <div style={{ marginBottom: 20 }}>
                                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 5 }}>Department</label>
                                    <select 
                                        className="input-base" 
                                        value={form.department} 
                                        onChange={e => setForm({ ...form, department: e.target.value })}
                                        style={{ width: "100%", padding: "10px" }}
                                    >
                                        <option value="">Select Department</option>
                                        {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                    </select>
                                </div>
                            )}

                            {role === "OFFICER" && (
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, background: "#f8fafc", padding: "12px", borderRadius: 10 }}>
                                    <input 
                                        type="checkbox" 
                                        id="fullAccess" 
                                        checked={form.fullAccess} 
                                        onChange={e => setForm({ ...form, fullAccess: e.target.checked })}
                                        style={{ width: 18, height: 18 }}
                                    />
                                    <label htmlFor="fullAccess" style={{ fontSize: 13, fontWeight: 700, color: "#1e40af", cursor: "pointer" }}>
                                        Grant Full Access (See all departments)
                                    </label>
                                </div>
                            )}

                            <div style={{ display: "flex", gap: 12 }}>
                                <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={submitting}>
                                    {submitting ? "Creating..." : "Create Account"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function Field({ label, value, onChange, type = "text", required = false }) {
    return (
        <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 5 }}>{label}</label>
            <input
                type={type}
                className="input-base"
                value={value}
                onChange={e => onChange(e.target.value)}
                required={required}
                placeholder={label}
            />
        </div>
    );
}
