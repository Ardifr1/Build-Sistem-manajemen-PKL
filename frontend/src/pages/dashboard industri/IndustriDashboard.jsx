import { useEffect, useState } from "react";
import {
  getEnrichedPlacements,
  getJournalsForPlacements,
  getMyCompanyId,
} from "../../lib/role-data.js";

function IndustriDashboard({ onMeta }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const companyId = await getMyCompanyId();
        let placements = await getEnrichedPlacements();
        if (companyId) {
          placements = placements.filter(
            (p) => String(p.company_id) === String(companyId)
          );
        }
        const active = placements.filter((p) => p.status === "active");
        const journals = await getJournalsForPlacements(active);

        const menunggu = journals.filter((j) => j.status === "submitted").length;
        const disetujui = journals.filter((j) => j.status === "verified").length;
        const revisi = journals.filter((j) => j.status === "needs_revision").length;

        onMeta?.({
          title: "Dashboard Industri",
          subtitle: `${active.length} siswa • ${menunggu} menunggu verifikasi`,
        });
        setStats({ siswa: active.length, menunggu, disetujui, revisi });
      } catch {
        setStats({ siswa: 0, menunggu: 0, disetujui: 0, revisi: 0 });
      } finally {
        setLoading(false);
      }
    })();
  }, [onMeta]);

  const cards = [
    { label: "Siswa Dibimbing", value: stats?.siswa ?? "…", hint: "aktif" },
    { label: "Menunggu Verifikasi", value: stats?.menunggu ?? "…", hint: "tindakan" },
    { label: "Disetujui", value: stats?.disetujui ?? "…", hint: "jurnal" },
    { label: "Perlu Revisi", value: stats?.revisi ?? "…", hint: "terkirim" },
  ];

  return (
    <div className="zip-page">
      <div className="zip-stats">
        {cards.map((c) => (
          <div className="zip-stat" key={c.label}>
            <div className="zip-stat-label">{c.label}</div>
            <div className="zip-stat-value">{loading ? "…" : c.value}</div>
            <div className="zip-stat-hint">{c.hint}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default IndustriDashboard;
