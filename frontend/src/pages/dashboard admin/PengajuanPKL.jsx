import { useState } from "react";
import StatCard from "../../components/admin/StatCard.jsx";
import StatusBadge from "../../components/admin/StatusBadge.jsx";
import SectionCard from "../../components/admin/SectionCard.jsx";
import DataTable from "../../components/admin/DataTable.jsx";
import ProgressBar from "../../components/admin/ProgressBar.jsx";

function PengajuanPKL(){
  const [tab,setTab]=useState("semua");
  const rows=[
    {siswa:"Rina", info:"XII RPL1 → PT Maju Jaya", pilihan:"1 dari 3", status:"Menunggu"},
    {siswa:"Bagas", info:"XII TKJ2 → Telkom Akses", pilihan:"2 dari 3", status:"Diproses"},
    {siswa:"Sinta", info:"XII RPL2 → 2 Diterima", pilihan:"Final: CV Kreatif", status:"Diterima"},
    {siswa:"Dimas", info:"XII MM1 → CV Kreatif", pilihan:"1 dari 2", status:"Ditolak"},
    {siswa:"Putri", info:"XII AKL → Bank Daerah", pilihan:"Menunggu Persetujuan", status:"Disetujui Sekolah"},
  ];
  const filtered = tab==="semua" ? rows : rows.filter(r=>r.status.toLowerCase()===tab);
  const pct = Math.round((filtered.length / rows.length) * 100) || 0;
  return (
    <div className="admin-page">
      <div className="grid-4" style={{marginBottom:14}}>
        <StatCard label="Semua" value="486" hint="Total pengajuan" />
        <StatCard label="Menunggu" value="68"><ProgressBar value={14} variant="yellow" style={{marginTop:6}} /></StatCard>
        <StatCard label="Diproses" value="142"><ProgressBar value={29} variant="blue" style={{marginTop:6}} /></StatCard>
        <StatCard label="Diterima" value="210"><ProgressBar value={43} variant="green" style={{marginTop:6}} /></StatCard>
      </div>

      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
        <button className={`chip ${tab==="semua"?"active":""}`} onClick={()=>setTab("semua")}>Semua (486)</button>
        <button className={`chip ${tab==="menunggu"?"active":""}`} onClick={()=>setTab("menunggu")}>Menunggu (68)</button>
        <button className={`chip ${tab==="diproses"?"active":""}`} onClick={()=>setTab("diproses")}>Diproses (142)</button>
        <button className={`chip ${tab==="diterima"?"active":""}`} onClick={()=>setTab("diterima")}>Diterima (210)</button>
        <button className={`chip ${tab==="ditolak"?"active":""}`} onClick={()=>setTab("ditolak")}>Ditolak (66)</button>
      </div>

      <SectionCard>
        <div className="muted" style={{marginBottom:8}}>Menampilkan {filtered.length} dari {rows.length} contoh data • {pct}%</div>
        <ProgressBar value={pct} variant="blue" style={{marginBottom:12}} />
        <DataTable headers={["Siswa → Perusahaan","Pilihan","Status"]}>
          {filtered.map((r,i)=>(
            <tr key={i}>
              <td><b>{r.siswa}</b><div className="muted">{r.info}</div></td>
              <td>{r.pilihan}</td>
              <td><StatusBadge status={r.status} /></td>
            </tr>
          ))}
        </DataTable>
      </SectionCard>
    </div>
  );
}
export default PengajuanPKL;
