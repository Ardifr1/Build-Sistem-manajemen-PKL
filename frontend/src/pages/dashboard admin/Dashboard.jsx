function Dashboard(){
  const recent=[
    {name:"Rina • PT Maju Jaya", status:"Menunggu", cls:"pill-yellow"},
    {name:"Bagas • Telkom Akses", status:"Diproses", cls:"pill-blue"},
    {name:"Sinta • Diterima 2 perusahaan", status:"Diterima", cls:"pill-green"},
    {name:"Dimas • Ditolak industri", status:"Ditolak", cls:"pill-red"},
  ];
  return (
    <div className="admin-page">
      <div className="page-head">
        <div>
          <div className="page-kicker">Admin 02 — Dashboard</div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Ringkasan seluruh proses PKL • Semester Ganjil 2026</div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <span className="badge-top">3 • Perlu tindakan admin</span>
          <span className="avatar">AG</span>
        </div>
      </div>

      <div className="grid-4">
        <div className="card"><div className="stat-label">Total Siswa</div><div className="stat-value">1.240</div><div className="stat-hint">+2 semester ini</div></div>
        <div className="card"><div className="stat-label">Guru Pembimbing</div><div className="stat-value">84</div><div className="muted">Rasio 1:15</div></div>
        <div className="card"><div className="stat-label">Perusahaan Mitra</div><div className="stat-value">126</div><div className="stat-hint">12 kuota penuh</div></div>
        <div className="card"><div className="stat-label">Pengajuan Aktif</div><div className="stat-value">486</div><div className="muted" style={{color:"#D97706",fontWeight:700}}>68 menunggu</div></div>
      </div>

      <div className="grid-2" style={{marginTop:14}}>
        <div className="card">
          <div className="section-title">Pengajuan Terbaru — Perlu Tindakan</div>
          {recent.map((r,i)=>(
            <div className="list-row" key={i}>
              <span style={{fontWeight:600}}>{r.name}</span>
              <span className={`pill ${r.cls}`}>{r.status}</span>
            </div>
          ))}
          <p className="muted" style={{marginTop:10}}>Klik baris untuk membuka detail pengajuan (frontend statis).</p>
        </div>
        <div className="card" style={{background:"#1E3A8A",color:"#fff",borderColor:"#1E3A8A"}}>
          <div className="section-title" style={{color:"#fff"}}>Alur PKL — Progress Sekolah</div>
          <div className="muted" style={{color:"#DBEAFE"}}>Pengajuan → Penempatan → Jurnal → Nilai</div>
          <div style={{marginTop:14,display:"grid",gap:12}}>
            <div><div style={{display:"flex",justifyContent:"space-between",fontSize:13}}><span>Pengajuan selesai</span><b>78%</b></div><div className="progress" style={{marginTop:6,background:"rgba(255,255,255,.25)"}}><span style={{width:"78%",background:"#fff"}}/></div></div>
            <div><div style={{display:"flex",justifyContent:"space-between",fontSize:13}}><span>Penempatan disetujui</span><b>65%</b></div><div className="progress" style={{marginTop:6,background:"rgba(255,255,255,.25)"}}><span style={{width:"65%",background:"#93C5FD"}}/></div></div>
            <div><div style={{display:"flex",justifyContent:"space-between",fontSize:13}}><span>Jurnal terverifikasi</span><b>52%</b></div><div className="progress" style={{marginTop:6,background:"rgba(255,255,255,.25)"}}><span style={{width:"52%",background:"#FDE68A"}}/></div></div>
          </div>
          <p style={{fontSize:12.5,opacity:.9,marginTop:12}}>Batas maks 3 perusahaan / siswa. Role otomatis sistem.</p>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
