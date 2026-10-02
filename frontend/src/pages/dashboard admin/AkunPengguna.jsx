function AkunPengguna(){
  const rows=[
    {name:"Rina Amelia", email:"rina@smkn1.sch.id", role:"Siswa", status:"Aktif", cls:"pill-green"},
    {name:"Bpk. Hartono", email:"hartono@smkn1.sch.id", role:"Guru", status:"Aktif", cls:"pill-green"},
    {name:"PT Maju Jaya", email:"hrd@majujaya.id", role:"Perusahaan", status:"Menunggu", cls:"pill-yellow"},
    {name:"Admin TU", email:"tu@smkn1.sch.id", role:"Admin", status:"Aktif", cls:"pill-green"},
    {name:"Dimas", email:"dimas@smkn1.sch.id", role:"Siswa", status:"Nonaktif", cls:"pill-red"},
  ];
  return (
    <div className="admin-page">
      <div className="page-head">
        <div>
          <div className="page-kicker">Admin 03 — Akun Pengguna</div>
          <div className="page-title">Manajemen Akun Pengguna</div>
          <div className="page-sub">1.400 akun • Role otomatis sistem</div>
        </div>
        <button className="btn btn-primary">+ Tambah Akun</button>
      </div>
      <div className="card">
        <div className="toolbar" style={{marginBottom:12}}>
          <input className="input" style={{flex:1,minWidth:220}} placeholder="Cari nama / email / NIS..." />
          <select className="select" style={{maxWidth:160}}><option>Semua Role</option><option>Siswa</option><option>Guru</option><option>Perusahaan</option><option>Admin</option></select>
          <select className="select" style={{maxWidth:140}}><option>Aktif</option><option>Menunggu</option><option>Nonaktif</option></select>
        </div>
        <div style={{overflowX:"auto"}}>
          <table className="table">
            <thead><tr><th>Nama / Email</th><th>Role</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
              {rows.map((r,i)=>(
                <tr key={i}>
                  <td><b>{r.name}</b><div className="muted">{r.email}</div></td>
                  <td><span className="pill pill-gray">{r.role}</span></td>
                  <td><span className={`pill ${r.cls}`}>{r.status}</span></td>
                  <td><button className="btn btn-light">Detail</button> <button className="btn btn-ghost">Reset</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default AkunPengguna;
