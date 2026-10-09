import { useEffect, useMemo, useState } from "react";
import { journalsApi, placementsApi, usersApi, companiesApi } from "../../api/index.js";
import { SkelCards } from "../../components/role/skeleton.jsx";
import "./admin-pages.css";

const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const fmtDate = (iso) => {
  if (!iso) return "-";
  const s = String(iso).slice(0, 10);
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d || !BULAN[m - 1]) return s;
  return `${d} ${BULAN[m - 1]} ${y}`;
};

const PENDING = ["submitted", "pending", "menunggu"];

/**
 * Admin > Monitoring Jurnal — awasi perusahaan yang lambat verifikasi.
 * Dikelompokkan per perusahaan (bukan per jurnal seperti di guru).
 */
function MonitoringJurnal({ onMeta }) {
  const [journals, setJournals] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reminded, setReminded] = useState({});
  const [filter, setFilter] = useState("menunggu"); // menunggu | semua

  useEffect(() => {
    onMeta?.({ title: "Monitoring Jurnal", subtitle: "Awasi verifikasi jurnal per perusahaan" });
    (async () => {
      try {
        const [jRes, pRes, uRes, cRes] = await Promise.all([
          journalsApi.index().catch(() => ({ data: [] })),
          placementsApi.index().catch(() => ({ data: [] })),
          usersApi.index().catch(() => ({ data: [] })),
          companiesApi.index().catch(() => ({ data: [] })),
        ]);
        setJournals(Array.isArray(jRes.data) ? jRes.data : []);
        setPlacements(Array.isArray(pRes.data) ? pRes.data : []);
        setUsers(Array.isArray(uRes.data) ? uRes.data : []);
        setCompanies(Array.isArray(cRes.data) ? cRes.data : []);
      } catch (e) {
        setError(e?.message || "Gagal memuat jurnal.");
      } finally {
        setLoading(false);
      }
    })();
  }, [onMeta]);

  const byCompany = useMemo(() => {
    const userMap = Object.fromEntries(users.map((u) => [u.id, u.name]));
    const placementMap = Object.fromEntries(placements.map((p) => [p.id, p]));
    const groups = {};
    for (const j of journals) {
      const pl = placementMap[j.placement_id];
      if (!pl) continue;
      const cid = pl.company_id;
      if (!groups[cid]) groups[cid] = { companyId: cid, pending: [], total: 0 };
      groups[cid].total += 1;
      if (PENDING.includes(j.status)) {
        groups[cid].pending.push({
          ...j,
          siswa: userMap[pl.student_id] || `Siswa #${pl.student_id}`,
        });
      }
    }
    const companyMap = Object.fromEntries(companies.map((c) => [c.id, c]));
    return Object.values(groups)
      .map((g) => ({ ...g, company: companyMap[g.companyId]?.name || `Perusahaan #${g.companyId}` }))
      .filter((g) => (filter === "menunggu" ? g.pending.length > 0 : true))
      .sort((a, b) => b.pending.length - a.pending.length);
  }, [journals, placements, users, companies, filter]);

  const totalPending = byCompany.reduce((s, g) => s + g.pending.length, 0);

  const ingatkan = (companyId, companyName) => {
    // TODO: kirim notifikasi beneran ke perusahaan (email/push) saat backend siap
    setReminded((r) => ({ ...r, [companyId]: true }));
  };

  return (
    <div className="zip-page">
      {error && <div className="zip-error">{error}</div>}

      <div className="zip-toolbar">
        <span className="zip-muted">
          {totalPending} jurnal menunggu verifikasi • {byCompany.length} perusahaan
        </span>
        <span style={{ display: "flex", gap: 8 }}>
          {["menunggu", "semua"].map((f) => (
            <button
              key={f}
              type="button"
              className={filter === f ? "zip-btn-primary" : "zip-btn-outline"}
              onClick={() => setFilter(f)}
            >
              {f === "menunggu" ? "Menunggu" : "Semua"}
            </button>
          ))}
        </span>
      </div>

      {loading ? (
        <SkelCards n={3} />
      ) : byCompany.length === 0 ? (
        <p className="zip-muted">
          {filter === "menunggu"
            ? "Semua jurnal sudah diverifikasi perusahaan. 🎉"
            : "Belum ada data jurnal."}
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {byCompany.map((g) => (
            <div className="zip-card" key={g.companyId} style={{ maxWidth: "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                  <h3 className="zip-card-title" style={{ margin: 0 }}>{g.company}</h3>
                  <div className="zip-sub">
                    {g.pending.length > 0 ? (
                      <>{g.pending.length} jurnal menunggu verifikasi • {g.total} total</>
                    ) : (
                      <>{g.total} jurnal • semua terverifikasi ✓</>
                    )}
                  </div>
                </div>
                {g.pending.length > 0 && (
                  reminded[g.companyId] ? (
                    <span className="zip-badge b-green">✓ Sudah diingatkan</span>
                  ) : (
                    <button
                      type="button"
                      className="zip-btn-primary"
                      onClick={() => ingatkan(g.companyId, g.company)}
                    >
                      <i className="fa-solid fa-bell" style={{ marginRight: 6 }}></i>
                      Ingatkan Perusahaan
                    </button>
                  )
                )}
              </div>
              {g.pending.length > 0 && (
                <div className="zip-table-wrap" style={{ boxShadow: "none" }}>
                  <table className="zip-table">
                    <thead>
                      <tr>
                        <th>Siswa</th>
                        <th>Tanggal Jurnal</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {g.pending.map((j) => (
                        <tr key={j.id}>
                          <td><strong>{j.siswa}</strong></td>
                          <td><span className="zip-sub">{fmtDate(j.journal_date)}</span></td>
                          <td><span className="zip-badge b-amber">Menunggu Verifikasi</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="zip-note">
        ℹ️ Guru memantau <em>isi</em> jurnal lewat menu Monitoring Jurnal di dashboard guru. Di sini admin memantau <em>ketepatan verifikasi</em> tiap perusahaan.
      </div>
    </div>
  );
}

export default MonitoringJurnal;
