import Sidebar from "../../components/admin/sidebar";
import Topbar from "../../components/admin/Topbar.jsx";
import "./admin.css";

export const PAGE_META = {
  dashboard: {
    kicker: "Admin 02 — Dashboard",
    title: "Dashboard",
    subtitle: "Ringkasan seluruh proses PKL • Semester Ganjil 2026",
    badgeText: "3 • Perlu tindakan admin",
  },
  akun: {
    kicker: "Admin 03 — Akun Pengguna",
    title: "Manajemen Akun Pengguna",
    subtitle: "1.400 akun • Role otomatis sistem",
    badgeText: "3 • Perlu tindakan admin",
  },
  "tambah-akun": {
    kicker: "Admin 03b — Tambah Pengguna",
    title: "Tambah Pengguna Baru",
    subtitle: "Form akun baru • Undangan email otomatis • Draft • Belum tersimpan",
    badgeText: "Draft • Belum tersimpan",
  },
  siswa: {
    kicker: "Admin 04 — Data Siswa",
    title: "Data Siswa",
    subtitle: "Kelas XII • 1.240 siswa • 64 guru",
    badgeText: "3 • Perlu tindakan admin",
  },
  guru: {
    kicker: "Admin 05 — Data Guru",
    title: "Data Guru & Pembimbing",
    subtitle: "64 guru • 42 pembimbing sekolah • 38 industri",
    badgeText: "12 guru belum tugas",
  },
  mitra: {
    kicker: "Admin 06 — Perusahaan Mitra",
    title: "Perusahaan Mitra & Kuota",
    subtitle: "126 mitra • 38 kuota penuh • Bidang & syarat",
    badgeText: "9 perlu verifikasi",
  },
  periode: {
    kicker: "Admin 07 — Periode PKL",
    title: "Periode PKL",
    subtitle: "Tahun 2026 • Ganjil Aktif",
    badgeText: "Ganjil 2026 aktif",
  },
  pengajuan: {
    kicker: "Admin 08 — Pengajuan PKL",
    title: "Seluruh Pengajuan PKL",
    subtitle: "486 pengajuan • Filter status PRD",
    badgeText: "68 menunggu",
  },
  monitoring: {
    kicker: "Admin 09 — Monitoring",
    title: "Monitoring Proses PKL",
    subtitle: "Pengajuan → Penempatan → Jurnal → Nilai",
    badgeText: "3 belum dibaca",
  },
  pengaturan: {
    kicker: "Admin 10 — Pengaturan",
    title: "Pengaturan Data Sistem",
    subtitle: "Master data • Teknologi • Notifikasi",
    badgeText: "3 • Perlu tindakan admin",
  },
};

function AdminLayout({
  active = "dashboard",
  onNavigate,
  title,
  subtitle,
  kicker,
  badgeText,
  children,
}) {
  const meta = PAGE_META[active] || PAGE_META.dashboard;
  return (
    <div className="admin-layout">
      <Sidebar active={active} onNavigate={onNavigate} />
      <div className="admin-right">
        <Topbar
          kicker={kicker || meta.kicker}
          title={title || meta.title}
          subtitle={subtitle || meta.subtitle}
          badgeText={badgeText ?? meta.badgeText}
        />
        <main className="admin-content">
          <div className="admin-main">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
