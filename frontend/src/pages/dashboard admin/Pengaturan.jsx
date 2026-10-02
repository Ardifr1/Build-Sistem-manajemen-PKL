function Pengaturan() {
  const fields = [
    { label: "Nama Sekolah", value: "SMKN 1 Jakarta" },
    { label: "Tahun Ajaran Aktif", value: "2026 Ganjil" },
    { label: "Batas Pilihan Perusahaan", value: "Maks 3 perusahaan / siswa" },
    { label: "Bobot Nilai", value: "Industri 40% + Guru 40% + Jurnal 20%" },
  ];
  const tech = [
    { title: "Frontend: React", desc: "Mockup ini siap diadaptasi" },
    { title: "Backend: Laravel + Sanctum", desc: "Role otomatis dari API" },
    { title: "Database: MySQL", desc: "users, pengajuan, jurnal" },
    { title: "AI: 9Router", desc: "Hanya bantu revisi jurnal" },
    { title: "Storage: Local", desc: "CV & portofolio siswa" },
  ];
  return (
    <div className="admin-page">
      <div className="grid-cols">
        <div className="card" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Data Master Sekolah</div>
          {fields.map((f) => (
            <div key={f.label}>
              <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 6 }}>{f.label}</div>
              <input className="input input-readonly" value={f.value} readOnly />
            </div>
          ))}
          <button type="button" className="btn btn-primary" style={{ width: "100%", padding: 12, marginTop: 4 }}>
            Simpan Pengaturan
          </button>
        </div>

        <div className="dark-card" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Teknologi &amp; Aturan PRD</div>
          {tech.map((t) => (
            <div className="white-box" key={t.title} style={{ display: "flex", flexDirection: "column", gap: 2, padding: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700 }}>{t.title}</span>
              <span style={{ fontSize: 10, color: "#64748B" }}>{t.desc}</span>
            </div>
          ))}
          <p style={{ fontSize: 11, color: "#93C5FD", margin: 0 }}>
            Status PRD: Menunggu / Diproses / Diterima / Ditolak • Draft / Menunggu Verifikasi / Disetujui / Perlu Perbaikan.
          </p>
        </div>
      </div>
    </div>
  );
}
export default Pengaturan;
