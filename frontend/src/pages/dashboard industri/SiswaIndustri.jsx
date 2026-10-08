import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getEnrichedPlacements,
  getJournalsForPlacements,
  getMyCompanyId,
  statusLabel,
} from "../../lib/role-data.js";

function SiswaIndustri({ onMeta }) {
  const navigate = useNavigate();
  const [placements, setPlacements] = useState([]);
  const [sepiIds, setSepiIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const companyId = await getMyCompanyId();
        let rows = await getEnrichedPlacements();
        if (companyId) {
          rows = rows.filter((p) => String(p.company_id) === String(companyId));
        }
        setPlacements(rows);
        try {
          const journals = await getJournalsForPlacements(rows);
          const batas = Date.now() - 3 * 864e5;
          const sepi = new Set();
          for (const pl of rows) {
            const js = journals.filter((j) => String(j.placement_id) === String(pl.id));
            const terakhir = js[0]?.journal_date;
            if (!terakhir || new Date(terakhir).getTime() < batas) sepi.add(pl.id);
          }
          setSepiIds(sepi);
        } catch { /* abaikan */ }
        onMeta?.({
          title: "Siswa Bimbingan",
          subtitle: `${rows.length} siswa • klik detail`,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [onMeta]);

  return (
    <div className="zip-page">
      {loading && <div className="zip-muted">Memuat…</div>}
      <div className="zip-list">
        {placements.map((p) => (
          <div className="zip-row" key={p.id}>
            <span className="zip-row-text">
              {p.student?.name} • {p.company?.name || "-"} • {statusLabel(p.status)}
              {sepiIds.has(p.id) && p.status === "active" && (
                <span className="zip-badge b-red" title="Belum mengisi jurnal 3 hari" style={{ marginLeft: 8 }}>
                  <i className="fa-solid fa-triangle-exclamation"></i> Jurnal sepi
                </span>
              )}
            </span>
            <span className="zip-row-actions">
              <button
                type="button"
                className="zip-btn-outline"
                onClick={() => navigate(`/industri/siswa/${p.id}`)}
              >
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
