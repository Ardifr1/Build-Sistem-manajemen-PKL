import StatCard from "../../components/admin/StatCard.jsx";
import StatusBadge from "../../components/admin/StatusBadge.jsx";
import SectionCard from "../../components/admin/SectionCard.jsx";
import ProgressBar from "../../components/admin/ProgressBar.jsx";

function Dashboard() {
  const recent = [
    { name: "Rina • PT Maju Jaya", status: "Menunggu" },
    { name: "Bagas • Telkom Akses", status: "Diproses" },
    { name: "Sinta • Diterima 2 perusahaan", status: "Diterima" },
    { name: "Dimas • Ditolak industri", status: "Ditolak" },
  ];
  const alur = [
    { label: "Pengajuan → Seleksi", pct: 67 },
    { label: "Penempatan disetujui", pct: 55 },
    { label: "Jurnal terverifikasi", pct: 43 },
  ];
  return (
    <div className="admin-page gap-14">
      <div className="grid-4">
        <StatCard label="Total Siswa" value="1.240" hint="+32 semester ini" hintColor="#1D4ED8" />
        <StatCard label="Guru Pembimbing" value="84" hint="Rasio 1:15" hintColor="#0EA5E9" />
        <StatCard label="Perusahaan Mitra" value="126" hint="12 kuota penuh" hintColor="#16A34A" />
        <StatCard label="Pengajuan Aktif" value="486" hint="68 menunggu" hintColor="#D97706" />
      </div>

      <div className="grid-2">
        <SectionCard title="Pengajuan Terbaru — Perlu Tindakan" padding={16} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {recent.map((r) => (
            <div className="row-box" key={r.name}>
              <span style={{ fontSize: 12, color: "#0F172A", flex: 1 }}>{r.name}</span>
              <StatusBadge status={r.status} />
            </div>
          ))}
        </SectionCard>

        <div className="dark-card" style={{ padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Alur PKL — Progress Sekolah</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
            {alur.map((a) => (
              <div key={a.label}>
                <div style={{ fontSize: 11, color: "#BFDBFE", marginBottom: 6 }}>{a.label}</div>
                <ProgressBar percent={a.pct} barColor="#38BDF8" trackColor="#0F2A6B" height={8} />
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "#93C5FD", marginTop: 12, marginBottom: 0 }}>
            Batas maks 3 perusahaan / siswa. Role otomatis sistem.
          </p>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
