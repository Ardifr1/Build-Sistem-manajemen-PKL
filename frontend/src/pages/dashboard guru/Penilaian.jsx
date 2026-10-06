import { useEffect, useState } from "react";
import {
  assessmentsApi,
  componentsApi,
  finalsApi,
} from "../../api/index.js";
import "../../components/role/detail-siswa.css";
import { getEnrichedPlacements, statusLabel } from "../../lib/role-data.js";

function avg(nums) {
  if (!nums.length) return null;
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}

function Penilaian({ onMeta }) {
  const [placements, setPlacements] = useState([]);
  const [components, setComponents] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [finals, setFinals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formPlacement, setFormPlacement] = useState("");
  const [scores, setScores] = useState({});
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const reload = async () => {
    const [pRes, cRes, aRes, fRes] = await Promise.all([
      getEnrichedPlacements(),
      componentsApi.index().catch(() => ({ data: [] })),
      assessmentsApi.index().catch(() => ({ data: [] })),
      finalsApi.index().catch(() => ({ data: [] })),
    ]);
    setPlacements(pRes);
    setComponents((cRes?.data ?? []).filter((c) => c.is_active !== false));
    setAssessments(aRes?.data ?? []);
    setFinals(fRes?.data ?? []);
  };

  useEffect(() => {
    onMeta?.({ title: "Penilaian Detail", subtitle: "Rekap • nilai akhir setelah SELESAI" });
    (async () => {
      try {
        await reload();
      } finally {
        setLoading(false);
      }
    })();
  }, [onMeta]);

  const teacherAvg = (pid) =>
    avg(assessments.filter((a) => String(a.placement_id) === String(pid) && a.assessor_role === "teacher").map((a) => Number(a.score)));
  const companyAvg = (pid) =>
    avg(assessments.filter((a) => String(a.placement_id) === String(pid) && a.assessor_role === "company").map((a) => Number(a.score)));
  const finalOf = (pid) => finals.find((f) => String(f.placement_id) === String(pid));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!formPlacement) {
      setError("Pilih siswa dulu.");
      return;
    }
    const entries = components
      .map((c) => ({ component: c, score: Number(scores[c.id]) }))
      .filter((x) => x.score >= 0 && x.score <= 100 && scores[x.component.id] !== "");

    if (!entries.length) {
      setError("Isi minimal satu nilai (0–100).");
      return;
    }
    setSaving(true);
    try {
      for (const { component, score } of entries) {
        await assessmentsApi.store({
          placement_id: Number(formPlacement),
          component_id: component.id,
          score,
          note: note.trim() || null,
        });
      }
      setScores({});
      setNote("");
      await reload();
      setSuccess("Penilaian tersimpan.");
    } catch (err) {
      setError(err?.message || "Gagal menyimpan penilaian.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="zip-page">
      {loading && <div className="zip-muted">Memuat…</div>}

      <div className="zip-card" style={{ marginBottom: 16 }}>
        <h4 style={{ margin: "0 0 10px" }}>Rekap — Siswa • Jurnal • Evaluasi • Nilai</h4>
        <div className="ds-rows">
          {placements.map((p) => {
            const t = teacherAvg(p.id);
            const c = companyAvg(p.id);
            const f = finalOf(p.id);
            return (
              <div className="ds-row" key={p.id}>
                <strong>{p.student?.name}</strong> — {t ?? "-"} — {c ?? "-"} —{" "}
                {f ? (
                  <>
                    {f.final_score} ({statusLabel(f.status)})
                  </>
                ) : (
                  statusLabel(p.status)
                )}
              </div>
            );
          })}
          {placements.length === 0 && !loading && (
            <div className="zip-muted">Belum ada siswa untuk dinilai.</div>
          )}
        </div>
      </div>

      <div className="zip-card">
        <h4 style={{ margin: "0 0 10px" }}>Input Nilai Guru</h4>
        <form className="zip-form" onSubmit={submit}>
        {error && <div className="zip-error">{error}</div>}
        {success && <div className="zip-muted">{success}</div>}
        <label className="zip-field">
          <span>Siswa</span>
          <select value={formPlacement} onChange={(e) => setFormPlacement(e.target.value)}>
            <option value="">— Pilih siswa —</option>
            {placements.map((p) => (
              <option key={p.id} value={p.id}>
                {p.student?.name} • {p.company?.name || "-"}
              </option>
            ))}
          </select>
        </label>
        {components.map((c) => (
          <label className="zip-field" key={c.id}>
            <span>
              {c.name} {c.weight ? `(bobot ${c.weight}%)` : ""}
            </span>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="0–100"
              value={scores[c.id] ?? ""}
              onChange={(e) => setScores((s) => ({ ...s, [c.id]: e.target.value }))}
            />
          </label>
        ))}
        <label className="zip-field">
          <span>Catatan (opsional)</span>
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="cth Konsisten & mandiri" />
        </label>
        <div className="zip-form-actions">
          <button type="submit" className="zip-btn-primary" disabled={saving}>
            {saving ? "Menyimpan…" : "Simpan Penilaian"}
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}

export default Penilaian;
