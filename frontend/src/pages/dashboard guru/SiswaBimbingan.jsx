import { useEffect, useState } from "react";
import { journalsApi } from "../../api/index.js";
import DetailSiswa from "../../components/role/detail-siswa.jsx";
import { getEnrichedPlacements, statusLabel } from "../../lib/role-data.js";

function SiswaBimbingan({ onMeta }) {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [detailJournals, setDetailJournals] = useState([]);

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

  const openDetail = async (p) => {
    setDetail(p);
    setDetailJournals([]);
    onMeta?.({
      title: `Detail Siswa — ${p.student?.name || ""}`,
      subtitle: "Profil • penempatan • jurnal • evaluasi",
    });
    try {
      const res = await journalsApi.index({ placement_id: p.id });
      setDetailJournals(res?.data ?? []);
    } catch {
      /* abaikan */
    }
  };

  const closeDetail = () => {
    setDetail(null);
    onMeta?.({ title: "Siswa Bimbingan", subtitle: `${placements.length} siswa • klik detail` });
  };

  if (detail) {
    return (
      <DetailSiswa
        placement={detail}
        journals={detailJournals}
        variant="guru"
        onBack={closeDetail}
      />
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
        <div className="zip-muted">Belum ada siswa bimbingan.</div>
      )}
    </div>
  );
}

export default SiswaBimbingan;
