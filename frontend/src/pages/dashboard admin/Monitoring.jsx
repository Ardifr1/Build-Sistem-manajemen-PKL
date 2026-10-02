import ProgressBar from "../../components/admin/ProgressBar.jsx";
import DataTable from "../../components/admin/DataTable.jsx";

function Monitoring() {
  const stages = [
    { label: "Pengajuan", value: "486", pct: 78, text: "78% selesai" },
    { label: "Seleksi", value: "312", pct: 64, text: "64% selesai" },
    { label: "Penempatan", value: "812", pct: 65, text: "65% selesai" },
    { label: "Jurnal Aktif", value: "2.140", pct: 52, text: "52% selesai" },
    { label: "Nilai Akhir", value: "640", pct: 41, text: "41% selesai" },
  ];
  const rows = [
    { name: "Rina • Disetujui Sekolah", progres: "Absen 96% • Jurnal 12/12", action: "Lihat" },
    { name: "Bagas • Menunggu Penempatan", progres: "Absen 88% • Jurnal 8/12", action: "Ingatkan" },
    { name: "Sinta • Perlu Perbaikan (2)", progres: "Revisi AI dipakai", action: "Lihat" },
    { name: "Dimas • Interview 24 Sep", progres: "Tes lolos", action: "Kirim" },
  ];
  const notifs = [
    { bg: "#FEF3C7", title: "Pengajuan PKL baru • Rina → PT Maju Jaya", desc: "Perlu disposisi admin • sudah menunggu 3 hari" },
    { bg: "#FEE2E2", title: "Status penempatan berubah • Sinta pilih final", desc: "Menunggu persetujuan • 2 perusahaan diterima" },
    { bg: "#DBEAFE", title: "2 jurnal perlu tindakan guru", desc: "Sinta & Ahmad • verifikasi maks 2×24 jam" },
  ];
  return (
    <div className="admin-page">
      <div className="grid-5">
        {stages.map((s) => (
          <div className="card" key={s.label} style={{ padding: 12, display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 11, color: "#64748B" }}>{s.label}</span>
            <span style={{ fontSize: 18, fontWeight: 800 }}>{s.value}</span>
            <ProgressBar percent={s.pct} variant="primary" height={6} />
            <span style={{ fontSize: 10, fontWeight: 700, color: "#1D4ED8" }}>{s.text}</span>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <DataTable headers={["Siswa — Tahap Saat Ini", "Progres", "Aksi"]} headVariant="dark">
            {rows.map((r) => (
              <tr key={r.name}>
                <td style={{ fontWeight: 600, color: "#0F172A" }}>{r.name}</td>
                <td style={{ color: "#64748B" }}>{r.progres}</td>
                <td>
                  <span className="tag" style={{ background: "#1D4ED8", color: "#fff", fontSize: 10, borderRadius: 20, padding: "6px 12px" }}>
                    {r.action}
                  </span>
                </td>
              </tr>
            ))}
          </DataTable>
        </div>

        <div className="card" style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          <div className="section-title" style={{ marginBottom: 2 }}>Notifikasi &amp; Peringatan • 3 belum dibaca</div>
          {notifs.map((n) => (
            <div key={n.title} style={{ background: n.bg, borderRadius: 8, padding: 10, display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 11, fontWeight: 700 }}>{n.title}</span>
              <span style={{ fontSize: 10, color: "#64748B" }}>{n.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Monitoring;
