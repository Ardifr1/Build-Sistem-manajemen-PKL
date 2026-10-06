import "./Topbar.css";

function Topbar({ title = "", subtitle = "" }) {
  return (
    <header className="topbar">
      <div className="topbar-text">
        <div className="topbar-title">{title}</div>
        {subtitle && <div className="topbar-sub">{subtitle}</div>}
      </div>
      <div className="topbar-spacer" />
      <button type="button" className="topbar-bell" aria-label="Notifikasi">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
          <path
            d="M6 9.5a6 6 0 0 1 12 0c0 4 1.5 5.5 2 6.5H4c.5-1 2-2.5 2-6.5Z"
            stroke="#64748b"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M10 19a2.2 2.2 0 0 0 4 0"
            stroke="#64748b"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <span className="topbar-avatar" aria-hidden="true" />
    </header>
  );
}
export default Topbar;
