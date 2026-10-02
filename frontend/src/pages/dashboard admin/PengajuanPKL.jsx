import { useState } from "react";
function PengajuanPKL(){
  const [tab,setTab]=useState("semua");
  const rows=[
    {siswa:"Rina", info:"XII RPL1 → PT Maju Jaya", pilihan:"1 dari 3", status:"Menunggu", cls:"pill-yellow"},
    {siswa:"Bagas", info:"XII TKJ2 → Telkom Akses", pilihan:"2 dari 3", status:"Diproses", cls:"pill-blue"},
    {siswa:"Sinta", info:"XII RPL2 → 2 Diterima", pilihan:"Final: CV Kreatif", status:"Diterima", cls:"pill-green"},
    {siswa:"Dimas", info:"XII MM1 → CV Kreatif", pilihan:"1 dari 2", status:"Ditolak", cls:"pill-red"},
    {siswa:"Putri", info:"XII AKL → Bank Daerah", pilihan:"Menunggu Persetujuan", status:"Disetujui Sekolah", cls:"pill-green"},
  ];
  const filtered = tab==="semua" ? rows : rows.filter(r=>r.status.toLowerCase()===tab);
  return (
    <div className="admin-page">
      <div className="page-head">
        <div>
          <div className="page-kicker">Admin 08 — Pengajuan PKL</div>
          <div className="page-title">Seluruh Pengajuan PKL</div>
          <div className="page-sub">486 pengajuan • Filter status PRD</div>
        </div>
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
        <button className={`chip ${tab==="semua"?"active":""}`} onClick={()=>setTab("semua")}>Semua (486)</button>
        <button className={`chip ${tab==="menunggu"?"active":""}`} onClick={()=>setTab("menunggu")}>Menunggu (68)</button>
        <button className={`chip ${tab==="diproses"?"active":""}`} onClick={()=>setTab("diproses")}>Diproses (142)</button>
        <button className={`chip ${tab==="diterima"?"active":""}`} onClick={()=>setTab("diterima")}>Diterima (210)</button>
        <button className={`chip ${tab==="ditolak"?"active":""}`} onClick={()=>setTab("ditolak")}>Ditolak (66)</button>
      </div>
      <div className="card">
        <div style={{overflowX:"auto"}}>
          <table className="table">
            <thead><tr><th>Siswa → Perusahaan</th><th>Pilihan</th><th>Status</th></tr></thead>
            <tbody>{filtered.map((r,i)=>(<tr key={i}><td><b>{r.siswa}</b><div className="muted">{r.info}</div></td><td>{r.pilihan}</td><td><span className={`pill ${r.cls}`}>{r.status}</span></td></tr>))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default PengajuanPKL;
