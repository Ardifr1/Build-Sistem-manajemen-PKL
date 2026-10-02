import Sidebar from "../../components/admin/sidebar";
import "./admin.css";

function AdminLayout({ active = "dashboard", onNavigate, children }) {
  return (
    <div className="admin-layout">
      <Sidebar active={active} onNavigate={onNavigate} />
      <main className="admin-main">{children}</main>
    </div>
  );
}

export default AdminLayout;
