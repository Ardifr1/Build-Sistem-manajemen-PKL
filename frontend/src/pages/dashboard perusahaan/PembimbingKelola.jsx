import { useEffect, useState } from "react";
import { supervisorsApi } from "../../api/index.js";

function PembimbingForm({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    email: initial?.email || "",
    password: "",
    position: initial?.position || "",
    phone: initial?.phone || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim()) {
      setError("Nama dan email wajib diisi.");
      return;
    }
    if (!initial && form.password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        position: form.position.trim(),
        phone: form.phone.trim(),
      };
      if (!initial) payload.password = form.password;
      if (initial?.id) await supervisorsApi.update(initial.id, payload);
      else await supervisorsApi.store(payload);
      onSaved?.();
    } catch (err) {
      setError(err?.message || "Gagal menyimpan pembimbing.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="zip-card" style={{ maxWidth: "none", marginBottom: 18 }} onSubmit={submit}>
      <h3 className="zip-card-title" style={{ marginTop: 0 }}>{initial ? "Edit Pembimbing" : "Akun Pembimbing Baru"}</h3>
      {error && <div className="zip-error">{error}</div>}
      <div className="zip-form-grid">
        <label className="zip-field"><span>Nama lengkap</span><input value={form.name} onChange={set("name")} placeholder="Nama lengkap" /></label>
        <label className="zip-field"><span>Email</span><input type="email" value={form.email} onChange={set("email")} placeholder="Email" /></label>
        {!initial && (
          <label className="zip-field"><span>Password (min. 8 karakter)</span><input type="password" value={form.password} onChange={set("password")} placeholder="Password" /></label>
        )}
        <label className="zip-field"><span>Posisi / Jabatan</span><input value={form.position} onChange={set("position")} placeholder="cth: Frontend Dev" /></label>
        <label className="zip-field"><span>No. HP</span><input value={form.phone} onChange={set("phone")} placeholder="No. HP" /></label>
      </div>
      <div className="zip-form-actions">
        <button type="button" className="zip-btn-outline" onClick={onCancel}>Batal</button>
        <button type="submit" className="zip-btn-primary" disabled={saving}>{saving ? "Menyimpan…" : initial ? "Simpan" : "Buat Akun"}</button>
      </div>
    </form>
  );
}

function PembimbingKelola({ onMeta }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    try {
      const r = await supervisorsApi.index();
      setRows(Array.isArray(r) ? r : r?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onMeta?.({ title: "Pembimbing Industri", subtitle: "Buat akun pembimbing • tugaskan siswa" });
    load();
  }, [onMeta]);

  const toggle = async (s) => {
    try {
      await supervisorsApi.update(s.id, { is_active: !s.is_active });
      load();
    } catch (e) {
      alert(e?.message || "Gagal mengubah status.");
    }
  };

  return (
    <div className="zip-page">
      <div className="zip-note">
        ℹ️ Perusahaan membuat akun pembimbing sendiri — <strong>tanpa lewat admin sekolah</strong>. Tiap pembimbing hanya melihat & menilai <strong>siswa yang ditugaskan</strong> kepadanya.
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div className="zip-muted">{rows.length} pembimbing</div>
        <button type="button" className="zip-btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>+ Tambah Pembimbing</button>
      </div>

      {showForm && (
        <PembimbingForm
          initial={editing}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          onSaved={() => { setShowForm(false); setEditing(null); load(); }}
        />
      )}

      {loading && <div className="zip-muted">Memuat…</div>}
      <div className="zip-grid2">
        {rows.map((s) => (
          <div className="zip-pcard" key={s.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{s.position || "-"} • {s.email}</div>
              </div>
              <div className="zip-av2">{(s.name || "?")[0]}</div>
            </div>
            <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 10, marginBottom: 6 }}>
              {(s.students || []).map((st) => (
                <div className="zip-srow" key={st.id} style={{ border: 0, padding: "7px 0" }}>
                  <span>{st.name} <span className="zip-badge b-green">Aktif</span></span>
                </div>
              ))}
              {(s.students || []).length === 0 && <div className="zip-muted" style={{ fontSize: 12 }}>Belum ada siswa ditugaskan.</div>}
            </div>
            <div className="zip-actions">
              <button type="button" className="zip-btn-outline" onClick={() => { setEditing(s); setShowForm(true); }}>Edit</button>
              <button type="button" className={s.is_active === false ? "zip-btn-success" : "zip-btn-danger"} onClick={() => toggle(s)}>
                {s.is_active === false ? "Aktifkan" : "Nonaktifkan"}
              </button>
            </div>
          </div>
        ))}
      </div>
      {!loading && rows.length === 0 && <div className="zip-muted">Belum ada pembimbing.</div>}
    </div>
  );
}

export default PembimbingKelola;
