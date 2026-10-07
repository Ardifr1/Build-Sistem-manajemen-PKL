import { useEffect, useState } from "react";
import { getEnrichedPlacements, getJournalsForPlacements } from "../../lib/role-data.js";

function GuruDashboard({ onMeta }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onMeta?.({ title: "Dashboard Guru", subtitle: "" });
    (async () => {
      try {
        const placements = await getEnrichedPlacements();
        const active = placements.filter((p) => p.status === "active");
        const journals = await getJournalsForPlacements(active);

        const perluRevisi = journals.filter((j) => j.status === "needs_revision").length;

        // Siswa yang 3 hari terakhir tidak mengirim jurnal.
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        const lastJournal = {};
        for (const j of journals) {
          const d = new Date(j.journal_date);
          if (!lastJournal[j.placement_id] || d > new Date(lastJournal[j.placement_id])) {
            lastJournal[j.placement_id] = j.journal_date;
          }
        }
        const belumJurnal = active.filter((p) => {
          const last = lastJournal[p.id];
          return !last || new Date(last) < threeDaysAgo;
        }).length;

        const total = active.length;
        onMeta?.({
          title: "Dashboard Guru",
          subtitle: `${total} siswa • ${perluRevisi} perlu perhatian • monitoring`,
        });
        setStats({
          siswa: total,
          revisi: perluRevisi,
          belumJurnal,
          evaluasi: 0,
        });
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
      <div className="guru-banner">
        Guru hanya <strong>MONITORING</strong> — tidak ada tombol Approve / Reject jurnal harian.
      </div>
    </div>
  );
}

export default GuruDashboard;
