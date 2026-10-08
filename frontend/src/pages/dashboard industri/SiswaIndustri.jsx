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
  const [jmlJurnal, setJmlJurnal] = useState({});
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
          const counts = {};
          for (const pl of rows) {
            const js = journals.filter((j) => String(j.placement_id) === String(pl.id));
            const terakhir = js[0]?.journal_date;
            if (!terakhir || new Date(terakhir).getTime() < batas) sepi.add(pl.id);
            counts[pl.id] = {
              total: js.length,
              ok: js.filter((j) => ["verified", "approved"].includes(j.status)).length,
            };
          }
          setSepiIds(sepi);
          setJmlJurnal(counts);
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
        {placements.map((p) => {
          const jj = jmlJurnal[p.id] || { total: 0, ok: 0 };
          const nm = p.student?.name || "-";
          const inisial = nm.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
          return (
          <div className="zip-row" key={p.id}>
            <span className="zip-user-cell">
              <span className="zip-avatar" style={{ background: "#dbeafe", color: "#1d4ed8" }}>{inisial}</span>
              <span>
                <div className="zip-user-name">{nm}</div>
                <div className="zip-user-email">
                  {jj.total} jurnal • {jj.ok} disetujui
                </div>
              </span>
            </span>
            <span className="zip-row-text" style={{ marginLeft: 12 }}>
              {p.status === "active"
                ? <span className="zip-badge b-green">PKL Aktif</span>
                : <span className="zip-badge b-gray">{statusLabel(p.status)}</span>}
              {sepiIds.has(p.id) && p.status === "active" && (
                <span className="zip-badge b-red" title="Belum mengisi jurnal 3 hari" style={{ marginLeft: 6 }}>
                  <i className="fa-solid fa-triangle-exclamation"></i> Jurnal sepi
                </span>
              )}
            </span>
            <span className="zip-row-actions">
              <button
                type="button"
                className="zip-btn-outline"
                onClick={() => navigate(`/pembimbing/siswa/${p.id}`)}
              >
                Detail
              </button>
            </span>
          </div>
          );
        })}
      </div>
      {!loading && placements.length === 0 && (
        <div className="zip-muted">Belum ada siswa di perusahaan ini.</div>
      )}
    </div>
  );
}

export default SiswaIndustri;
