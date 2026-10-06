import { useEffect, useState } from "react";
import { journalsApi } from "../../api/index.js";
import {
  getEnrichedPlacements,
  getMyCompanyId,
  statusLabel,
} from "../../lib/role-data.js";

function SiswaIndustri({ onMeta }) {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [detailJournals, setDetailJournals] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const companyId = await getMyCompanyId();
        let rows = await getEnrichedPlacements();
        if (companyId) {
          rows = rows.filter((p) => String(p.company_id) === String(companyId));
        }
        setPlacements(rows);
        onMeta?.({
          title: "Siswa Bimbingan",
          subtitle: `${rows.length} siswa • klik detail`,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [onMeta]);

  const openDetail = async (p) => {
    setDetail(p);
    setDetailJournals([]);
    try {
      const res = await journalsApi.index({ placement_id: p.id });
      setDetailJournals(res?.data ?? []);
    } catch {
      /* abaikan */
    }
  };

  if (detail) {
    return (
      <div className="zip-page">
        <div className="zip-toolbar">
          <button type="button" className="zip-btn-outline" onClick={() => setDetail(null)}>
            ← Kembali
          </button>
        </div>
        <div className="zip-card">
          <h3>{detail.student?.name}</h3>
          <div className="guru-detail-grid">
            <label className="zip-field">
              <span>Perusahaan</span>
              <div>{detail.company?.name || "-"}</div>
            </label>
            <label className="zip-field">
              <span>Status</span>
              <div>{statusLabel(detail.status)}</div>
            </label>
            <label className="zip-field">
              <span>Periode</span>
              <div>
                {detail.start_date || "-"} s/d {detail.end_date || "-"}
              </div>
            </label>
            <label className="zip-field">
              <span>Jumlah Jurnal</span>
              <div>{detailJournals.length} jurnal</div>
            </label>
          </div>
          <h4>Jurnal Terbaru</h4>
          <div className="zip-list">
            {detailJournals.slice(0, 5).map((j) => (
              <div className="zip-row" key={j.id}>
                <span className="zip-row-text">
                  {j.journal_date} • {(j.revised_activity || j.activity || "").slice(0, 60)} —{" "}
                  {statusLabel(j.status)}
                </span>
              </div>
            ))}
            {detailJournals.length === 0 && (
              <div className="zip-muted">Belum ada jurnal.</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="zip-page">
      {loading && <div className="zip-muted">Memuat…</div>}
      <div className="zip-list">
        {placements.map((p) => (
          <div className="zip-row" key={p.id}>
            <span className="zip-row-text">
              {p.student?.name} • {p.company?.name || "-"} • {statusLabel(p.status)}
            </span>
            <span className="zip-row-actions">
              <button type="button" className="zip-btn-outline" onClick={() => openDetail(p)}>
                Detail
              </button>
            </span>
          </div>
        ))}
      </div>
      {!loading && placements.length === 0 && (
        <div className="zip-muted">Belum ada siswa di perusahaan ini.</div>
      )}
    </div>
  );
}

export default SiswaIndustri;
