import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEnrichedPlacements, statusLabel } from "../../lib/role-data.js";

function SiswaBimbingan({ onMeta }) {
  const navigate = useNavigate();
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onMeta?.({ title: "Siswa Bimbingan", subtitle: "" });
    (async () => {
      try {
        const rows = await getEnrichedPlacements();
        setPlacements(rows);
        onMeta?.({ title: "Siswa Bimbingan", subtitle: `${rows.length} siswa • klik detail` });
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
            </span>
            <span className="zip-row-actions">
              <button
                type="button"
                className="zip-btn-outline"
                onClick={() => navigate(`/guru/siswa/${p.id}`)}
              >
                Detail
              </button>
            </span>
          </div>
        ))}
      </div>
      {!loading && placements.length === 0 && (
        <div className="zip-muted">Belum ada siswa bimbingan.</div>
      )}
    </div>
  );
}

export default SiswaBimbingan;
