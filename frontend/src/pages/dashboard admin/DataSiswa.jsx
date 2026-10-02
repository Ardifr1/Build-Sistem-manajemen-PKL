import StatusBadge from "../../components/admin/StatusBadge.jsx";
import DataTable from "../../components/admin/DataTable.jsx";

function DataSiswa() {
  const rows = [
    { name: "23101 • Rina Amelia • XII RPL1", perusahaan: "PT Maju Jaya", pembimbing: "Bu Sari / Pk. Andi", status: "Disetujui Sekolah", variant: "success" },
    { name: "23102 • Bagas Pratama • XII TKJ2", perusahaan: "Telkom Akses", pembimbing: "Pk. Budi / Bu Rani", status: "Menunggu Penempatan", variant: "warning" },
    { name: "23103 • Sinta Dewi • XII RPL2", perusahaan: "— Belum ada —", pembimbing: "Bu Sari / —", status: "Menunggu Persetujuan", variant: "primary" },
    { name: "23104 • Dimas • XII MM1", perusahaan: "CV Kreatif", pembimbing: "Bu Ani / Pk. Joko", status: "Diproses", variant: "primary" },
  ];
  return (
    <div className="admin-page">
      <div className="grid-3g10">
        <div className="card mini-kpi"><b>XII RPL 1 — 36 siswa</b><span>Wali: Bu Sari</span></div>
        <div className="card mini-kpi"><b>XII TKJ 2 — 34 siswa</b><span>Wali: Pk. Budi</span></div>
        <div className="card mini-kpi"><b>Sudah ditempatkan — 812</b><span>65%</span></div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <DataTable headers={["NIS — Nama — Kelas", "Perusahaan", "Pembimbing", "Status"]} headVariant="dark">
          {rows.map((r) => (
            <tr key={r.name}>
              <td style={{ fontWeight: 600, color: "#0F172A" }}>{r.name}</td>
              <td style={{ color: "#64748B" }}>{r.perusahaan}</td>
              <td style={{ color: "#64748B" }}>{r.pembimbing}</td>
              <td>
                <StatusBadge status={r.status} variant={r.variant} small />
              </td>
            </tr>
          ))}
        </DataTable>
      </div>
    </div>
  );
}
export default DataSiswa;
