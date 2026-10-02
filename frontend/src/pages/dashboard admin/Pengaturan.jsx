import StatCard from "../../components/admin/StatCard.jsx";
import StatusBadge from "../../components/admin/StatusBadge.jsx";
import SectionCard from "../../components/admin/SectionCard.jsx";
import ProgressBar from "../../components/admin/ProgressBar.jsx";

function Pengaturan(){
  const tech=[
    {title:"Frontend: React", desc:"Mockup ini siap diadaptasi", status:"Aktif"},
    {title:"Backend: Laravel + Sanctum", desc:"Role otomatis dari API", status:"Aktif"},
    {title:"Database: MySQL", desc:"Users, perusahaan, jurnal", status:"Aktif"},
    {title:"AI: Filter", desc:"Hanya bantu revisi jurnal", status:"Diproses"},
    {title:"Storage: Local", desc:"CV & portofolio siswa", status:"Aktif"},
  ];
  return (
    <div className="admin-page">
      <div className="grid-3" style={{marginBottom:14}}>
        <StatCard label="Sekolah" value="SMKN 1" hint="SMKN 1 Jakarta" />
        <StatCard label="Tahun Ajaran" value="2026" hint="Ganjil aktif" hintClassName="stat-hint" />
        <StatCard label="Kelengkapan Master" value="86%">
          <ProgressBar value={86} variant="green" style={{marginTop:6}} />
        </StatCard>
      </div>

      <div className="grid-2">
        <SectionCard title="Data Master Sekolah">
          <div style={{display:"grid",gap:12}}>
            <div><label className="f-label">Nama Sekolah</label><input className="input" defaultValue="SMKN 1 Jakarta"/></div>
            <div><label className="f-label">Tahun Ajaran Aktif</label><select className="select"><option>2026 Ganjil</option><option>2026 Genap</option></select></div>
            <div><label className="f-label">Batas Pilihan Perusahaan</label><input className="input" defaultValue="Maks 3 perusahaan / siswa"/></div>
            <div><label className="f-label">Bobot Nilai</label><input className="input" defaultValue="Industri 60% • Guru 40% • Jurnal 20%"/></div>
          </div>
          <button className="btn btn-primary" style={{width:"100%",marginTop:14}}>Simpan Pengaturan</button>
        </SectionCard>

        <SectionCard title="Teknologi & Aturan PRD" dark>
          <div style={{display:"grid",gap:8}}>
            {tech.map((t)=>(
              <div key={t.title} className="card" style={{padding:12}}>
                <div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"center"}}>
                  <b>{t.title}</b>
                  <StatusBadge status={t.status} />
                </div>
                <div className="muted">{t.desc}</div>
              </div>
            ))}
          </div>
          <p style={{color:"#DBEAFE",marginTop:10,fontSize:13}}>Status PRD: Menunggu / Diproses / Diterima / Ditolak • Draft / Menunggu Verifikasi / Disetujui / Perlu Perbaikan.</p>
          <ProgressBar value={72} variant="white" onDark style={{marginTop:8}} />
        </SectionCard>
      </div>
    </div>
  );
}
export default Pengaturan;
