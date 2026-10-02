import StatCard from "../../components/admin/StatCard.jsx";
import StatusBadge from "../../components/admin/StatusBadge.jsx";
import SectionCard from "../../components/admin/SectionCard.jsx";
import ProgressBar from "../../components/admin/ProgressBar.jsx";
import DataTable from "../../components/admin/DataTable.jsx";

function DataSiswa(){
  const rows=[
    {nis:"23101", name:"Rina Amelia", kelas:"XII RPL1", perusahaan:"PT Maju Jaya", pembimbing:"Bu Sari / Pk. Andi", status:"Disetujui Sekolah"},
    {nis:"23102", name:"Bagas Pratama", kelas:"XII TKJ2", perusahaan:"Telkom Akses", pembimbing:"Pk. Budi / Bu Rani", status:"Menunggu Penempatan"},
    {nis:"23103", name:"Sinta Dewi", kelas:"XII RPL2", perusahaan:"— Belum ada —", pembimbing:"Bu Sari / —", status:"Menunggu Persetujuan"},
    {nis:"23104", name:"Dimas", kelas:"XII MM1", perusahaan:"CV Kreatif", pembimbing:"Bu Ani / Pk. Joko", status:"Diproses"},
  ];
  return (
    <div className="admin-page">
      <div className="grid-3">
        <StatCard label="XII RPL 1 — 36 siswa" hint="Wali: Bu Sari" />
        <StatCard label="XII TKJ 2 — 34 siswa" hint="Wali: Pk. Budi" />
        <StatCard label="Sudah ditempatkan — 812" value="65%">
          <ProgressBar value={65} variant="blue" style={{marginTop:6}} />
        </StatCard>
      </div>

      <SectionCard style={{marginTop:14}}>
        <DataTable headers={["NIS — Nama — Kelas","Perusahaan","Pembimbing","Status"]}>
          {rows.map((r,i)=>(
            <tr key={i}>
              <td><b>{r.nis} • {r.name} • {r.kelas}</b></td>
              <td>{r.perusahaan}</td>
              <td>{r.pembimbing}</td>
              <td><StatusBadge status={r.status} /></td>
            </tr>
          ))}
        </DataTable>
      </SectionCard>
    </div>
  );
}
export default DataSiswa;
