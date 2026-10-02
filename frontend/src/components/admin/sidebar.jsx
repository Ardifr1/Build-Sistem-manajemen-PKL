import "./sidebar.css";

const MENU = [
  { key: "dashboard", label: "Dashboard" },
  { key: "akun", label: "Akun Pengguna" },
  { key: "siswa", label: "Data Siswa" },
  { key: "guru", label: "Data Guru" },
  { key: "mitra", label: "Perusahaan Mitra" },
  { key: "periode", label: "Periode PKL" },
  { key: "pengajuan", label: "Pengajuan PKL" },
  { key: "monitoring", label: "Monitoring" },
  { key: "pengaturan", label: "Pengaturan" },
];

function Sidebar({ active = "dashboard", onNavigate }) {
  const activeKey = active === "tambah-akun" ? "akun" : active;
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">● PKLHub&nbsp;&nbsp;• Admin</div>
      <div className="sidebar-sub">Admin Sekolah • SMKN 1</div>
      <nav className="sidebar-menu">
        {MENU.map((item) => {
          const isActive = activeKey === item.key;
          return (
            <button
              key={item.key}
              type="button"
              className={`sidebar-item ${isActive ? "active" : ""}`}
              onClick={() => onNavigate?.(item.key)}
            >
              {isActive ? "●" : "○"} {item.label}
            </button>
          );
        })}
      </nav>
      <div className="sidebar-spacer" />
      <button type="button" className="sidebar-logout">Keluar</button>
    </aside>
  );
}
export default Sidebar;
