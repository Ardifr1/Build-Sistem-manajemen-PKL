import { useEffect, useState } from "react";
import { placementsApi, assessmentsApi } from "../../api/index.js";

/* Evaluasi perusahaan — nilai siswa magang (skala 1-5 + catatan). */
function EvaluasiPerusahaan({ onMeta }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ placement_id: "", score: 4, note: "" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const r = await placementsApi.index();
      setRows((Array.isArray(r) ? r : r?.data || []).filter((p) => p.status === "active" || p.status === "completed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onMeta?.({ title: "Evaluasi", subtitle: "Nilai siswa magang" });
    load();
  }, [onMeta]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.placement_id) return;
    setSaving(true);
    try {
      await assessmentsApi.store({
        placement_id: form.placement_id,
        score: Number(form.score),
        note: form.note,
        assessor: "company",
      });
      setForm({ placement_id: "", score: 4, note: "" });
      load();
    } catch (err) {
      alert(err?.message || "Gagal menyimpan evaluasi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="zip-page">
      <div className="zip-card" style={{ maxWidth: "none", marginBottom: 18 }}>
        <h3 className="zip-card-title" style={{ marginTop: 0 }}>Beri Evaluasi</h3>
        <form onSubmit={submit}>
          <div className="zip-form-grid">
            <label className="zip-field"><span>Siswa</span>
              <select value={form.placement_id} onChange={(e) => setForm((f) => ({ ...f, placement_id: e.target.value }))}>
                <option value="">— Pilih siswa —</option>
                {rows.map((p) => <option key={p.id} value={p.id}>{p.student?.name || `#${p.id}`}</option>)}
              </select>
            </label>
            <label className="zip-field"><span>Nilai (1-5)</span>
              <select value={form.score} onChange={(e) => setForm((f) => ({ ...f, score: e.target.value }))}>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} {"★".repeat(n)}</option>)}
              </select>
            </label>
          </div>
          <label className="zip-field"><span>Catatan</span>
            <textarea rows="2" value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} placeholder="Catatan evaluasi…" />
          </label>
          <div className="zip-form-actions">
            <button type="submit" className="zip-btn-primary" disabled={saving}>{saving ? "Menyimpan…" : "Simpan Evaluasi"}</button>
          </div>
        </form>
      </div>

      {loading && <div className="zip-muted">Memuat…</div>}
      <div className="zip-list">
        {rows.map((p) => (
          <div className="zip-row" key={p.id}>
            <span className="zip-row-text">
              <strong>{p.student?.name || "-"}</strong>
              <span className="zip-sub"> • {p.company?.name || ""}</span>
            </span>
            <span className="zip-badge b-amber">{p.assessment ? `★ ${p.assessment.score}` : "Belum dinilai"}</span>
          </div>
        ))}
      </div>
      {!loading && rows.length === 0 && <div className="zip-muted">Belum ada siswa untuk dievaluasi.</div>}
    </div>
  );
}

export default EvaluasiPerusahaan;
