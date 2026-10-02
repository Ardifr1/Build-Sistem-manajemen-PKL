import StatusBadge from "../../components/admin/StatusBadge.jsx";

function DataGuru() {
  const rows = [
    { init: "H", name: "Hartono • RPL • 20 siswa", status: "Pembimbing Aktif", variant: "success" },
    { init: "S", name: "Sari Wulandari • TKJ • 18 siswa", status: "Pembimbing Aktif", variant: "success" },
    { init: "B", name: "Budi Santoso • MM • 0 siswa", status: "Belum Ditugaskan", variant: "warning" },
    { init: "A", name: "Ani Lestari • AKL • 15 siswa", status: "Pembimbing Aktif", variant: "primary" },
  ];
  const mapping = [
    "Hartono → PT Maju Jaya (12)",
    "Sari → Telkom Akses (18)",
    "Budi → CV Kreatif (8)",
    "Ani → Bank Daerah (15)",
  ];
  return (
    <div className="admin-page">
      <div className="grid-3g10">
        <div className="card mini-kpi"><b>42 Pembimbing Sekolah</b><span>Rasio 1 : 20 siswa</span></div>
        <div className="card mini-kpi"><b>38 Pembimbing Industri</b><span>Terferifikasi</span></div>
        <div className="card mini-kpi"><b>12 Guru Belum Tugas</b><span>Perlu penetapan</span></div>
      </div>

      <div className="grid-2guru">
        <div className="card" style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          <div className="section-title" style={{ marginBottom: 2 }}>Daftar Guru — Tetapkan Pembimbing</div>
          {rows.map((r) => (
            <div className="row-box" key={r.name}>
              <span className="avatar-pen" style={{ background: "#1E3A8A", padding: "8px 10px", fontSize: 12 }}>{r.init}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", flex: 1 }}>{r.name}</span>
              <StatusBadge status={r.status} variant={r.variant} small />
            </div>
          ))}
        </div>

        <div className="dark-card" style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Pemetaan Pembimbing ↔ Industri</div>
          {mapping.map((m) => (
            <div className="white-box" key={m}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#0F172A" }}>{m}</span>
            </div>
          ))}
          <p style={{ fontSize: 11, color: "#93C5FD", margin: 0 }}>
            Form: pilih guru ▾ + perusahaan ▾ + kuota → Tetapkan. Validasi rasio maks 1:20.
          </p>
          <button type="button" className="btn btn-sky">Tetapkan Pembimbing</button>
        </div>
      </div>
    </div>
  );
}
export default DataGuru;
