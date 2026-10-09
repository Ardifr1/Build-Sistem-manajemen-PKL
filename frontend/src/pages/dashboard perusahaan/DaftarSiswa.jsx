import { useEffect, useState } from "react";
import { placementsApi } from "../../api/index.js";
import { SkelCards } from "../../components/role/skeleton.jsx";
import { initials, avatarColor } from "../../components/admin/user-table.jsx";

function DaftarSiswa({ onMeta }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSch, setOpenSch] = useState({});

  useEffect(() => {
    onMeta?.({ title: "Daftar Siswa", subtitle: "Siswa PKL di perusahaan • dikelompokkan per sekolah" });
    (async () => {
      try {
        const r = await placementsApi.index();
        const list = (Array.isArray(r) ? r : r?.data || []).filter((p) =>
          ["active", "completed"].includes(p.status)
        );
        setRows(list);
        // buka grup pertama secara default
        const first = list[0]?.student?.school?.name || "Sekolah";
        setOpenSch({ [first]: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [onMeta]);

  const groups = {};
  rows.forEach((p) => {
    const sch = p.student?.school?.name || "Sekolah";
    (groups[sch] = groups[sch] || []).push(p);
  });

  if (loading) return <SkelCards n={4} />;

  return (
    <div className="zip-page has-m-cards">
      {rows.length === 0 && <p className="zip-muted">Belum ada siswa PKL di perusahaan.</p>}
      {Object.entries(groups).map(([sch, list]) => (
        <div className="zip-card" key={sch} style={{ marginBottom: 14 }}>
          <button
            type="button"
            className="zip-group-head"
            onClick={() => setOpenSch((s) => ({ ...s, [sch]: !s[sch] }))}
          >
            <span><i className="fa-solid fa-school"></i> {sch}</span>
            <span className="zip-count">{list.length} siswa</span>
            <i className={`fa-solid fa-chevron-${openSch[sch] ? "up" : "down"}`}></i>
          </button>
          {openSch[sch] && (
            <>
              <div className="zip-table-wrap">
                <table className="zip-table">
                  <thead><tr><th>Siswa</th><th>Status</th><th>Pembimbing</th></tr></thead>
                  <tbody>
                    {list.map((p) => (
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
                        <td>
                          {p.status === "active"
                            ? <span className="zip-badge b-green">PKL Aktif</span>
                            : <span className="zip-badge b-blue">Selesai</span>}
                        </td>
                        <td>{p.supervisor?.user?.name || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="m-cards">
                {list.map((p) => (
                  <div className="m-card" key={p.id}>
                    <div className="m-card-top">
                      <span className="zip-avatar" style={{ background: avatarColor(p.student?.name), width: 44, height: 44, fontSize: 16 }}>
                        {initials(p.student?.name)}
                      </span>
                      <div className="m-card-tx">
                        <b>{p.student?.name}</b>
                        <small>{p.student?.kelas || ""} • {p.supervisor?.user?.name || "Belum ditugaskan"}</small>
                      </div>
                    </div>
                    <div className="m-card-bottom">
                      {p.status === "active"
                        ? <span className="zip-badge b-green">PKL Aktif</span>
                        : <span className="zip-badge b-blue">Selesai</span>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default DaftarSiswa;
