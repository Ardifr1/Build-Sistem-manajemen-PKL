import { useEffect, useState } from "react";
import { usersApi, ROLE_LABEL } from "../../api/index.js";
import { UserCell, RoleBadge, StatusBadge } from "../../components/admin/user-table.jsx";
import "./admin-pages.css";

const ROLE_OPTIONS = ["admin", "teacher", "student", "company"];

function roleLabel(role) {
  return ROLE_LABEL?.[role] || role;
}

function UserForm({ initial, onCancel, onSaved }) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState({
    name: initial?.name || "",
    username: initial?.username || "",
    email: initial?.email || "",
    password: "",
    password_confirmation: "",
    role: initial?.role || "student",
    is_active: initial ? !!initial.is_active : true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.username.trim() || !form.email.trim()) {
      setError("Nama, username, dan email wajib diisi.");
      return;
    }
    if (!isEdit || form.password) {
      if (form.password.length < 8) {
        setError("Password minimal 8 karakter.");
        return;
      }
      if (form.password !== form.password_confirmation) {
        setError("Konfirmasi password tidak cocok.");
        return;
      }
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        role: form.role,
        is_active: form.is_active,
      };
      if (form.password) {
        payload.password = form.password;
        payload.password_confirmation = form.password_confirmation;
      }
      if (isEdit) await usersApi.update(initial.id, payload);
      else await usersApi.store(payload);
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
        <span>Email</span>
        <input
          type="email"
          value={form.email}
          onChange={set("email")}
          placeholder="cth dewi@smk.sch.id"
        />
      </label>
      <label className="zip-field">
        <span>Password{isEdit ? " (kosongkan jika tidak diubah)" : ""}</span>
        <input
          type="password"
          value={form.password}
          onChange={set("password")}
          placeholder="Minimal 8 karakter"
          autoComplete="new-password"
        />
      </label>
      <label className="zip-field">
        <span>Konfirmasi Password</span>
        <input
          type="password"
          value={form.password_confirmation}
          onChange={set("password_confirmation")}
          placeholder="Ulangi password"
          autoComplete="new-password"
        />
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
      .then((res) => {
        const all = Array.isArray(res.data) ? res.data : [];
        // akun pembimbing industri dikelola perusahaan, jangan tampil di sini
        setRows(all.filter((u) => u.role !== "supervisor"));
      })
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
            onMeta?.({ title: "Tambah Pengguna", subtitle: "Nama • username • email • password • role • status" });
          }}
        >
          + Tambah Pengguna
        </button>
      </div>
      {error && <div className="zip-error">{error}</div>}
      {loading ? (
        <p className="zip-muted">Memuat pengguna…</p>
      ) : (
        <>
        <div className="zip-table-wrap">
          <table className="zip-table">
            <thead>
              <tr>
                <th>Pengguna</th>
                <th>Peran</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id}>
                  <td><UserCell name={u.name} email={u.email} /></td>
                  <td><RoleBadge role={u.role} /></td>
                  <td><StatusBadge active={u.is_active} /></td>
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <button type="button" className="zip-act zip-act-detail" style={{ marginRight: 6 }} onClick={() => { setView({ name: "edit", row: u }); onMeta?.({ title: "Detail / Edit Pengguna", subtitle: "Nama • username • email • password • role • status" }); }}>Detail</button>
                    <button type="button" className="zip-act zip-act-edit" style={{ marginRight: 6 }} onClick={() => { setView({ name: "edit", row: u }); onMeta?.({ title: "Detail / Edit Pengguna", subtitle: "Nama • username • email • password • role • status" }); }}>Edit</button>
                    <button type="button" className="zip-act zip-act-hapus" onClick={() => { setView({ name: "hapus", row: u }); onMeta?.({ title: "Konfirmasi Hapus", subtitle: "Aksi berisiko • butuh konfirmasi" }); }}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && <p className="zip-muted">Belum ada pengguna.</p>}
        </>
      )}
    </div>
  );
}

export default Pengguna;
