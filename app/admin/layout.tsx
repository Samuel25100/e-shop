import AdminSidebar from "../components/admin_sidebar";
import AdminHeader from "../components/admin_header";
import "./layout.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-container">
          <AdminSidebar />
        <main className="main-content">
            <AdminHeader />
            {children}
        </main>
    </div>
    );
}