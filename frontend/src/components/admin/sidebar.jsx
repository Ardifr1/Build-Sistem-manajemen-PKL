import "./sidebar.css";

const MENU = [
  { key: "dashboard", label: "Dashboard" },
  { key: "pengguna", label: "Pengguna" },
  { key: "siswa", label: "Data Siswa" },
  { key: "guru", label: "Data Guru" },
  { key: "perusahaan", label: "Perusahaan Partner" },
  { key: "periode", label: "Periode PKL" },
  { key: "persetujuan", label: "Persetujuan" },
  { key: "jurnal", label: "Monitoring Jurnal" },
];

function Sidebar({
  active = "dashboard",
  onNavigate,
  menus = MENU,
  roleLabel = "ADMIN",
  orgLabel = "SMKN 1",
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img className="sidebar-logo-mark" src="/logo-simagang.png" alt="Logo SiMagang" />
        <span className="sidebar-brand-text">
          <strong>SiMagang</strong>
          <small>{roleLabel}</small>
        </span>
      </div>
      <nav className="sidebar-menu">
        {menus.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`sidebar-item ${active === item.key ? "active" : ""}`}
            onClick={() => onNavigate?.(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-spacer" />
      <div className="sidebar-user">
        <span className="sidebar-avatar" aria-hidden="true" />
        <span className="sidebar-user-text">
          <strong>{roleLabel}</strong>
          <small>{orgLabel}</small>
        </span>
      </div>
    </aside>
  );
}

export default Sidebar;
