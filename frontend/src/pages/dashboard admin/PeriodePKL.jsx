function PeriodePKL(){
  const cards=[
    {title:"Ganjil 2026", date:"1 Jul — 31 Des 2026 • 1.240 siswa • 126 mitra", desc:"Tahapan: Pendaftaran • Seleksi • Penempatan • Jurnal • Nilai. Seleksi berjalan • Batas 3 perusahaan • Verifikasi guru wajib", status:"Aktif", cls:"pill-green"},
    {title:"Genap 2026", date:"1 Jan — 30 Jun 2026 • 1.180 siswa • 110 mitra", desc:"Tahapan: Pendaftaran • Seleksi • Penempatan • Jurnal • Nilai. Seleksi berjalan • Batas 3 perusahaan • Verifikasi guru wajib", status:"Selesai", cls:"pill-gray"},
    {title:"Ganjil 2025", date:"1 Jul — 31 Des 2025 • 1.150 siswa", desc:"Tahapan: Pendaftaran • Seleksi • Penempatan • Jurnal • Nilai. Seleksi berjalan • Batas 3 perusahaan • Verifikasi guru wajib", status:"Arsip", cls:"pill-gray"},
  ];
  return (
    <div className="admin-page">
      <div className="page-head">
        <div>
          <div className="page-kicker">Admin 07 — Periode PKL</div>
          <div className="page-title">Periode PKL</div>
          <div className="page-sub">Tahun 2026 • Ganjil Aktif</div>
        </div>
        <button className="btn btn-primary">+ Periode Baru</button>
      </div>
      <div className="toolbar" style={{marginBottom:12}}><input className="input" placeholder="Cari periode / tahun ajaran..." /></div>
      <div className="grid-3">
        {cards.map((c,i)=>(
          <div className="card" key={i}>
            <b style={{fontSize:16}}>{c.title}</b>
            <div className="muted" style={{marginTop:6}}>{c.date}</div>
            <p className="muted" style={{marginTop:8}}>{c.desc}</p>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:10}}><span className={`pill ${c.cls}`}>{c.status}</span><button className="btn btn-light">Kelola</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default PeriodePKL;
