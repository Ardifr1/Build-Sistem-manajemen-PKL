import StatusBadge from "../../components/admin/StatusBadge.jsx";
import SectionCard from "../../components/admin/SectionCard.jsx";
import DataTable from "../../components/admin/DataTable.jsx";
import StatCard from "../../components/admin/StatCard.jsx";

function AkunPengguna({ onNavigate }){
  const rows=[
    {name:"Rina Amelia", email:"rina@smkn1.sch.id", role:"Siswa", status:"Aktif"},
    {name:"Bpk. Hartono", email:"hartono@smkn1.sch.id", role:"Guru", status:"Aktif"},
    {name:"PT Maju Jaya", email:"hrd@majujaya.id", role:"Perusahaan", status:"Menunggu"},
    {name:"Admin TU", email:"tu@smkn1.sch.id", role:"Admin", status:"Aktif"},
    {name:"Dimas", email:"dimas@smkn1.sch.id", role:"Siswa", status:"Nonaktif"},
  ];
  return (
    <div className="admin-page">
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
        <button type="button" className="btn btn-primary" onClick={() => onNavigate?.("tambah-akun")}>+ Tambah Akun</button>
      </div>

      <div className="grid-3" style={{marginBottom:14}}>
        <StatCard label="Total Akun" value="1.400" hint="Semua role" />
        <StatCard label="Aktif" value="1.268" hint="90% aktif" hintClassName="stat-hint" />
        <StatCard label="Menunggu Verifikasi" value="24">
          <span style={{color:"#D97706",fontWeight:700,fontSize:12}}>Perlu tindakan</span>
        </StatCard>
      </div>

      <SectionCard>
        <div className="toolbar" style={{marginBottom:12}}>
          <input className="input" style={{flex:1,minWidth:220}} placeholder="Cari nama / email / NIS..." />
          <select className="select" style={{maxWidth:160}}><option>Semua Role</option><option>Siswa</option><option>Guru</option><option>Perusahaan</option><option>Admin</option></select>
          <select className="select" style={{maxWidth:140}}><option>Aktif</option><option>Menunggu</option><option>Nonaktif</option></select>
          <button type="button" className="btn btn-light" onClick={() => onNavigate?.("tambah-akun")}>+ Tambah Pengguna</button>
        </div>
        <DataTable headers={["Nama / Email","Role","Status","Aksi"]}>
          {rows.map((r,i)=>(
            <tr key={i}>
              <td><b>{r.name}</b><div className="muted">{r.email}</div></td>
              <td><span className="pill pill-gray">{r.role}</span></td>
              <td><StatusBadge status={r.status} /></td>
              <td><button className="btn btn-light">Detail</button> <button className="btn btn-ghost">Reset</button></td>
            </tr>
          ))}
        </DataTable>
      </SectionCard>
    </div>
  );
}
export default AkunPengguna;
