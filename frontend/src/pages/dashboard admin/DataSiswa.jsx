function DataSiswa(){
  const rows=[
    {nis:"23101", name:"Rina Amelia", kelas:"XII RPL1", perusahaan:"PT Maju Jaya", pembimbing:"Bu Sari / Pk. Andi", status:"Disetujui Sekolah", cls:"pill-green"},
    {nis:"23102", name:"Bagas Pratama", kelas:"XII TKJ2", perusahaan:"Telkom Akses", pembimbing:"Pk. Budi / Bu Rani", status:"Menunggu Penempatan", cls:"pill-yellow"},
    {nis:"23103", name:"Sinta Dewi", kelas:"XII RPL2", perusahaan:"— Belum ada —", pembimbing:"Bu Sari / —", status:"Menunggu Persetujuan", cls:"pill-blue"},
    {nis:"23104", name:"Dimas", kelas:"XII MM1", perusahaan:"CV Kreatif", pembimbing:"Bu Ani / Pk. Joko", status:"Diproses", cls:"pill-blue"},
  ];
  return (
    <div className="admin-page">
      <div className="page-head">
        <div>
          <div className="page-kicker">Admin 04 — Data Siswa</div>
          <div className="page-title">Data Siswa</div>
          <div className="page-sub">Kelas XII • 1.240 siswa • 64 guru</div>
        </div>
      </div>
      <div className="grid-3">
        <div className="card"><div className="stat-label">XII RPL 1 — 36 siswa</div><div className="muted">Wali: Bu Sari</div></div>
        <div className="card"><div className="stat-label">XII TKJ 2 — 34 siswa</div><div className="muted">Wali: Pk. Budi</div></div>
        <div className="card"><div className="stat-label">Sudah ditempatkan — 812</div><div className="stat-value" style={{fontSize:22}}>65%</div><div className="progress blue" style={{marginTop:6}}><span style={{width:"65%"}}/></div></div>
      </div>
      <div className="card" style={{marginTop:14}}>
        <div style={{overflowX:"auto"}}>
          <table className="table">
            <thead><tr><th>NIS — Nama — Kelas</th><th>Perusahaan</th><th>Pembimbing</th><th>Status</th></tr></thead>
            <tbody>{rows.map((r,i)=>(<tr key={i}><td><b>{r.nis} • {r.name} • {r.kelas}</b></td><td>{r.perusahaan}</td><td>{r.pembimbing}</td><td><span className={`pill ${r.cls}`}>{r.status}</span></td></tr>))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default DataSiswa;
