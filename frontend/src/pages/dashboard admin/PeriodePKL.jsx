import StatCard from "../../components/admin/StatCard.jsx";
import StatusBadge from "../../components/admin/StatusBadge.jsx";
import SectionCard from "../../components/admin/SectionCard.jsx";
import ProgressBar from "../../components/admin/ProgressBar.jsx";

function PeriodePKL({ onNavigate }){
  const cards=[
    {title:"Ganjil 2026", date:"1 Jul — 31 Des 2026 • 1.240 siswa • 126 mitra", desc:"Tahapan: Pendaftaran • Seleksi • Penempatan • Jurnal • Nilai. Seleksi berjalan • Batas 3 perusahaan • Verifikasi guru wajib", status:"Aktif", pct:45},
    {title:"Genap 2026", date:"1 Jan — 30 Jun 2026 • 1.180 siswa • 110 mitra", desc:"Tahapan: Pendaftaran • Seleksi • Penempatan • Jurnal • Nilai. Seleksi berjalan • Batas 3 perusahaan • Verifikasi guru wajib", status:"Selesai", pct:100},
    {title:"Ganjil 2025", date:"1 Jul — 31 Des 2025 • 1.150 siswa", desc:"Tahapan: Pendaftaran • Seleksi • Penempatan • Jurnal • Nilai. Seleksi berjalan • Batas 3 perusahaan • Verifikasi guru wajib", status:"Arsip", pct:100},
  ];
  return (
    <div className="admin-page">
      <div style={{display:"flex",justifyContent:"space-between",gap:10,flexWrap:"wrap",marginBottom:12}}>
        <div className="toolbar" style={{flex:1,minWidth:240}}>
          <input className="input" placeholder="Cari periode / tahun ajaran..." />
        </div>
        <button type="button" className="btn btn-primary" onClick={() => onNavigate?.("periode")}>+ Periode Baru</button>
      </div>

      <div className="grid-3" style={{marginBottom:14}}>
        <StatCard label="Periode Aktif" value="Ganjil 2026" hint="1.240 siswa" />
        <StatCard label="Total Mitra" value="126" hint="Semua periode" hintClassName="stat-hint" />
        <StatCard label="Progres Seleksi" value="45%">
          <ProgressBar value={45} variant="blue" style={{marginTop:6}} />
        </StatCard>
      </div>

      <div className="grid-3">
        {cards.map((c,i)=>(
          <SectionCard key={i}>
            <b style={{fontSize:16}}>{c.title}</b>
            <div className="muted" style={{marginTop:6}}>{c.date}</div>
            <p className="muted" style={{marginTop:8}}>{c.desc}</p>
            <ProgressBar value={c.pct} variant={c.status==="Aktif" ? "blue" : "green"} style={{marginTop:10}} />
            <div style={{display:"flex",justifyContent:"space-between",marginTop:10,alignItems:"center"}}>
              <StatusBadge status={c.status} />
              <button className="btn btn-light">Kelola</button>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
export default PeriodePKL;
