import StatCard from "../../components/admin/StatCard.jsx";
import StatusBadge from "../../components/admin/StatusBadge.jsx";
import SectionCard from "../../components/admin/SectionCard.jsx";
import ProgressBar from "../../components/admin/ProgressBar.jsx";
import DataTable from "../../components/admin/DataTable.jsx";

function Monitoring(){
  const stats=[
    {label:"Pengajuan", value:"486", pct:78},
    {label:"Absensi", value:"312", pct:64},
    {label:"Penempatan", value:"812", pct:85},
    {label:"Jurnal Wajib", value:"2.140", pct:52},
    {label:"Jurnal Harian", value:"640", pct:87},
  ];
  const rows=[
    {name:"Rina", stage:"Disetujui Sekolah", progress:"Absen 96% • Jurnal 12/12", action:"Lihat", status:"Disetujui Sekolah"},
    {name:"Bagas", stage:"Menunggu Penempatan", progress:"Absen 88% • Jurnal 8/12", action:"Ingatkan", status:"Menunggu Penempatan"},
    {name:"Sinta", stage:"Perlu Perbaikan (2)", progress:"Revisi AI dipakai", action:"Lihat", status:"Diproses"},
    {name:"Dimas", stage:"Interview 24 Sep", progress:"Tes lolos", action:"Kirim", status:"Diproses"},
  ];
  return (
    <div className="admin-page">
      <div className="grid-4" style={{gridTemplateColumns:"repeat(5,1fr)"}}>
        {stats.map((s)=>(
          <StatCard key={s.label} label={s.label} value={s.value}>
            <div className="muted">{s.pct}% selesai</div>
            <ProgressBar value={s.pct} variant="blue" style={{marginTop:6}} />
          </StatCard>
        ))}
      </div>

      <div className="grid-2" style={{marginTop:14}}>
        <SectionCard title="Siswa — Tahap Saat Ini">
          <DataTable headers={["Siswa — Tahap Saat Ini","Progres","Status","Aksi"]}>
            {rows.map((r,i)=>(
              <tr key={i}>
                <td><b>{r.name}</b><div className="muted">{r.stage}</div></td>
                <td>{r.progress}</td>
                <td><StatusBadge status={r.status} /></td>
                <td><button className="btn btn-light">{r.action}</button></td>
              </tr>
            ))}
          </DataTable>
        </SectionCard>

        <SectionCard title="Notifikasi & Peringatan • 3 belum dibaca">
          <div style={{display:"grid",gap:10}}>
            <div className="card" style={{background:"#FEF3C7",borderColor:"#FDE68A",padding:12}}>
              <b>Pengajuan PKL baru • Rina → PT Maju Jaya</b>
              <div className="muted">Perlu disposisi admin • sudah menunggu 3 hari</div>
              <div style={{marginTop:8}}><StatusBadge status="Menunggu" /></div>
            </div>
            <div className="card" style={{background:"#FEE2E2",borderColor:"#FECACA",padding:12}}>
              <b>Status penempatan berubah • Sinta pilih final</b>
              <div className="muted">Menunggu persetujuan • 2 perusahaan diterima</div>
              <div style={{marginTop:8}}><StatusBadge status="Diterima" /></div>
            </div>
            <div className="card" style={{background:"#DBEAFE",borderColor:"#BFDBFE",padding:12}}>
              <b>2 Jurnal perlu tindakan guru</b>
              <div className="muted">Sinta & Akmal • verifikasi maju • 24 jam</div>
              <div style={{marginTop:8}}><StatusBadge status="Diproses" /></div>
            </div>
          </div>
          <div style={{marginTop:12}}>
            <div className="muted">Keterbacaan notifikasi</div>
            <ProgressBar value={40} variant="yellow" style={{marginTop:6}} />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
export default Monitoring;
