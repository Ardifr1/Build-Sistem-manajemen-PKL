import { useEffect, useState } from "react";
import {
  getEnrichedPlacements,
  getJournalsForPlacements,
  statusLabel,
} from "../../lib/role-data.js";

const STATUS_FILTER = ["semua", "draft", "submitted", "verified", "needs_revision"];

function MonitoringJurnal({ onMeta }) {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("semua");
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    onMeta?.({ title: "Monitoring Jurnal", subtitle: "Read-only • filter siswa & status" });
    (async () => {
      try {
        const placements = await getEnrichedPlacements();
        const rows = await getJournalsForPlacements(placements);
        setJournals(rows);
      } finally {
        setLoading(false);
      }
    })();
  }, [onMeta]);

  const shown =
    filter === "semua" ? journals : journals.filter((j) => j.status === filter);

  if (detail) {
    const j = detail;
    return (
      <div className="zip-page">
        <div className="zip-toolbar">
          <button type="button" className="zip-btn-outline" onClick={() => setDetail(null)}>
            ← Kembali
          </button>
        </div>
        <div className="zip-card">
          <h3>
            {j.placement?.student?.name} • {j.journal_date}
          </h3>
          <div className="guru-detail-grid">
            <label className="zip-field">
              <span>Aktivitas</span>
              <div>{j.revised_activity || j.activity || "-"}</div>
            </label>
            <label className="zip-field">
              <span>Status</span>
              <div>{statusLabel(j.status)}</div>
            </label>
            <label className="zip-field">
              <span>Catatan Guru</span>
              <div>{j.teacher_note || "-"}</div>
            </label>
            <label className="zip-field">
              <span>Catatan Industri</span>
              <div>{j.company_note || "-"}</div>
            </label>
          </div>
          <div className="guru-banner">
            Guru hanya <strong>MONITORING</strong> — verifikasi jurnal dilakukan oleh
            pembimbing industri.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="zip-page">
      <div className="zip-toolbar">
        <label className="zip-field" style={{ maxWidth: 220 }}>
          <span>Filter status</span>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            {STATUS_FILTER.map((s) => (
              <option key={s} value={s}>
                {s === "semua" ? "Semua" : statusLabel(s)}
              </option>
            ))}
          </select>
        </label>
      </div>
      {loading && <div className="zip-muted">Memuat…</div>}
      <div className="zip-list">
        {shown.map((j) => (
          <div className="zip-row" key={j.id} onClick={() => setDetail(j)} style={{ cursor: "pointer" }}>
            <span className="zip-row-text">
              {j.placement?.student?.name} • {j.journal_date} •{" "}
              {(j.revised_activity || j.activity || "").slice(0, 40)} — {statusLabel(j.status)}
            </span>
          </div>
        ))}
      </div>
      {!loading && shown.length === 0 && (
        <div className="zip-muted">Tidak ada jurnal pada filter ini.</div>
      )}
    </div>
  );
}

export default MonitoringJurnal;
