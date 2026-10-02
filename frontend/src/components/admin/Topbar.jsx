import "./Topbar.css";

function Topbar({
  kicker = "Admin — Dashboard",
  title = "Dashboard",
  subtitle = "",
  badgeText = "3 • Perlu tindakan admin",
  avatarText = "AG",
  searchPlaceholder = "Cari siswa, perusahaan, pengajuan...",
  actions,
}) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-kicker">{kicker}</div>
        <h1 className="topbar-title">{title}</h1>
        {subtitle && <div className="topbar-sub">{subtitle}</div>}
      </div>

      <div className="topbar-right">
        <label className="topbar-search">
          <span className="topbar-search-icon" aria-hidden="true">⌕</span>
          <input
            className="topbar-search-input"
            placeholder={searchPlaceholder}
            aria-label="Pencarian admin"
          />
        </label>
        {badgeText && <span className="badge-top">{badgeText}</span>}
        {actions}
        <span className="avatar" aria-label="Profil admin">{avatarText}</span>
      </div>
    </header>
  );
}
export default Topbar;
