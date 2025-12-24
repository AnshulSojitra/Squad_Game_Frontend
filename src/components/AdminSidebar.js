import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-900 text-white">
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        Dashboard
      </div>

      <nav className="p-4 flex flex-col gap-4">
        <Link to="/admin/AdminLogin" className="sidebar-link">
          Home
        </Link>
        <Link to="/admin/dashboard" className="sidebar-link">
          Dashboard
        </Link>
        <Link to="/admin/users" className="sidebar-link">
          Users
        </Link>
        <Link to="/admin/settings" className="sidebar-link">
          Settings
        </Link>
      </nav>
    </aside>
  );
}
