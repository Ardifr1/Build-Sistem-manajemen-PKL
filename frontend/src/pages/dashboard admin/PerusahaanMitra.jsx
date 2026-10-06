import { useEffect, useState } from "react";
import { companiesApi } from "../../api/index.js";
import "./admin-pages.css";

function CompanyForm({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    industry: initial?.industry || "",
    student_quota: initial?.student_quota ?? "",
    is_active: initial ? !!initial.is_active : true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) {
      setError("Nama perusahaan wajib diisi.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        industry: form.industry.trim(),
        student_quota: Number(form.student_quota) || 0,
        is_active: form.is_active,
      };
      if (initial?.id) await companiesApi.update(initial.id, payload);
      else await companiesApi.store(payload);
      onSaved?.();
    } catch (err) {
      setError(err?.message || "Gagal menyimpan perusahaan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="zip-card zip-form" onSubmit={submit}>
      {error && <div className="zip-error">{error}</div>}
      <label className="zip-field">
        <span>Nama Perusahaan</span>
        <input value={form.name} onChange={set("name")} placeholder="cth PT Solusi Digital" />
      </label>
      <label className="zip-field">
        <span>Bidang</span>
        <input value={form.industry} onChange={set("industry")} placeholder="cth Backend" />
      </label>
      <label className="zip-field">
        <span>Kuota Siswa</span>
        <input type="number" min="0" value={form.student_quota} onChange={set("student_quota")} placeholder="cth 6" />
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

function PerusahaanPartner({ onMeta }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState({ name: "list" });
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    companiesApi
      .index()
      .then((res) => setRows(Array.isArray(res.data) ? res.data : []))
      .catch((err) => setError(err?.message || "Gagal memuat perusahaan."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onMeta?.({ title: "Perusahaan Partner", subtitle: `${rows.length} mitra • kuota • pembimbing` });
  }, [rows.length, onMeta]);

  const backToList = () => {
    setView({ name: "list" });
    load();
  };

  const doDelete = async () => {
    try {
      await companiesApi.destroy(view.row.id);
      backToList();
    } catch (err) {
      setError(err?.message || "Gagal menghapus perusahaan.");
    }
  };

  if (view.name === "tambah" || view.name === "edit") {
    return (
      <div className="zip-page">
        <CompanyForm
          initial={view.name === "edit" ? view.row : null}
          onCancel={backToList}
          onSaved={backToList}
        />
      </div>
    );
  }

  if (view.name === "hapus") {
    return (
      <div className="zip-page">
        <div className="zip-card zip-confirm">
          <h3>Hapus perusahaan {view.row.name}?</h3>
          <p>Data perusahaan dihapus dan tidak bisa dikembalikan. Lanjutkan?</p>
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
        <span className="zip-muted">{rows.length} mitra • kuota • pembimbing</span>
        <button
          type="button"
          className="zip-btn zip-btn-primary"
          onClick={() => {
            setView({ name: "tambah" });
            onMeta?.({ title: "Tambah Perusahaan", subtitle: "Nama • bidang • kuota • status" });
          }}
        >
          + Tambah Perusahaan
        </button>
      </div>
      {error && <div className="zip-error">{error}</div>}
      {loading ? (
        <p className="zip-muted">Memuat perusahaan…</p>
      ) : (
        <div className="zip-list">
          {rows.map((c) => (
            <div className="zip-row" key={c.id}>
              <span className="zip-row-text">
                {c.name} • {c.industry || "-"} • {c._terisi ?? 0}/{c.student_quota ?? 0} • {c.is_active ? "Aktif" : "Nonaktif"}
              </span>
              <span className="zip-row-actions">
                <button type="button" onClick={() => { setView({ name: "edit", row: c }); onMeta?.({ title: "Detail / Edit Perusahaan", subtitle: "Nama • bidang • kuota • status" }); }}>Detail</button>
                <i>•</i>
                <button type="button" onClick={() => { setView({ name: "edit", row: c }); onMeta?.({ title: "Detail / Edit Perusahaan", subtitle: "Nama • bidang • kuota • status" }); }}>Edit</button>
                <i>•</i>
                <button type="button" onClick={() => { setView({ name: "hapus", row: c }); onMeta?.({ title: "Konfirmasi Hapus", subtitle: "Aksi berisiko • butuh konfirmasi" }); }}>Hapus</button>
              </span>
            </div>
          ))}
          {rows.length === 0 && <p className="zip-muted">Belum ada perusahaan mitra.</p>}
        </div>
      )}
    </div>
  );
}

export default PerusahaanPartner;
