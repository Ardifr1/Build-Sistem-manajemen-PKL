import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEnrichedPlacements, getJournalsForPlacements } from "../../lib/role-data.js";
import { initials, avatarColor } from "../../components/admin/user-table.jsx";

function GuruDashboard({ onMeta }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [sepiList, setSepiList] = useState([]);
  const [revisiList, setRevisiList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onMeta?.({ title: "Dashboard Guru", subtitle: "" });
    (async () => {
      try {
        const placements = await getEnrichedPlacements();
        const active = placements.filter((p) => p.status === "active");
        const journals = await getJournalsForPlacements(active);

        const perluRevisi = journals.filter((j) => j.status === "needs_revision");

        // Siswa yang 3 hari terakhir tidak mengirim jurnal.
        const threeDaysAgo = Date.now() - 3 * 864e5;
        const lastJournal = {};
        for (const j of journals) {
          const t = new Date(j.journal_date || 0).getTime();
          if (!lastJournal[j.placement_id] || t > lastJournal[j.placement_id]) {
            lastJournal[j.placement_id] = t;
          }
        }
        const sepi = active.filter((p) => {
          const last = lastJournal[p.id];
          return !last || last < threeDaysAgo;
        });

        const total = active.length;
        onMeta?.({
          title: "Dashboard Guru",
          subtitle: `${total} siswa • ${perluRevisi.length} perlu perhatian • monitoring`,
        });
        setStats({
          siswa: total,
          revisi: perluRevisi.length,
          belumJurnal: sepi.length,
          evaluasi: 0,
        });
        setSepiList(sepi.slice(0, 5));
        setRevisiList(perluRevisi.slice(0, 5));
      } catch {
        setStats({ siswa: 0, revisi: 0, belumJurnal: 0, evaluasi: 0 });
      } finally {
        setLoading(false);
      }
    })();
  }, [onMeta]);

  const cards = [
    { label: "Siswa Bimbingan", value: stats?.siswa ?? "…", hint: "aktif", icon: "fa-users", bg: "#dbeafe", color: "#1d4ed8" },
    { label: "Jurnal perlu revisi", value: stats?.revisi ?? "…", hint: "dari Industri", icon: "fa-file-pen", bg: "#fef3c7", color: "#b45309" },
    { label: "Belum jurnal 3 hari", value: stats?.belumJurnal ?? "…", hint: "hubungi siswa", icon: "fa-bell", bg: "#fee2e2", color: "#dc2626" },
    { label: "Evaluasi masuk", value: stats?.evaluasi ?? "…", hint: "dari perusahaan", icon: "fa-star", bg: "#dcfce7", color: "#15803d" },
  ];

  return (
    <div className="zip-page">
      <div className="zip-stats">
        {cards.map((c) => (
          <div className="zip-stat" key={c.label} style={{ background: c.bg }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div className="zip-stat-label" style={{ color: c.color }}>{c.label}</div>
                <div className="zip-stat-value" style={{ color: "#0f172a", fontSize: 28 }}>{loading ? "…" : c.value}</div>
                <div className="zip-stat-hint" style={{ color: c.color }}>{c.hint}</div>
              </div>
              <span style={{
                width: 44, height: 44, borderRadius: 12, background: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: c.color, fontSize: 18, boxShadow: "0 1px 3px rgba(0,0,0,.08)", flexShrink: 0,
              }}>
                <i className={`fa-solid ${c.icon}`}></i>
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="zip-cols2" style={{ marginTop: 2 }}>
        {/* Perlu perhatian */}
        <div className="zip-card" style={{ maxWidth: "none" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h3 className="zip-card-title" style={{ margin: 0 }}>Perlu Perhatian</h3>
            {sepiList.length > 0 && (
              <button type="button" className="zip-btn-outline" onClick={() => navigate("/guru/siswa")}>
                Lihat semua <i className="fa-solid fa-arrow-right"></i>
              </button>
            )}
          </div>
          {loading && <div className="zip-muted">Memuat…</div>}
          {!loading && sepiList.length === 0 && (
            <div className="zip-empty">
              <i className="fa-solid fa-circle-check"></i>
              <div>Semua siswa aktif mengisi jurnal.</div>
              <small>Tidak ada yang perlu dihubungi saat ini.</small>
            </div>
          )}
          <div className="zip-list">
            {sepiList.map((p) => (
              <div className="zip-row" key={p.id}>
                <span className="zip-user-cell">
                  <span className="zip-avatar" style={{ background: avatarColor(p.student?.name) }}>
                    {initials(p.student?.name)}
                  </span>
                  <span>
                    <div className="zip-user-name">{p.student?.name}</div>
                    <div className="zip-user-email">{p.company?.name || "-"}</div>
                  </span>
                </span>
                <span className="zip-row-actions">
                  <span className="zip-badge b-red">
                    <i className="fa-solid fa-triangle-exclamation"></i> Jurnal sepi
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Jurnal perlu revisi */}
        <div className="zip-card" style={{ maxWidth: "none" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h3 className="zip-card-title" style={{ margin: 0 }}>Jurnal Perlu Revisi</h3>
            {revisiList.length > 0 && (
              <button type="button" className="zip-btn-outline" onClick={() => navigate("/guru/jurnal")}>
                Lihat semua <i className="fa-solid fa-arrow-right"></i>
              </button>
            )}
          </div>
          {loading && <div className="zip-muted">Memuat…</div>}
          {!loading && revisiList.length === 0 && (
            <div className="zip-empty">
              <i className="fa-solid fa-circle-check"></i>
              <div>Tidak ada jurnal yang perlu revisi.</div>
              <small>Semua jurnal dalam kondisi baik.</small>
            </div>
          )}
          <div className="zip-list">
            {revisiList.map((j) => (
              <div className="zip-row" key={j.id}>
                <span className="zip-row-text">
                  <strong>{j.placement?.student?.name || "Siswa"}</strong>
                  <span className="zip-sub"> • {j.journal_date || "-"}</span>
                  <br />
                  <span className="zip-muted">{(j.revised_activity || j.activity || "").slice(0, 60)}</span>
                </span>
                <span className="zip-row-actions">
                  <span className="zip-badge b-amber">Perlu revisi</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="guru-banner">
        Guru hanya <strong>MONITORING</strong> — tidak ada tombol Approve / Reject jurnal harian.
      </div>
    </div>
  );
}

export default GuruDashboard;
