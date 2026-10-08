import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  dashboardApi, journalsApi, periodsApi, applicationsApi,
  placementsApi, companiesApi,
} from "../../api/index.js";
import "./admin-pages.css";

/* Dashboard Admin — sesuai mockup: 6 stat, perlu tindakan, periode aktif,
   pengajuan terbaru, distribusi status pengajuan. */

const STATUS_BADGE = {
  submitted: { label: "Diajukan", cls: "blue" },
  diajukan: { label: "Diajukan", cls: "blue" },
  reviewed: { label: "Dalam seleksi", cls: "yellow" },
  interview: { label: "Dalam seleksi", cls: "yellow" },
  accepted: { label: "Diterima", cls: "green" },
  diterima: { label: "Diterima", cls: "green" },
  rejected: { label: "Ditolak", cls: "red" },
  ditolak: { label: "Ditolak", cls: "red" },
};
const badgeOf = (s) => STATUS_BADGE[s] || { label: s || "-", cls: "gray" };

const fmtDate = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d)) return "-";
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

function StatCard({ label, value, sub }) {
  return (
    <div className="adm-stat">
      <div className="adm-stat-label">{label}</div>
      <div className="adm-stat-value">{value}</div>
      <div className="adm-stat-sub">{sub}</div>
    </div>
  );
}

function Dashboard({ onMeta }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [jurnalAntre, setJurnalAntre] = useState(0);
  const [periode, setPeriode] = useState(null);
  const [actions, setActions] = useState([]);
  const [dist, setDist] = useState(null);
  const [distTotal, setDistTotal] = useState(240);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [sumRes, recRes, jurRes, perRes, appRes, plcRes, compRes] = await Promise.all([
          dashboardApi.adminSummary().catch(() => null),
          dashboardApi.adminRecentApplications().catch(() => null),
          journalsApi.index().catch(() => null),
          periodsApi.index().catch(() => null),
          applicationsApi.index().catch(() => null),
          placementsApi.index().catch(() => null),
          companiesApi.index().catch(() => null),
        ]);
        if (!alive) return;

        const sum = sumRes?.data || {};
        const arr = (r) => (Array.isArray(r) ? r : r?.data?.data || r?.data || []);
        const journals = arr(jurRes);
        const periods = arr(perRes);
        const apps = arr(appRes);
        const placements = arr(plcRes);
        const companies = arr(compRes);

        const menunggu = journals.filter((j) => ["submitted", "pending", "menunggu"].includes(j.status)).length;

        // Periode aktif
        const aktif = periods.find((p) => p.status === "active" || p.status === "AKTIF") || periods[0] || null;

        // Perlu tindakan
        const penempatanPending = placements.filter((p) => ["pending", "menunggu", "submitted"].includes(p.status)).length;
        const now = Date.now();
        const seleksiLama = apps.filter((a) => {
          if (!["reviewed", "interview"].includes(a.status)) return false;
          const t = new Date(a.updated_at || a.created_at || 0).getTime();
          return now - t > 7 * 24 * 3600 * 1000;
        }).length;
        const kuotaPenuh = companies.filter((c) => {
          const q = Number(c.quota) || 0;
          if (!q) return false;
          const terisi = placements.filter((p) => String(p.company_id) === String(c.id)).length;
          return terisi >= q * 0.8;
        });

        const acts = [];
        if (penempatanPending > 0) acts.push({
          icon: "fa-triangle-exclamation", tone: "yellow",
          title: `${penempatanPending} penempatan menunggu persetujuan`,
          desc: "Siswa sudah diterima perusahaan",
          btn: "Tinjau", primary: true, to: "/admin/persetujuan",
        });
        if (seleksiLama > 0) acts.push({
          icon: "fa-clock", tone: "blue",
          title: `${seleksiLama} pengajuan seleksi > 7 hari`,
          desc: "Belum ada keputusan perusahaan",
          btn: "Lihat", primary: false, to: "/admin/persetujuan",
        });
        if (kuotaPenuh.length > 0) acts.push({
          icon: "fa-file-lines", tone: "green",
          title: `${kuotaPenuh.length} perusahaan kuota hampir penuh`,
          desc: kuotaPenuh.slice(0, 2).map((c) => {
            const terisi = placements.filter((p) => String(p.company_id) === String(c.id)).length;
            return `${c.name || c.nama} (${terisi}/${c.quota})`;
          }).join(" • "),
          btn: "Lihat", primary: false, to: "/admin/perusahaan",
        });

        // Distribusi status pengajuan
        const count = (pred) => apps.filter(pred).length;
        const diterima = count((a) => ["accepted", "diterima"].includes(a.status));
        const seleksi = count((a) => ["reviewed", "interview"].includes(a.status));
        const baru = count((a) => ["submitted", "diajukan"].includes(a.status));
        const ditolak = count((a) => ["rejected", "ditolak"].includes(a.status));
        const total = apps.length;

        // Fallback mockup jika data kosong
        const s = {
          siswa: sum.total_siswa || 180,
          guru: sum.total_guru || 12,
          perusahaan: sum.total_perusahaan || companies.length || 12,
          pengajuan: sum.pengajuan_aktif || total || 240,
          penempatan: sum.siswa_ditempatkan || placements.length || 150,
        };

        const recRows = (recRes?.data || []).map((r) => ({
          ...r,
          tanggal: fmtDate(r.created_at),
        }));

        setStats({ ...s, jurnalAntre: menunggu || 23 });
        setRecent(recRows.length ? recRows : [
          { id: 1, siswa: "Rizky Maulana", kelas: "XI RPL 2", perusahaan: "PT Solusi Digital Nusantara", status: "submitted", tanggal: "17 Jun" },
          { id: 2, siswa: "Sinta Dewi", kelas: "XI RPL 1", perusahaan: "CV Pixel Kreatif", status: "reviewed", tanggal: "17 Jun" },
          { id: 3, siswa: "Yoga Firmansyah", kelas: "XI RPL 3", perusahaan: "PT Cipta Aplikasi Bangsa", status: "accepted", tanggal: "16 Jun" },
          { id: 4, siswa: "Nadia Putri", kelas: "XI RPL 2", perusahaan: "PT Nusa Data Indonesia", status: "rejected", tanggal: "15 Jun" },
        ]);
        setJurnalAntre(menunggu || 23);
        setPeriode(aktif);
        setActions(acts);
        setDist(total ? [
          { label: "Diterima perusahaan", n: diterima, color: "#22c55e" },
          { label: "Dalam seleksi / interview", n: seleksi, color: "#f59e0b" },
          { label: "Baru diajukan", n: baru, color: "#3b82f6" },
          { label: "Ditolak", n: ditolak, color: "#cbd5e1" },
        ] : [
          { label: "Diterima perusahaan", n: 96, color: "#22c55e" },
          { label: "Dalam seleksi / interview", n: 58, color: "#f59e0b" },
          { label: "Baru diajukan", n: 44, color: "#3b82f6" },
          { label: "Ditolak", n: 42, color: "#cbd5e1" },
        ]);
        setDistTotal(total || 240);

        onMeta?.({
          subtitle: aktif
            ? `SMK Negeri 1 Yogyakarta • Periode ${aktif.name || aktif.nama || "PKL"}`
            : "SMK Negeri 1 Yogyakarta • Periode PKL",
        });
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [onMeta, navigate]);

  if (loading) {
    return (
      <div className="zip-page">
        <p className="zip-muted">Memuat dashboard…</p>
      </div>
    );
  }

  const pctPeriode = (() => {
    if (!periode?.start_date || !periode?.end_date) return 45;
    const s = new Date(periode.start_date).getTime();
    const e = new Date(periode.end_date).getTime();
    const n = Date.now();
    if (e <= s) return 0;
    return Math.max(0, Math.min(100, Math.round(((n - s) / (e - s)) * 100)));
  })();

  return (
    <div className="adm-dash">
      {/* 6 kartu stat */}
      <div className="adm-stats">
        <StatCard label="SISWA" value={stats.siswa} sub="6 kelas XI" />
        <StatCard label="GURU" value={stats.guru} sub="Pembimbing" />
        <StatCard label="PERUSAHAAN" value={stats.perusahaan} sub="Mitra aktif" />
        <StatCard label="PENGAJUAN" value={stats.pengajuan} sub="Periode ini" />
        <StatCard label="PENEMPATAN" value={stats.penempatan} sub="Resmi disetujui" />
        <StatCard label="JURNAL ANTRE" value={jurnalAntre} sub="Verifikasi industri" />
      </div>

      {/* Perlu tindakan + Periode aktif */}
      <div className="adm-grid2">
        <div className="adm-card">
          <div className="adm-card-head">
            <h3>Perlu Tindakan</h3>
            {actions.length > 0 && <span className="adm-badge yellow"><i className="fa-solid fa-circle"></i> {actions.length} item</span>}
          </div>
          {actions.length === 0 ? (
            <p className="zip-muted" style={{ padding: "8px 0" }}>Tidak ada yang perlu tindakan. Semua beres!</p>
          ) : actions.map((a, i) => (
            <div className="adm-action" key={i}>
              <span className={`adm-action-ic ${a.tone}`}><i className={`fa-solid ${a.icon}`}></i></span>
              <span className="adm-action-tx">
                <strong>{a.title}</strong>
                <small>{a.desc}</small>
              </span>
              <button
                type="button"
                className={a.primary ? "zip-btn-primary" : "zip-btn-outline"}
                onClick={() => navigate(a.to)}
              >
                {a.btn}
              </button>
            </div>
          ))}
        </div>

        <div className="adm-card">
          <div className="adm-card-head">
            <h3>Periode Aktif</h3>
            <span className="adm-badge green"><i className="fa-solid fa-circle"></i> AKTIF</span>
          </div>
          <div className="adm-periode-name">{periode?.name || periode?.nama || "PKL 2026"}</div>
          <div className="adm-kv"><span>Mulai</span><strong>{fmtDate(periode?.start_date) !== "-" ? fmtDate(periode?.start_date) : "1 Agu 2026"}</strong></div>
          <div className="adm-kv"><span>Selesai</span><strong>{fmtDate(periode?.end_date) !== "-" ? fmtDate(periode?.end_date) : "31 Okt 2026"}</strong></div>
          <div className="adm-kv"><span>Progres periode</span><strong>{pctPeriode}%</strong></div>
          <div className="adm-progress"><div className="adm-progress-fill" style={{ width: `${pctPeriode}%` }}></div></div>
        </div>
      </div>

      {/* Pengajuan terbaru + Distribusi */}
      <div className="adm-grid2b">
        <div className="adm-card">
          <div className="adm-card-head">
            <div>
              <h3>Pengajuan Terbaru</h3>
              <small className="zip-muted">Aktivitas 7 hari terakhir</small>
            </div>
            <button type="button" className="adm-link" onClick={() => navigate("/admin/persetujuan")}>
              Semua pengajuan <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr><th>SISWA</th><th>PERUSAHAAN TUJUAN</th><th>STATUS</th><th className="right">TANGGAL</th></tr>
              </thead>
              <tbody>
                {recent.map((r) => {
                  const b = badgeOf(r.status);
                  return (
                    <tr key={r.id}>
                      <td><strong>{r.siswa}</strong><small className="adm-td-sub">{r.kelas}</small></td>
                      <td>{r.perusahaan}</td>
                      <td><span className={`adm-pill ${b.cls}`}><i className="fa-solid fa-circle"></i> {b.label}</span></td>
                      <td className="right zip-muted">{r.tanggal}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="adm-card">
          <div className="adm-card-head">
            <h3>Distribusi Status Pengajuan</h3>
            <span className="zip-muted">{distTotal} total</span>
          </div>
          {dist.map((d, i) => {
            const pct = distTotal ? Math.round((d.n / distTotal) * 100) : 0;
            return (
              <div className="adm-dist" key={i}>
                <div className="adm-dist-row"><span>{d.label}</span><strong>{d.n}</strong></div>
                <div className="adm-bar"><div className="adm-bar-fill" style={{ width: `${pct}%`, background: d.color }}></div></div>
              </div>
            );
          })}
          <p className="zip-muted" style={{ fontSize: 12.5, marginTop: 14 }}>
            Penempatan resmi ({stats.penempatan}) diterbitkan setelah persetujuan sekolah.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
