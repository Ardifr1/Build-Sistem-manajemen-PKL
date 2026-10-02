import StatusBadge from "../../components/admin/StatusBadge.jsx";
import DataTable from "../../components/admin/DataTable.jsx";

function AkunPengguna({ onNavigate }) {
  const rows = [
    { name: "Rina Amelia — rina@smkn1.sch.id", role: "Siswa", status: "Aktif", variant: "success" },
    { name: "Bpk. Hartono — hartono@smkn1.sch.id", role: "Guru", status: "Aktif", variant: "primary" },
    { name: "PT Maju Jaya — hrd@majujaya.id", role: "Perusahaan", status: "Menunggu", variant: "warning" },
    { name: "Admin TU — tu@smkn1.sch.id", role: "Admin", status: "Aktif", variant: "primary" },
    { name: "Dimas — dimas@smkn1.sch.id", role: "Siswa", status: "Nonaktif", variant: "danger" },
  ];
  return (
    <div className="admin-page">
      <div className="toolbar">
        <span className="search-box">🔍&nbsp; Cari nama / email / NIS...</span>
        <span className="filter-box">Semua Role ▾</span>
        <span className="filter-box">Aktif ▾</span>
        <button type="button" className="btn btn-primary" onClick={() => onNavigate?.("tambah-akun")}>
          + Tambah Akun
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <DataTable headers={["Nama / Email", "Role", "Status", "Aksi"]} headVariant="light">
          {rows.map((r) => (
            <tr key={r.name}>
              <td style={{ fontSize: 12, fontWeight: 600, color: "#0F172A" }}>{r.name}</td>
              <td>
                <span className="pill pill-role">{r.role}</span>
              </td>
              <td>
                <StatusBadge status={r.status} variant={r.variant} />
              </td>
              <td>
                <span className="action-text">Detail&nbsp;&nbsp;•&nbsp;&nbsp;Reset&nbsp;&nbsp;•&nbsp;&nbsp;⋯</span>
              </td>
            </tr>
          ))}
        </DataTable>
      </div>
    </div>
  );
}
export default AkunPengguna;
