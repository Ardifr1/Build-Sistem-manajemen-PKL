import { useEffect, useState } from "react";
import { usersApi, ROLE_LABEL } from "../../api/index.js";
import "./admin-pages.css";

const ROLE_OPTIONS = ["admin", "teacher", "student", "company"];

function roleLabel(role) {
  return ROLE_LABEL?.[role] || role;
}

function UserForm({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    username: initial?.username || "",
    role: initial?.role || "student",
    is_active: initial ? !!initial.is_active : true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.username.trim()) {
      setError("Nama dan username wajib diisi.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        username: form.username.trim(),
        role: form.role,
        is_active: form.is_active,
      };
      if (initial?.id) await usersApi.update(initial.id, payload);
      else await usersApi.store({ ...payload, email: `${payload.username}@smk.sch.id`, password: "password123" });
      onSaved?.();
    } catch (err) {
      setError(err?.message || "Gagal menyimpan pengguna.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="zip-card zip-form" onSubmit={submit}>
      {error && <div className="zip-error">{error}</div>}
      <label className="zip-field">
        <span>Nama</span>
        <input value={form.name} onChange={set("name")} placeholder="cth Dewi Lestari" />
      </label>
      <label className="zip-field">
        <span>Username</span>
        <input value={form.username} onChange={set("username")} placeholder="dewi.xiirpl3" />
      </label>
      <label className="zip-field">
        <span>Role</span>
        <select value={form.role} onChange={set("role")}>
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>{roleLabel(r)}</option>
          ))}
        </select>
      </label>
      <label className="zip-field">
        <span>Status</span>
        <select
          value={form.is_active ? "1" : "0"}
          onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.value === "1" }))}
        >
          <option value="1">Aktif</option>
          <option value="0">Nonaktif</option>
        </select>
      </label>
      <div className="zip-form-actions">
        <button type="button" className="zip-btn zip-btn-outline" onClick={onCancel}>Batal</button>
        <button type="submit" className="zip-btn zip-btn-primary" disabled={saving}>
          {saving ? "Menyimpan…" : "Simpan"}
        </button>
      </div>
    </form>
  );
}

function Pengguna({ onMeta }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState({ name: "list" }); // list | tambah | edit | hapus
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    usersApi
      .index()
      .then((res) => setRows(Array.isArray(res.data) ? res.data : []))
      .catch((err) => setError(err?.message || "Gagal memuat pengguna."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    onMeta?.({ title: "Pengguna", subtitle: "Kelola akun • Tambah/Edit/Detail/Hapus" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const backToList = () => {
    setView({ name: "list" });
    onMeta?.({ title: "Pengguna", subtitle: "Kelola akun • Tambah/Edit/Detail/Hapus" });
    load();
  };

  const doDelete = async () => {
    try {
      await usersApi.destroy(view.row.id);
      backToList();
    } catch (err) {
      setError(err?.message || "Gagal menghapus pengguna.");
    }
  };

  if (view.name === "tambah") {
    return (
      <div className="zip-page">
        <UserForm onCancel={backToList} onSaved={backToList} />
      </div>
    );
  }

  if (view.name === "edit") {
    return (
      <div className="zip-page">
        <UserForm initial={view.row} onCancel={backToList} onSaved={backToList} />
      </div>
    );
  }

  if (view.name === "hapus") {
    return (
      <div className="zip-page">
        <div className="zip-card zip-confirm">
          <h3>Hapus pengguna {view.row.name}?</h3>
          <p>Akun dinonaktifkan dan tidak bisa login. Lanjutkan?</p>
          <div className="zip-confirm-actions">
            <button type="button" className="zip-btn zip-btn-outline" onClick={backToList}>Batal</button>
            <button type="button" className="zip-btn zip-btn-danger" onClick={doDelete}>Ya, Hapus</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="zip-page">
      <div className="zip-toolbar">
        <span className="zip-muted">{rows.length} akun • filter role &amp; status</span>
        <button
          type="button"
          className="zip-btn zip-btn-primary"
          onClick={() => {
            setView({ name: "tambah" });
            onMeta?.({ title: "Tambah Pengguna", subtitle: "Nama • username • role • status" });
          }}
        >
          + Tambah Pengguna
        </button>
      </div>
      {error && <div className="zip-error">{error}</div>}
      {loading ? (
        <p className="zip-muted">Memuat pengguna…</p>
      ) : (
        <div className="zip-list">
          {rows.map((u) => (
            <div className="zip-row" key={u.id}>
              <span className="zip-row-text">
                {u.name} • {roleLabel(u.role)} • {u.is_active ? "Aktif" : "Nonaktif"}
              </span>
              <span className="zip-row-actions">
                <button type="button" onClick={() => { setView({ name: "edit", row: u }); onMeta?.({ title: "Detail / Edit Pengguna", subtitle: "Nama • username • role • status" }); }}>Detail</button>
                <i>•</i>
                <button type="button" onClick={() => { setView({ name: "edit", row: u }); onMeta?.({ title: "Detail / Edit Pengguna", subtitle: "Nama • username • role • status" }); }}>Edit</button>
                <i>•</i>
                <button type="button" onClick={() => { setView({ name: "hapus", row: u }); onMeta?.({ title: "Konfirmasi Hapus", subtitle: "Aksi berisiko • butuh konfirmasi" }); }}>Hapus</button>
              </span>
            </div>
          ))}
          {rows.length === 0 && <p className="zip-muted">Belum ada pengguna.</p>}
        </div>
      )}
    </div>
  );
}

export default Pengguna;
