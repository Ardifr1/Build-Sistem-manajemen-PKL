import { useEffect, useState } from "react";
import { authApi, usersApi } from "../../api/index.js";
import "./admin-pages.css";

function initials(name) {
  const p = String(name || "?").trim().split(/\s+/);
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
  return (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

function ProfilAdmin({ onMeta }) {
  const [user, setUser] = useState(() => authApi.currentUser());
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ t: "", ok: true });

  useEffect(() => {
    onMeta?.({ title: "Profil Saya", subtitle: "Data diri administrator" });
  }, [onMeta]);

  const mulaiEdit = () => {
    setForm({ name: user?.name || "", email: user?.email || "" });
    setMsg({ t: "", ok: true });
    setEditing(true);
  };

  const simpan = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setMsg({ t: "Nama dan email wajib diisi.", ok: false });
      return;
    }
    setSaving(true);
    setMsg({ t: "", ok: true });
    try {
      const res = await usersApi.update(user.id, {
        name: form.name.trim(),
        email: form.email.trim(),
      });
      const updated = res?.data || res || {};
      const next = { ...user, name: updated.name ?? form.name.trim(), email: updated.email ?? form.email.trim() };
      try { localStorage.setItem("simagang_user", JSON.stringify(next)); } catch { /* abaikan */ }
      setUser(next);
      setEditing(false);
      setMsg({ t: "Profil berhasil diperbarui.", ok: true });
    } catch (err) {
      setMsg({ t: err?.message || "Gagal menyimpan. Anda mungkin tidak punya izin.", ok: false });
    } finally {
      setSaving(false);
    }
  };

  const rows = [
    ["Nama Lengkap", user?.name || "—"],
    ["Username", user?.username || "—"],
    ["Email", user?.email || "—"],
    ["Peran", "Administrator"],
    ["Sekolah", user?.school_name || user?.school?.name || "—"],
  ];

  return (
    <div className="zip-page">
      <div className="zip-card" style={{ marginBottom: 18 }}>
        <div className="zip-profil-head">
          <span className="zip-profil-av">{initials(user?.name)}</span>
          <div style={{ flex: 1 }}>
            <h3 className="zip-card-title" style={{ fontSize: 19, margin: 0 }}>{user?.name || "Administrator"}</h3>
            <p className="zip-sub" style={{ margin: "4px 0 8px" }}>{user?.email || "—"}</p>
            <span className="zip-status s-aktif"><span className="dot"></span>Aktif</span>
          </div>
          {!editing && (
            <button type="button" className="zip-btn-outline" onClick={mulaiEdit}>
              <i className="fa-solid fa-pen"></i> Edit Profil
            </button>
          )}
        </div>
      </div>

      {msg.t && <div className={msg.ok ? "zip-success" : "zip-error"} style={{ maxWidth: 720 }}>{msg.t}</div>}

      {editing ? (
        <div className="zip-card" style={{ marginBottom: 18 }}>
          <h3 className="zip-card-title" style={{ marginTop: 0 }}>Edit Profil</h3>
          <form onSubmit={simpan}>
            <label className="zip-field"><span>Nama Lengkap</span>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Nama lengkap" />
            </label>
            <label className="zip-field"><span>Email</span>
              <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="email@sekolah.sch.id" />
            </label>
            <div className="zip-form-actions">
              <button type="button" className="zip-btn-outline" onClick={() => setEditing(false)} disabled={saving}>Batal</button>
              <button type="submit" className="zip-btn-primary" disabled={saving}>{saving ? "Menyimpan…" : "Simpan"}</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="zip-card">
          <h3 className="zip-card-title" style={{ marginTop: 0 }}>Data Diri</h3>
          <dl className="zip-dl">
            {rows.map(([k, v]) => (
              <div key={k} style={{ display: "contents" }}>
                <dt>{k}</dt><dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}

export default ProfilAdmin;
