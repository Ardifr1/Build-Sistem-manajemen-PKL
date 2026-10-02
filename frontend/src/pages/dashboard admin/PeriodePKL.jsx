import StatusBadge from "../../components/admin/StatusBadge.jsx";

function PeriodePKL() {
  const cards = [
    { title: "Ganjil 2026", date: "1 Jul — 31 Des 2026 • 1.240 siswa • 126 mitra", status: "Aktif", variant: "success", action: "Kelola" },
    { title: "Genap 2026", date: "1 Jan — 30 Jun 2026 • 1.180 siswa • 110 mitra", status: "Selesai", variant: "gray", action: "Arsip" },
    { title: "Ganjil 2025", date: "1 Jul — 31 Des 2025 • 1.150 siswa", status: "Selesai", variant: "gray", action: "Arsip" },
  ];
  return (
    <div className="admin-page">
      <div className="toolbar">
        <span className="search-box">🔍&nbsp; Cari periode / tahun ajaran...</span>
        <button type="button" className="btn btn-primary">+ Periode Baru</button>
      </div>

      <div className="grid-3">
        {cards.map((c) => (
          <div className="card" key={c.title} style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 15, fontWeight: 800 }}>{c.title}</div>
            <div style={{ fontSize: 11, color: "#64748B" }}>{c.date}</div>
            <div style={{ background: "#F1F5F9", borderRadius: 8, padding: 10, display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 10, color: "#64748B" }}>Tahapan: Pendaftaran → Seleksi → Penempatan → Jurnal → Nilai</span>
              <span style={{ fontSize: 10, fontWeight: 600 }}>Seleksi berjalan • Batas 3 perusahaan • Verifikasi guru wajib</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto" }}>
              <StatusBadge status={c.status} variant={c.variant} small />
              <span style={{ flex: 1 }} />
              <span className="action-text" style={{ fontWeight: 700 }}>{c.action}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default PeriodePKL;
