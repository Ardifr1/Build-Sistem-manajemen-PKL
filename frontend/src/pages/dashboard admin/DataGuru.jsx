import StatCard from "../../components/admin/StatCard.jsx";
import StatusBadge from "../../components/admin/StatusBadge.jsx";
import SectionCard from "../../components/admin/SectionCard.jsx";
import ProgressBar from "../../components/admin/ProgressBar.jsx";

function DataGuru(){
  const rows=[
    {init:"H", name:"Hartono", info:"RPL • 20 siswa", status:"Pembimbing Aktif", pct:100},
    {init:"S", name:"Sari Wulandari", info:"TKJ • 18 siswa", status:"Pembimbing Aktif", pct:90},
    {init:"B", name:"Budi Santoso", info:"MM • 0 siswa", status:"Belum Ditugaskan", pct:0},
    {init:"A", name:"Ani Lestari", info:"AKL • 15 siswa", status:"Pembimbing Aktif", pct:75},
  ];
  const mapping=[
    "Hartono → PT Maju Jaya (12)",
    "Sari → Telkom Akses (18)",
    "Budi → CV Kreatif (11)",
    "Ani → Bank Daerah (15)",
  ];
  return (
    <div className="admin-page">
      <div className="grid-3">
        <StatCard label="42 Pembimbing Sekolah" hint="Rasio 1: 20 siswa" />
        <StatCard label="38 Pembimbing Industri" hint="Terkonfirmasi" />
        <StatCard label="12 Guru Belum Tugas">
          <span style={{color:"#D97706",fontWeight:700,fontSize:12}}>Perlu penetapan</span>
          <ProgressBar value={22} variant="yellow" style={{marginTop:8}} />
        </StatCard>
      </div>

      <div className="grid-2" style={{marginTop:14}}>
        <SectionCard title="Daftar Guru — Tetapkan Pembimbing">
          {rows.map((r,i)=>(
            <div className="list-row" key={i}>
              <span style={{display:"flex",gap:10,alignItems:"center"}}>
                <span className="avatar">{r.init}</span>
                <span><b>{r.name}</b><div className="muted">{r.info}</div></span>
              </span>
              <StatusBadge status={r.status} />
            </div>
          ))}
        </SectionCard>

        <SectionCard title="Pemetaan Pembimbing ↔ Industri" dark>
          <div style={{display:"grid",gap:8}}>
            {mapping.map((m)=>(
              <div key={m} className="card" style={{padding:12}}><b>{m}</b></div>
            ))}
          </div>
          <p style={{color:"#DBEAFE",marginTop:10,fontSize:13}}>Form: pilih guru • perusahaan • kuota • Tetapkan. Validasi rasio maks 1:20.</p>
          <ProgressBar value={68} variant="blue" onDark style={{marginTop:8}} />
          <button className="btn" style={{background:"#38BDF8",color:"#082F49",width:"100%",marginTop:10}}>Tetapkan Pembimbing</button>
        </SectionCard>
      </div>
    </div>
  );
}
export default DataGuru;
