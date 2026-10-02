function DataGuru(){
  const rows=[
    {init:"H", name:"Hartono", info:"RPL • 20 siswa", status:"Pembimbing Aktif", cls:"pill-green"},
    {init:"S", name:"Sari Wulandari", info:"TKJ • 18 siswa", status:"Pembimbing Aktif", cls:"pill-green"},
    {init:"B", name:"Budi Santoso", info:"MM • 0 siswa", status:"Belum Ditugaskan", cls:"pill-yellow"},
    {init:"A", name:"Ani Lestari", info:"AKL • 15 siswa", status:"Pembimbing Aktif", cls:"pill-green"},
  ];
  return (
    <div className="admin-page">
      <div className="page-head">
        <div>
          <div className="page-kicker">Admin 05 — Data Guru</div>
          <div className="page-title">Data Guru & Pembimbing</div>
          <div className="page-sub">64 guru • 42 pembimbing sekolah • 38 industri</div>
        </div>
      </div>
      <div className="grid-3">
        <div className="card"><div className="stat-label">42 Pembimbing Sekolah</div><div className="muted">Rasio 1: 20 siswa</div></div>
        <div className="card"><div className="stat-label">38 Pembimbing Industri</div><div className="muted">Terkonfirmasi</div></div>
        <div className="card"><div className="stat-label">12 Guru Belum Tugas</div><div className="muted" style={{color:"#D97706",fontWeight:700}}>Perlu penetapan</div></div>
      </div>
      <div className="grid-2" style={{marginTop:14}}>
        <div className="card">
          <div className="section-title">Daftar Guru — Tetapkan Pembimbing</div>
          {rows.map((r,i)=>(
            <div className="list-row" key={i}>
              <span style={{display:"flex",gap:10,alignItems:"center"}}><span className="avatar">{r.init}</span><span><b>{r.name}</b><div className="muted">{r.info}</div></span></span>
              <span className={`pill ${r.cls}`}>{r.status}</span>
            </div>
          ))}
        </div>
        <div className="card" style={{background:"#1E3A8A",color:"#fff",borderColor:"#1E3A8A"}}>
          <div className="section-title" style={{color:"#fff"}}>Pemetaan Pembimbing ↔ Industri</div>
          <div style={{display:"grid",gap:8}}>
            <div className="card" style={{padding:12}}><b>Hartono → PT Maju Jaya (12)</b></div>
            <div className="card" style={{padding:12}}><b>Sari → Telkom Akses (18)</b></div>
            <div className="card" style={{padding:12}}><b>Budi → CV Kreatif (11)</b></div>
            <div className="card" style={{padding:12}}><b>Ani → Bank Daerah (15)</b></div>
          </div>
          <p className="muted" style={{color:"#DBEAFE",marginTop:10}}>Form: pilih guru • perusahaan • kuota • Tetapkan. Validasi rasio maks 1:20.</p>
          <button className="btn" style={{background:"#38BDF8",color:"#082F49",width:"100%",marginTop:8}}>Tetapkan Pembimbing</button>
        </div>
      </div>
    </div>
  );
}
export default DataGuru;
