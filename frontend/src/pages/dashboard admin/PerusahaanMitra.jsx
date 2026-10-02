import StatusBadge from "../../components/admin/StatusBadge.jsx";
import ProgressBar from "../../components/admin/ProgressBar.jsx";

function PerusahaanMitra() {
  const cards = [
    { init: "P", name: "PT Maju Jaya • Manufaktur", bidang: "RPL • TKJ", kuota: "Kuota 20 • Terisi 18", pct: 90, syarat: "Syarat: Min. nilai 80 • CV", status: "Aktif", variant: "success" },
    { init: "T", name: "Telkom Akses • Telekomunikasi", bidang: "TKJ • RPL", kuota: "Kuota 30 • Terisi 30", pct: 100, syarat: "Syarat: Tes + Interview", status: "Penuh", variant: "danger" },
    { init: "C", name: "CV Kreatif Digital • Desain", bidang: "MM • RPL", kuota: "Kuota 12 • Terisi 5", pct: 42, syarat: "Syarat: Portofolio", status: "Aktif", variant: "success" },
  ];
  return (
    <div className="admin-page">
      <div className="grid-3g10">
        <div className="card mini-kpi"><b>Total Kuota 1.480</b><span>Terisi 1.102 (74%)</span></div>
        <div className="card mini-kpi"><b>Perlu Verifikasi 9</b><span>Dokumen MoU</span></div>
        <div className="card mini-kpi"><b>Bidang Terbanyak RPL</b><span>42 perusahaan</span></div>
      </div>

      <div className="grid-3">
        {cards.map((c) => (
          <div className="card" key={c.name} style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span className="avatar-pen" style={{ background: "#1E3A8A", borderRadius: 8, padding: "10px 12px", fontSize: 14 }}>{c.init}</span>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{c.name}</span>
            </div>
            <div>
              <span className="pill pill-primary pill-sm">{c.bidang}</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 600 }}>{c.kuota}</div>
            <ProgressBar percent={c.pct} variant="accent" height={8} />
            <div style={{ fontSize: 11, color: "#64748B" }}>{c.syarat}</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <StatusBadge status={c.status} variant={c.variant} small />
              <span className="action-text">Detail&nbsp;&nbsp;•&nbsp;&nbsp;Edit Kuota</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default PerusahaanMitra;
