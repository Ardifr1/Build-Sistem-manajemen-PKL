import { useEffect, useState } from "react";
import { companiesApi } from "../../api/index.js";
import { getMyCompanyId } from "../../lib/role-data.js";

/* Profil perusahaan — kelola data perusahaan sendiri. */
function ProfilPerusahaan({ onMeta }) {
  const [form, setForm] = useState({ name: "", industry: "", address: "", phone: "", email: "", description: "", student_quota: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [companyId, setCompanyId] = useState(null);

  useEffect(() => {
    onMeta?.({ title: "Profil Perusahaan", subtitle: "Kelola data perusahaan Anda" });
    (async () => {
      try {
        const id = await getMyCompanyId();
        setCompanyId(id);
        if (id) {
          const c = await companiesApi.show(id);
          const d = c?.data || c;
          setForm({
            name: d.name || "",
            industry: d.industry || "",
            address: d.address || "",
            phone: d.phone || "",
            email: d.email || "",
            description: d.description || "",
            student_quota: d.student_quota ?? "",
          });
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [onMeta]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!companyId) return;
    setSaving(true);
    try {
      await companiesApi.update(companyId, { ...form, student_quota: Number(form.student_quota) || 0 });
      alert("Profil tersimpan.");
    } catch (err) {
      alert(err?.message || "Gagal menyimpan profil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="zip-muted">Memuat…</div>;

  return (
    <div className="zip-page">
      <form className="zip-card" style={{ maxWidth: "none" }} onSubmit={submit}>
        <div className="zip-form-grid">
          <label className="zip-field"><span>Nama Perusahaan</span><input value={form.name} onChange={set("name")} /></label>
          <label className="zip-field"><span>Bidang Industri</span><input value={form.industry} onChange={set("industry")} /></label>
          <label className="zip-field"><span>Email</span><input type="email" value={form.email} onChange={set("email")} /></label>
          <label className="zip-field"><span>No. Telepon</span><input value={form.phone} onChange={set("phone")} /></label>
          <label className="zip-field"><span>Kuota Siswa</span><input type="number" min="0" value={form.student_quota} onChange={set("student_quota")} /></label>
          <label className="zip-field"><span>Alamat</span><input value={form.address} onChange={set("address")} /></label>
        </div>
        <label className="zip-field"><span>Deskripsi</span>
          <textarea rows="3" value={form.description} onChange={set("description")} placeholder="Tentang perusahaan…" />
        </label>
        <div className="zip-form-actions">
          <button type="submit" className="zip-btn-primary" disabled={saving}>{saving ? "Menyimpan…" : "Simpan Profil"}</button>
        </div>
      </form>
    </div>
  );
}

export default ProfilPerusahaan;
