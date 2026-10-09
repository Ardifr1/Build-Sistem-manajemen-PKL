import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEnrichedPlacements, getJournalsForPlacements, statusLabel } from "../../lib/role-data.js";
import { initials, avatarColor } from "../../components/admin/user-table.jsx";
import { SkelCards } from "../../components/role/skeleton.jsx";

function SiswaBimbingan({ onMeta }) {
  const navigate = useNavigate();
  const [placements, setPlacements] = useState([]);
  const [sepiIds, setSepiIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onMeta?.({ title: "Siswa Bimbingan", subtitle: "" });
    (async () => {
      try {
        const rows = await getEnrichedPlacements();
        setPlacements(rows);
        // Cek jurnal 3 hari terakhir per siswa
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
        onMeta?.({ title: "Siswa Bimbingan", subtitle: `${rows.length} siswa • klik detail` });
      } finally {
        setLoading(false);
      }
    })();
  }, [onMeta]);

  return (
    <div className="zip-page">
      {loading && <SkelCards n={3} />}
      <div className="zip-table-wrap">
        <table className="zip-table">
          <thead>
            <tr>
              <th>Siswa</th>
              <th>Perusahaan</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {placements.map((p) => (
              <tr key={p.id}>
                <td>
                  <span className="zip-user-cell">
                    <span className="zip-avatar" style={{ background: avatarColor(p.student?.name) }}>
                      {initials(p.student?.name)}
                    </span>
                    <span>
                      <div className="zip-user-name">{p.student?.name}</div>
                      <div className="zip-user-email">{p.student?.kelas || ""}</div>
                    </span>
                  </span>
                </td>
                <td>{p.company?.name || "-"}</td>
                <td>
                  {p.status === "active"
                    ? <span className="zip-badge b-green">PKL Aktif</span>
                    : p.status === "completed"
                      ? <span className="zip-badge b-blue">Selesai</span>
                      : <span className="zip-badge b-gray">{statusLabel(p.status)}</span>}
                  {sepiIds.has(p.id) && p.status === "active" && (
                    <span className="zip-badge b-red" title="Belum mengisi jurnal 3 hari terakhir" style={{ marginLeft: 6 }}>
                      <i className="fa-solid fa-triangle-exclamation"></i> Jurnal sepi
                    </span>
                  )}
                </td>
                <td style={{ textAlign: "right" }}>
                  <button
                    type="button"
                    className="zip-act zip-act-detail"
                    onClick={() => navigate(`/guru/siswa/${p.id}`)}
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="m-cards">
        {placements.map((p) => (
          <div className="m-card" key={p.id} onClick={() => navigate(`/guru/siswa/${p.id}`)}>
            <div className="m-card-top">
              <span className="zip-avatar" style={{ background: avatarColor(p.student?.name), width: 44, height: 44, fontSize: 16 }}>
                {initials(p.student?.name)}
              </span>
              <div className="m-card-tx">
                <b>{p.student?.name}</b>
                <small>{p.student?.kelas || ""} • {p.company?.name || "-"}</small>
              </div>
              <i className="fa-solid fa-chevron-right m-card-arrow"></i>
            </div>
            <div className="m-card-bottom">
              {p.status === "active"
                ? <span className="zip-badge b-green">PKL Aktif</span>
                : p.status === "completed"
                  ? <span className="zip-badge b-blue">Selesai</span>
                  : <span className="zip-badge b-gray">{statusLabel(p.status)}</span>}
              {sepiIds.has(p.id) && p.status === "active" && (
                <span className="zip-badge b-red"><i className="fa-solid fa-triangle-exclamation"></i> Jurnal sepi</span>
              )}
            </div>
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
