import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEnrichedPlacements, statusLabel } from "../../lib/role-data.js";
import { initials, avatarColor } from "../../components/admin/user-table.jsx";

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
      {!loading && placements.length === 0 && (
        <div className="zip-muted">Belum ada siswa bimbingan.</div>
      )}
    </div>
  );
}

export default SiswaBimbingan;
