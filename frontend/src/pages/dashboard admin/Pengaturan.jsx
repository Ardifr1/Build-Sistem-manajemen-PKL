function Pengaturan(){
  return (
    <div className="admin-page">
      <div className="page-head">
        <div>
          <div className="page-kicker">Admin 10 — Pengaturan</div>
          <div className="page-title">Pengaturan Data Sistem</div>
          <div className="page-sub">Master data • Teknologi • Notifikasi</div>
        </div>
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="section-title">Data Master Sekolah</div>
          <div style={{display:"grid",gap:12}}>
            <div><label className="f-label">Nama Sekolah</label><input className="input" defaultValue="SMKN 1 Jakarta"/></div>
            <div><label className="f-label">Tahun Ajaran Aktif</label><select className="select"><option>2026 Ganjil</option><option>2026 Genap</option></select></div>
            <div><label className="f-label">Batas Pilihan Perusahaan</label><input className="input" defaultValue="Maks 3 perusahaan / siswa"/></div>
            <div><label className="f-label">Bobot Nilai</label><input className="input" defaultValue="Industri 60% • Guru 40% • Jurnal 20%"/></div>
          </div>
          <button className="btn btn-primary" style={{width:"100%",marginTop:14}}>Simpan Pengaturan</button>
        </div>
        <div className="card" style={{background:"#1E3A8A",color:"#fff",borderColor:"#1E3A8A"}}>
          <div className="section-title" style={{color:"#fff"}}>Teknologi & Aturan PRD</div>
          <div style={{display:"grid",gap:8}}>
            <div className="card" style={{padding:12}}><b>Frontend: React</b><div className="muted">Mockup ini siap diadaptasi</div></div>
            <div className="card" style={{padding:12}}><b>Backend: Laravel + Sanctum</b><div className="muted">Role otomatis dari API</div></div>
            <div className="card" style={{padding:12}}><b>Database: MySQL</b><div className="muted">Users, perusahaan, jurnal</div></div>
            <div className="card" style={{padding:12}}><b>AI: Filter</b><div className="muted">Hanya bantu revisi jurnal</div></div>
            <div className="card" style={{padding:12}}><b>Storage: Local</b><div className="muted">CV & portofolio siswa</div></div>
          </div>
          <p className="muted" style={{color:"#DBEAFE",marginTop:10}}>Status PRD: Menunggu / Diproses / Diterima / Ditolak • Draft / Menunggu Verifikasi / Disetujui / Perlu Perbaikan.</p>
        </div>
      </div>
    </div>
  );
}
export default Pengaturan;
