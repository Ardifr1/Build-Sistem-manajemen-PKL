function Monitoring(){
  const stats=[
    {label:"Pengajuan", value:"486", pct:78},
    {label:"Absensi", value:"312", pct:64},
    {label:"Penempatan", value:"812", pct:85},
    {label:"Jurnal Wajib", value:"2.140", pct:52},
    {label:"Jurnal Harian", value:"640", pct:87},
  ];
  const rows=[
    {name:"Rina", stage:"Disetujui Sekolah", progress:"Absen 96% • Jurnal 12/12", action:"Lihat"},
    {name:"Bagas", stage:"Menunggu Penempatan", progress:"Absen 88% • Jurnal 8/12", action:"Ingatkan"},
    {name:"Sinta", stage:"Perlu Perbaikan (2)", progress:"Revisi AI dipakai", action:"Lihat"},
    {name:"Dimas", stage:"Interview 24 Sep", progress:"Tes lolos", action:"Kirim"},
  ];
  return (
    <div className="admin-page">
      <div className="page-head">
        <div>
          <div className="page-kicker">Admin 09 — Monitoring</div>
          <div className="page-title">Monitoring Proses PKL</div>
          <div className="page-sub">Pengajuan → Penempatan → Jurnal → Nilai</div>
        </div>
      </div>
      <div className="grid-4" style={{gridTemplateColumns:"repeat(5,1fr)"}}>
        {stats.map((s,i)=>(<div className="card" key={i}><div className="stat-label">{s.label}</div><div className="stat-value" style={{fontSize:22}}>{s.value}</div><div className="muted">{s.pct}% selesai</div><div className="progress blue" style={{marginTop:6}}><span style={{width:`${s.pct}%`}}/></div></div>))}
      </div>
      <div className="grid-2" style={{marginTop:14}}>
        <div className="card">
          <div style={{overflowX:"auto"}}>
            <table className="table">
              <thead><tr><th>Siswa — Tahap Saat Ini</th><th>Progres</th><th>Aksi</th></tr></thead>
              <tbody>{rows.map((r,i)=>(<tr key={i}><td><b>{r.name}</b><div className="muted">{r.stage}</div></td><td>{r.progress}</td><td><button className="btn btn-light">{r.action}</button></td></tr>))}</tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="section-title">Notifikasi & Peringatan • 3 belum dibaca</div>
          <div style={{display:"grid",gap:10}}>
            <div className="card" style={{background:"#FEF3C7",borderColor:"#FDE68A",padding:12}}><b>Pengajuan PKL baru • Rina → PT Maju Jaya</b><div className="muted">Perlu disposisi admin • sudah menunggu 3 hari</div></div>
            <div className="card" style={{background:"#FEE2E2",borderColor:"#FECACA",padding:12}}><b>Status penempatan berubah • Sinta pilih final</b><div className="muted">Menunggu persetujuan • 2 perusahaan diterima</div></div>
            <div className="card" style={{background:"#DBEAFE",borderColor:"#BFDBFE",padding:12}}><b>2 Jurnal perlu tindakan guru</b><div className="muted">Sinta & Akmal • verifikasi maju • 24 jam</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Monitoring;
