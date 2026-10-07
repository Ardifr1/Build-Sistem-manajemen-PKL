import { useEffect, useState } from "react";
import { applicationsApi, placementsApi, supervisorsApi, companiesApi } from "../../api/index.js";

function StatCard({ bg, ic, label, num, trend, trendColor, svg }) {
  return (
    <div className="zip-stat" style={{ background: bg }}>
      <div className="zip-stat-top">
        <span className="zip-stat-ic" style={{ background: ic }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">{svg}</svg>
        </span>
        <span className="zip-stat-lab">{label}</span>
      </div>
      <div className="zip-stat-num">{num}</div>
      <div className="zip-stat-trend" style={{ color: trendColor }}>{trend}</div>
    </div>
  );
}

function PerusahaanDashboard({ onMeta }) {
  const [stats, setStats] = useState({ pengajuan: 0, aktif: 0, pembimbing: 0, evaluasi: 0 });
  const [bySchool, setBySchool] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onMeta?.({ title: "Dashboard Perusahaan", subtitle: "Kelola magang perusahaan Anda" });
    (async () => {
      try {
        const [apps, pls, sups] = await Promise.all([
          applicationsApi.index().catch(() => []),
          placementsApi.index().catch(() => []),
          supervisorsApi.index().catch(() => []),
        ]);
        const a = Array.isArray(apps) ? apps : apps?.data || [];
        const p = Array.isArray(pls) ? pls : pls?.data || [];
        const s = Array.isArray(sups) ? sups : sups?.data || [];
        setStats({
          pengajuan: a.filter((x) => x.status === "pending" || x.status === "submitted").length,
          aktif: p.filter((x) => x.status === "active").length,
          pembimbing: s.length,
          evaluasi: p.filter((x) => x.status === "active").length,
        });
        // kelompokkan per sekolah
        const groups = {};
        p.forEach((x) => {
          const sch = x.student?.school?.name || x.school_name || "Sekolah";
          if (!groups[sch]) groups[sch] = [];
          groups[sch].push(x);
        });
        setBySchool(Object.entries(groups));
      } finally {
        setLoading(false);
      }
    })();
  }, [onMeta]);

  return (
    <div className="zip-page">
      {loading && <div className="zip-muted">Memuat…</div>}
      <div className="zip-stats">
        <StatCard bg="#fefce8" ic="#ca8a04" label="Pengajuan Masuk" num={stats.pengajuan} trend="menunggu review" trendColor="#ca8a04"
          svg={<><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></>} />
        <StatCard bg="#f0fdf4" ic="#16a34a" label="Siswa Aktif" num={stats.aktif} trend="sedang magang" trendColor="#16a34a"
          svg={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></>} />
        <StatCard bg="#eff6ff" ic="#2563eb" label="Pembimbing Industri" num={stats.pembimbing} trend="kelola di menu Pembimbing" trendColor="#2563eb"
          svg={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>} />
        <StatCard bg="#fef2f2" ic="#dc2626" label="Perlu Evaluasi" num={stats.evaluasi} trend="segera dinilai" trendColor="#dc2626"
          svg={<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#fff" stroke="#fff" />} />
      </div>

      <div className="zip-cols2">
        <div className="zip-card">
          <h3 className="zip-card-title" style={{ marginTop: 0 }}>Siswa per Sekolah</h3>
          {bySchool.length === 0 && <div className="zip-muted">Belum ada siswa.</div>}
          {bySchool.map(([sch, list]) => (
            <div className="zip-school" key={sch}>
              <div className="zip-school-head">{sch} <span className="zip-count">{list.length} siswa</span></div>
              {list.slice(0, 4).map((x) => (
                <div className="zip-srow" key={x.id}>
                  <span>{x.student?.name || "-"} <span className="zip-sub">• {x.student?.major || ""}</span></span>
                  <span className={`zip-badge ${x.status === "active" ? "b-green" : "b-amber"}`}>
                    {x.status === "active" ? "Aktif" : x.status}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="zip-card">
          <h3 className="zip-card-title" style={{ marginTop: 0 }}>Notifikasi</h3>
          <div className="zip-notif"><div className="ic">📥</div><div><strong>Pengajuan baru</strong> — perlu review & jadwal interview</div></div>
          <div className="zip-notif"><div className="ic">🗓️</div><div><strong>Interview terjadwal</strong> — cek menu Seleksi & Interview</div></div>
          <div className="zip-notif"><div className="ic">⭐</div><div><strong>Evaluasi</strong> — siswa aktif perlu dinilai</div></div>
        </div>
      </div>
    </div>
  );
}

export default PerusahaanDashboard;
