import Sidebar from "../../components/admin/sidebar";
import Topbar from "../../components/admin/Topbar.jsx";
import "../admin layout/admin.css";

/**
 * Layout generik untuk dashboard role (guru / industri).
 * Memakai ulang gaya sidebar, topbar, dan konten ala admin.
 */
function RoleLayout({
  menus,
  roleLabel,
  orgLabel,
  active,
  onNavigate,
  title,
  subtitle,
  children,
}) {
  return (
    <div className="admin-layout">
      <Sidebar
        active={active}
        onNavigate={onNavigate}
        menus={menus}
        roleLabel={roleLabel}
        orgLabel={orgLabel}
      />
      <div className="admin-right">
        <Topbar title={title} subtitle={subtitle || ""} />
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}

export default RoleLayout;
