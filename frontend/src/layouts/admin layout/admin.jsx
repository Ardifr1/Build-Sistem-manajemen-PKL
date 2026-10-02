import Sidebar from "../../components/admin/sidebar";
import Topbar from "../../components/admin/Topbar.jsx";
import "./admin.css";

export const PAGE_META = {
  dashboard: {
    title: "Admin 02 — Dashboard",
    subtitle: "Ringkasan seluruh proses PKL • Semester Ganjil 2026",
    badgeText: "🔔 3 • Perlu tindakan admin",
    badgeVariant: "warning",
    avatarText: "AD",
  },
  akun: {
    title: "Admin 03 — Akun Pengguna",
    badgeText: "1.450 akun • Role otomatis sistem",
    badgeVariant: "primary",
  },
  "tambah-akun": {
    title: "Admin 03b — Tambah Pengguna",
    badgeText: "Form akun baru • Undangan email otomatis",
    badgeVariant: "primary",
  },
  siswa: {
    title: "Admin 04 — Data Siswa",
    badgeText: "Kelas XII • 1.240 siswa • 84 guru",
    badgeVariant: "primary",
  },
  guru: {
    title: "Admin 05 — Data Guru",
    badgeText: "84 guru • 42 pembimbing sekolah • 38 industri",
    badgeVariant: "primary",
  },
  mitra: {
    title: "Admin 06 — Perusahaan Mitra",
    badgeText: "126 mitra • 38 kuota penuh • Bidang & syarat",
    badgeVariant: "primary",
  },
  periode: {
    title: "Admin 07 — Periode PKL",
    badgeText: "Tahun 2026 • Ganjil Aktif",
    badgeVariant: "primary",
  },
  pengajuan: {
    title: "Admin 08 — Pengajuan PKL",
    badgeText: "486 pengajuan • Filter status PRD",
    badgeVariant: "primary",
  },
  monitoring: {
    title: "Admin 09 — Monitoring",
    badgeText: "Pengajuan → Penempatan → Jurnal → Nilai",
    badgeVariant: "primary",
  },
  pengaturan: {
    title: "Admin 10 — Pengaturan",
    badgeText: "Master data • Teknologi • Notifikasi",
    badgeVariant: "primary",
  },
};

function AdminLayout({ active = "dashboard", onNavigate, title, subtitle, badgeText, badgeVariant, avatarText, children }) {
  const meta = PAGE_META[active] || PAGE_META.dashboard;
  return (
    <div className="admin-layout">
      <Sidebar active={active} onNavigate={onNavigate} />
      <div className="admin-right">
        <Topbar
          title={title || meta.title}
          subtitle={subtitle !== undefined ? subtitle : meta.subtitle || ""}
          badgeText={badgeText !== undefined ? badgeText : meta.badgeText || ""}
          badgeVariant={badgeVariant || meta.badgeVariant || "primary"}
          avatarText={avatarText !== undefined ? avatarText : meta.avatarText || ""}
        />
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
export default AdminLayout;
