import StatCard from "../../components/admin/StatCard.jsx";
import StatusBadge from "../../components/admin/StatusBadge.jsx";
import SectionCard from "../../components/admin/SectionCard.jsx";
import ProgressBar from "../../components/admin/ProgressBar.jsx";

function Dashboard(){
  const recent=[
    {name:"Rina • PT Maju Jaya", status:"Menunggu"},
    {name:"Bagas • Telkom Akses", status:"Diproses"},
    {name:"Sinta • Diterima 2 perusahaan", status:"Diterima"},
    {name:"Dimas • Ditolak industri", status:"Ditolak"},
  ];
  const progress=[
    {label:"Pengajuan selesai", value:78, variant:"white"},
    {label:"Penempatan disetujui", value:65, variant:"blue"},
    {label:"Jurnal terverifikasi", value:52, variant:"yellow"},
  ];
  return (
    <div className="admin-page">
      <div className="grid-4">
        <StatCard label="Total Siswa" value="1.240" hint="+2 semester ini" hintClassName="stat-hint" />
        <StatCard label="Guru Pembimbing" value="84" hint="Rasio 1:15" />
        <StatCard label="Perusahaan Mitra" value="126" hint="12 kuota penuh" hintClassName="stat-hint" />
        <StatCard label="Pengajuan Aktif" value="486">
          <span style={{color:"#D97706",fontWeight:700,fontSize:12}}>68 menunggu</span>
        </StatCard>
      </div>

      <div className="grid-2" style={{marginTop:14}}>
        <SectionCard title="Pengajuan Terbaru — Perlu Tindakan">
          {recent.map((r,i)=>(
            <div className="list-row" key={i}>
              <span style={{fontWeight:600}}>{r.name}</span>
              <StatusBadge status={r.status} />
            </div>
          ))}
          <p className="muted" style={{marginTop:10}}>Klik baris untuk membuka detail pengajuan (frontend statis).</p>
        </SectionCard>

        <SectionCard title="Alur PKL — Progress Sekolah" subtitle="Pengajuan → Penempatan → Jurnal → Nilai" dark>
          <div style={{marginTop:6,display:"grid",gap:12}}>
            {progress.map((p)=>(
              <div key={p.label}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
                  <span>{p.label}</span><b>{p.value}%</b>
                </div>
                <ProgressBar value={p.value} variant={p.variant} onDark style={{marginTop:6}} />
              </div>
            ))}
          </div>
          <p style={{fontSize:12.5,opacity:.9,marginTop:12}}>Batas maks 3 perusahaan / siswa. Role otomatis sistem.</p>
        </SectionCard>
      </div>
    </div>
  );
}
export default Dashboard;
