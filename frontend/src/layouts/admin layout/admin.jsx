import Sidebar from "../../components/admin/sidebar";

function AdminLayout({ children }) {
    return (
        <div className="admin-layout">
            <Sidebar />
            <main>
               
                {children}
            </main>
        </div>
    );
}

export default AdminLayout;