import { useEffect, useState } from "react";
import { usersApi, journalsApi, applicationsApi, placementsApi, profilesApi, ROLE_LABEL } from "../../api/index.js";
import { UserCell, RoleBadge, StatusBadge, initials, avatarColor } from "../../components/admin/user-table.jsx";
import "./admin-pages.css";

/**
 * Konfirmasi hapus pengguna ala referensi: banner permanen + data terkait + checkbox.
 */
function HapusPengguna({ row, onCancel, onDeleted, onMeta }) {
  const [counts, setCounts] = useState({ jurnal: 0, pengajuan: 0, dokumen: 0, penempatan: 0 });
  const [profil, setProfil] = useState({});
  const [checked, setChecked] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    onMeta?.({ title: "Hapus Pengguna", subtitle: "Konfirmasi penghapusan akun secara permanen" });
    (async () => {
      try {
        const [jRes, aRes, pRes, profRes] = await Promise.all([
          journalsApi.index().catch(() => ({ data: [] })),
          applicationsApi.index().catch(() => ({ data: [] })),
          placementsApi.index().catch(() => ({ data: [] })),
          profilesApi.index().catch(() => ({ data: [] })),
        ]);
        const journals = Array.isArray(jRes.data) ? jRes.data : [];
        const apps = Array.isArray(aRes.data) ? aRes.data : [];
        const placements = Array.isArray(pRes.data) ? pRes.data : [];
        const profiles = Array.isArray(profRes.data) ? profRes.data : [];
        const prof = profiles.find((p) => p.user_id === row.id) || {};
        setProfil(prof);
        const myPlacements = placements.filter((p) => p.student_id === row.id);
        const myPlacementIds = new Set(myPlacements.map((p) => p.id));
        const dokumen = [prof.cv_path, prof.portfolio_path, prof.certificate_path].filter(Boolean).length;
        setCounts({
          jurnal: journals.filter((j) => myPlacementIds.has(j.placement_id)).length,
          pengajuan: apps.filter((a) => a.student_id === row.id).length,
          dokumen,
          penempatan: myPlacements.length,
        });
      } catch (e) { /* counts tetap 0 */ }
    })();
  }, [row.id, onMeta]);

  const doDelete = async () => {
    if (!checked) return;
    setDeleting(true);
    setError("");
    try {
      await usersApi.destroy(row.id);
      onDeleted();
    } catch (err) {
      setError(err?.message || "Gagal menghapus pengguna.");
      setDeleting(false);
    }
  };

  const sub = [ROLE_LABEL?.[row.role] || row.role, profil.kelas || profil.class, profil.nis ? `NIS ${profil.nis}` : null]
    .filter(Boolean).join(" • ");

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <div className="zip-card">
        <div className="zip-danger-banner">
          <span className="zip-danger-icon"><i className="fa-solid fa-triangle-exclamation"></i></span>
          <div><strong>Tindakan permanen.</strong> Akun dan seluruh data terkait akan dihapus dan tidak dapat dikembalikan.</div>
        </div>

        <div className="zip-user-card">
          <span className="zip-avatar" style={{ background: avatarColor(row.name), width: 44, height: 44 }}>{initials(row.name)}</span>
          <span>
            <div className="zip-user-name">{row.name}</div>
            <div className="zip-user-email">{sub}</div>
          </span>
        </div>

        <div style={{ fontWeight: 700, fontSize: 13.5, margin: "14px 0 8px" }}>Data terkait yang ikut terhapus:</div>
        <div className="zip-kv"><span>Jurnal PKL</span><strong>{counts.jurnal} entri</strong></div>
        <div className="zip-kv"><span>Pengajuan perusahaan</span><strong>{counts.pengajuan} pengajuan</strong></div>
        <div className="zip-kv"><span>Dokumen (CV, portofolio, sertifikat)</span><strong>{counts.dokumen} berkas</strong></div>
        <div className="zip-kv"><span>Penempatan resmi</span><strong>{counts.penempatan} penempatan</strong></div>

        <label className="zip-check" style={{ marginTop: 16 }}>
          <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
          <span style={{ fontSize: 12.5, color: "#64748b" }}>Saya memahami bahwa penghapusan ini bersifat permanen dan tidak dapat dibatalkan.</span>
        </label>

        {error && <div className="zip-error">{error}</div>}

        <div className="zip-form-actions" style={{ marginTop: 8 }}>
          <button type="button" className="zip-btn-outline" onClick={onCancel}>Batal</button>
          <button
            type="button"
            className="zip-btn-danger"
            disabled={!checked || deleting}
            onClick={doDelete}
            style={{ opacity: checked ? 1 : 0.5 }}
          >
            <i className="fa-solid fa-trash" style={{ marginRight: 6 }}></i>
            {deleting ? "Menghapus…" : "Hapus Permanen"}
          </button>
        </div>
      </div>
    </div>
  );
}

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
        <HapusPengguna row={view.row} onCancel={backToList} onDeleted={backToList} onMeta={onMeta} />
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
