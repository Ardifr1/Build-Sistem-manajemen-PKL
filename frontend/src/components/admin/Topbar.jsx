import "./Topbar.css";
import { authApi } from "../../api/index.js";

function Topbar({ title = "", subtitle = "" }) {
  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      /* abaikan — token lokal tetap dibersihkan */
    }
    try {
      localStorage.removeItem("simagang_token");
      localStorage.removeItem("simagang_user");
    } catch {
      /* abaikan */
    }
    window.location.href = "/login";
  };

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
      <button type="button" className="topbar-logout" onClick={handleLogout}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
          <path
            d="M14 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 12h11M18 8l3 4-3 4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Keluar
      </button>
    </header>
  );
}
export default Topbar;
