import Sidebar from "../../components/admin/sidebar";
import Topbar from "../../components/admin/Topbar.jsx";
import "./admin.css";

export const PAGE_META = {
  dashboard: {
    title: "Dashboard Admin",
    subtitle: "",
  },
  pengguna: {
    title: "Pengguna",
    subtitle: "Kelola akun • Tambah/Edit/Detail/Hapus",
  },
  perusahaan: {
    title: "Perusahaan Partner",
    subtitle: "",
  },
  periode: {
    title: "Periode PKL",
    subtitle: "DRAFT • AKTIF • SELESAI",
  },
  persetujuan: {
    title: "Persetujuan Sekolah",
    subtitle: "Diterima perusahaan → resmi • butuh ACC",
  },
};

function AdminLayout({ active = "dashboard", onNavigate, title, subtitle, children }) {
  const meta = PAGE_META[active] || PAGE_META.dashboard;
  return (
    <div className="admin-layout">
      <Sidebar active={active} onNavigate={onNavigate} />
      <div className="admin-right">
        <Topbar
          title={title || meta.title}
          subtitle={subtitle !== undefined ? subtitle : meta.subtitle || ""}
        />
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
