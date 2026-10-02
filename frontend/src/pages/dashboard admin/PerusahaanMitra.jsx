import StatCard from "../../components/admin/StatCard.jsx";
import StatusBadge from "../../components/admin/StatusBadge.jsx";
import SectionCard from "../../components/admin/SectionCard.jsx";
import ProgressBar from "../../components/admin/ProgressBar.jsx";

function PerusahaanMitra(){
  const cards=[
    {init:"P", name:"PT Maju Jaya • Manufaktur", kuota:"Kuota 20 • Terisi 18", pct:90, syarat:"Syarat: Min. nilai 80 • CV", status:"Aktif"},
    {init:"T", name:"Telkom Akses • Telekomunikasi", kuota:"Kuota 30 • Terisi 30", pct:100, syarat:"Syarat: Tes • Interview", status:"Penuh"},
    {init:"C", name:"CV Kreatif Digital • Desain", kuota:"Kuota 12 • Terisi 5", pct:42, syarat:"Syarat: Portofolio", status:"Aktif"},
  ];
  return (
    <div className="admin-page">
      <div className="grid-3">
        <StatCard label="Total Kuota 1.480" value="74%">
          <div className="muted">Terisi 1.102 (74%)</div>
          <ProgressBar value={74} variant="blue" style={{marginTop:8}} />
        </StatCard>
        <StatCard label="Perlu Verifikasi 9" hint="Dokumen MoU" />
        <StatCard label="Bidang Terbanyak RPL" hint="42 perusahaan" />
      </div>

      <div className="grid-3" style={{marginTop:14}}>
        {cards.map((c,i)=>(
          <SectionCard key={i}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}><span className="avatar">{c.init}</span><b>{c.name}</b></div>
            <div className="muted" style={{marginTop:10}}>{c.kuota}</div>
            <ProgressBar value={c.pct} variant="blue" style={{marginTop:8}} />
            <div className="muted" style={{marginTop:8}}>{c.syarat}</div>
            <div style={{marginTop:10,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <StatusBadge status={c.status} />
              <button className="btn btn-light">Detail</button>
              <button className="btn btn-ghost">Edit Kuota</button>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
export default PerusahaanMitra;
