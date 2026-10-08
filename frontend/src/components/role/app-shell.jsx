import { useState } from "react";
import { authApi } from "../../api/index.js";
import NotifBell from "./notif-bell.jsx";
import "./app-shell.css";

function initials(name) {
  const p = String(name || "?").trim().split(/\s+/);
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
  return (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

function doLogout() {
  authApi.logout().catch(() => {});
  try {
    localStorage.removeItem("simagang_token");
    localStorage.removeItem("simagang_user");
  } catch { /* abaikan */ }
  window.location.href = "/login";
}

/**
 * AppShell — layout bersama dashboard admin / guru / perusahaan / pembimbing.
 * Gaya visual disamakan dengan dashboard siswa.
 *
 * @param {string} roleLabel   label role di brand, mis. "ADMIN"
 * @param {Array}  menus       seksi menu: [{ title, items: [{ key, label, icon, locked? }] }]
 * @param {string} active      key menu aktif
 * @param {Function} onNavigate(key)
 * @param {Object} user        user aktif (dari authApi.currentUser())
 * @param {string} userSub     teks kecil di user card (default: roleLabel)
 * @param {string} title       judul topbar
 * @param {string} subtitle    subjudul topbar
 * @param {string} periodeLabel label badge periode (opsional; tampil bila diisi)
 * @param {string} profileKey key menu profil (opsional; jika diisi, user card & avatar bisa diklik ke profil)
 */
function AppShell({
  roleLabel = "ADMIN",
  menus = [],
  active = "dashboard",
  onNavigate,
  user,
  userSub,
  title = "",
  subtitle = "",
  periodeLabel = "",
  profileKey = "",
  children,
}) {
  const [navOpen, setNavOpen] = useState(false);

  const goNav = (menuKey) => {
    setNavOpen(false);
    onNavigate?.(menuKey);
  };

  const goProfile = () => {
    if (profileKey) goNav(profileKey);
  };

  const roleKey =
    roleLabel === "GURU" ? "teacher"
    : roleLabel === "PERUSAHAAN" ? "company"
    : roleLabel === "PEMBIMBING" ? "supervisor"
    : "admin";

  return (
    <div className="shell-layout">
      <div
        className={`shell-overlay ${navOpen ? "show" : ""}`}
        onClick={() => setNavOpen(false)}
        aria-hidden="true"
      />
      <aside className={`shell-sidebar ${navOpen ? "open" : ""}`}>
        <div className="shell-brand">
          <span className="shell-brand-mark">
            <img
              src="/logo-simagang.png"
              alt="SiMagang"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          </span>
          <span className="shell-brand-text">
            <strong>SiMagang</strong>
            <small>{roleLabel}</small>
          </span>
        </div>
        <nav className="shell-nav">
          {menus.map((sec) => (
            <div key={sec.title}>
              <div className="shell-nav-sec">{sec.title}</div>
              {sec.items.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  className={`shell-nav-item ${active === m.key ? "active" : ""}`}
                  onClick={() => goNav(m.key)}
                >
                  <i className={`fa-solid ${m.icon || "fa-circle"}`}></i>
                  <span>{m.label}</span>
                  {m.locked && <i className="fa-solid fa-lock lock"></i>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div
          className={`shell-user ${profileKey ? "clickable" : ""}`}
          onClick={goProfile}
          title={profileKey ? "Lihat Profil" : undefined}
        >
          <span className="shell-user-av">{initials(user?.name)}</span>
          <span className="shell-user-tx">
            <strong>{user?.name || roleLabel}</strong>
            <small>{userSub || roleLabel}</small>
          </span>
        </div>
        <button type="button" className="shell-logout" onClick={doLogout}>
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>Keluar</span>
        </button>
      </aside>
      <div className="shell-main">
        <header className="shell-topbar">
          <button type="button" className="shell-hamburger" onClick={() => setNavOpen(true)} aria-label="Menu">
            <i className="fa-solid fa-bars"></i>
          </button>
          <div className="shell-topbar-tx">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <div className="shell-topbar-right">
            {periodeLabel && (
              <span className="shell-periode"><span className="dot"></span>{periodeLabel}</span>
            )}
            <NotifBell role={roleKey} ctx={{ user }} btnClass="shell-bell" onNavigate={onNavigate} />
            {profileKey ? (
              <span className="shell-avatar clickable" title="Lihat Profil" onClick={goProfile}>
                {initials(user?.name)}
              </span>
            ) : (
              <span className="shell-avatar" title="Keluar" onClick={doLogout}>
                {initials(user?.name)}
              </span>
            )}
          </div>
        </header>
        <main className="shell-content">{children}</main>
      </div>
    </div>
  );
}

export default AppShell;
