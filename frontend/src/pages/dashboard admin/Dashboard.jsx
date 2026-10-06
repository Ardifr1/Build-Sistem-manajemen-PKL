import { useEffect, useState } from "react";
import { dashboardApi, journalsApi } from "../../api/index.js";
import "./admin-pages.css";

function StatBox({ label, value, hint }) {
  return (
    <div className="zip-stat">
      <div className="zip-stat-label">{label}</div>
      <div className="zip-stat-value">{value}</div>
      <div className="zip-stat-hint">{hint}</div>
    </div>
  );
}

function Dashboard({ onMeta }) {
  const [summary, setSummary] = useState(null);
  const [jurnalMenunggu, setJurnalMenunggu] = useState(0);

  useEffect(() => {
    let alive = true;
    dashboardApi
      .adminSummary()
      .then((s) => {
        if (!alive) return;
        const d = s.data || {};
        setSummary(d);
        onMeta?.({
          subtitle: `Siswa ${d.total_siswa ?? "–"} • mitra ${d.total_perusahaan ?? "–"} • pengajuan ${d.pengajuan_aktif ?? "–"} • periode AKTIF`,
        });
      })
      .catch(() => alive && onMeta?.({ subtitle: "" }));
    journalsApi
      .index()
      .then((r) => {
        if (!alive) return;
        const list = Array.isArray(r.data) ? r.data : r.data?.data || [];
        setJurnalMenunggu(list.filter((j) => ["submitted", "pending", "menunggu"].includes(j.status)).length);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [onMeta]);

  if (!summary) {
    return (
      <div className="zip-page">
        <p className="zip-muted">Memuat dashboard…</p>
      </div>
    );
  }

  return (
    <div className="zip-page">
      <div className="zip-stats">
        <StatBox label="Siswa" value={Number(summary.total_siswa || 0).toLocaleString("id-ID")} hint="terdaftar" />
        <StatBox label="Guru" value={Number(summary.total_guru || 0).toLocaleString("id-ID")} hint="pembimbing" />
        <StatBox label="Perusahaan" value={Number(summary.total_perusahaan || 0).toLocaleString("id-ID")} hint="mitra aktif" />
        <StatBox label="Pengajuan" value={Number(summary.pengajuan_aktif || 0).toLocaleString("id-ID")} hint="periode ini" />
        <StatBox label="Penempatan" value={Number(summary.siswa_ditempatkan || 0).toLocaleString("id-ID")} hint="resmi" />
        <StatBox label="Jurnal menunggu" value={Number(jurnalMenunggu).toLocaleString("id-ID")} hint="industri" />
      </div>
    </div>
  );
}

export default Dashboard;
