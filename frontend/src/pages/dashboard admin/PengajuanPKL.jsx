import { useState } from "react";
import StatusBadge from "../../components/admin/StatusBadge.jsx";
import DataTable from "../../components/admin/DataTable.jsx";

const TABS = [
  { key: "semua", label: "Semua (486)" },
  { key: "menunggu", label: "Menunggu (68)" },
  { key: "diproses", label: "Diproses (142)" },
  { key: "diterima", label: "Diterima (210)" },
  { key: "ditolak", label: "Ditolak (66)" },
];

function PengajuanPKL() {
  const [tab, setTab] = useState("semua");
  const rows = [
    { name: "Rina • XII RPL1 → PT Maju Jaya", pilihan: "1 dari 3", status: "Menunggu", variant: "warning" },
    { name: "Bagas • XII TKJ2 → Telkom Akses", pilihan: "2 dari 3", status: "Diproses", variant: "primary" },
    { name: "Sinta • XII RPL2 → 2 Diterima", pilihan: "Final: CV Kreatif", status: "Diterima", variant: "success" },
    { name: "Dimas • XII MM1 → CV Kreatif", pilihan: "1 dari 2", status: "Ditolak", variant: "danger" },
    { name: "Putri • XII AKL → Bank Daerah", pilihan: "Menunggu Persetujuan", status: "Disetujui Sekolah", variant: "success" },
  ];
  const filtered =
    tab === "semua"
      ? rows
      : rows.filter((r) => r.status.toLowerCase() === tab || (tab === "diterima" && r.status === "Disetujui Sekolah"));

  return (
    <div className="admin-page">
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`chip ${tab === t.key ? "active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <DataTable headers={["Siswa → Perusahaan", "Pilihan", "Status"]} headVariant="dark">
          {filtered.map((r) => (
            <tr key={r.name}>
              <td style={{ fontWeight: 600, color: "#0F172A" }}>{r.name}</td>
              <td style={{ color: "#64748B" }}>{r.pilihan}</td>
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
export default PengajuanPKL;
