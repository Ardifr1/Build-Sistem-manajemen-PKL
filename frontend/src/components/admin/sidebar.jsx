import "./sidebar.css";

const MENU = [
  { key: "dashboard", label: "Dashboard" },
  { key: "akun", label: "Akun Pengguna" },
  { key: "tambah-akun", label: "Tambah Pengguna" },
  { key: "siswa", label: "Data Siswa" },
  { key: "guru", label: "Data Guru" },
  { key: "mitra", label: "Perusahaan Mitra" },
  { key: "periode", label: "Periode PKL" },
  { key: "pengajuan", label: "Pengajuan PKL" },
  { key: "monitoring", label: "Monitoring" },
  { key: "pengaturan", label: "Pengaturan" },
];

function Sidebar({ active = "dashboard", onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <span className="sidebar-logo-mark">P</span>
          <span>PKLHub • Admin</span>
        </div>
        <div className="sidebar-sub">Admin Sekolah • SMKN 1</div>
      </div>
      <nav className="sidebar-menu">
        {MENU.map((item) => (
          <button key={item.key} type="button" className={`sidebar-item ${active === item.key ? "active" : ""}`} onClick={() => onNavigate?.(item.key)}>
            <span className="dot" /> {item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button type="button" className="sidebar-logout">Keluar</button>
      </div>
    </aside>
  );
}
export default Sidebar;
