import "./Topbar.css";

function Topbar({ title = "", subtitle = "", badgeText = "", badgeVariant = "primary", avatarText = "" }) {
  return (
    <header className="topbar">
      <div className="topbar-title">{title}</div>
      {subtitle && <div className="topbar-sub">{subtitle}</div>}
      <div className="topbar-spacer" />
      {badgeText && (
        <span className={`topbar-badge topbar-badge-${badgeVariant}`}>{badgeText}</span>
      )}
      {avatarText && <span className="topbar-avatar">{avatarText}</span>}
    </header>
  );
}
export default Topbar;
