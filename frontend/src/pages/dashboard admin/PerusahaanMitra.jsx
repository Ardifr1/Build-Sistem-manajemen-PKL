function PerusahaanMitra(){
  const cards=[
    {init:"P", name:"PT Maju Jaya • Manufaktur", kuota:"Kuota 20 • Terisi 18", pct:90, syarat:"Syarat: Min. nilai 80 • CV", status:"Aktif"},
    {init:"T", name:"Telkom Akses • Telekomunikasi", kuota:"Kuota 30 • Terisi 30", pct:100, syarat:"Syarat: Tes • Interview", status:"Penuh"},
    {init:"C", name:"CV Kreatif Digital • Desain", kuota:"Kuota 12 • Terisi 5", pct:42, syarat:"Syarat: Portofolio", status:"Aktif"},
  ];
  return (
    <div className="admin-page">
      <div className="page-head">
        <div>
          <div className="page-kicker">Admin 06 — Perusahaan Mitra</div>
          <div className="page-title">Perusahaan Mitra & Kuota</div>
          <div className="page-sub">126 mitra • 38 kuota penuh • Bidang & syarat</div>
        </div>
      </div>
      <div className="grid-3">
        <div className="card"><div className="stat-label">Total Kuota 1.480</div><div className="muted">Terisi 1.102 (74%)</div></div>
        <div className="card"><div className="stat-label">Perlu Verifikasi 9</div><div className="muted">Dokumen MoU</div></div>
        <div className="card"><div className="stat-label">Bidang Terbanyak RPL</div><div className="muted">42 perusahaan</div></div>
      </div>
      <div className="grid-3" style={{marginTop:14}}>
        {cards.map((c,i)=>(
          <div className="card" key={i}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}><span className="avatar">{c.init}</span><b>{c.name}</b></div>
            <div className="muted" style={{marginTop:10}}>{c.kuota}</div>
            <div className="progress blue" style={{marginTop:8}}><span style={{width:`${c.pct}%`}}/></div>
            <div className="muted" style={{marginTop:8}}>{c.syarat}</div>
            <div style={{marginTop:10,display:"flex",gap:8}}><span className={`pill ${c.status==="Penuh"?"pill-red":"pill-green"}`}>{c.status}</span><button className="btn btn-light">Detail</button><button className="btn btn-ghost">Edit Kuota</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default PerusahaanMitra;
