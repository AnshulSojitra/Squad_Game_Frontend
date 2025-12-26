import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar({ isCollapsed }) {
  const location = useLocation();

  const menuItem = (to, icon, label) => (
    <Link
      to={to}
      className={`flex items-center gap-3 p-2 rounded hover:bg-gray-800
      ${location.pathname === to ? "bg-gray-800" : ""}`}
    >
      <span className="text-lg">{icon}</span>
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );

  return (
    <div className="h-full">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-700">
        {!isCollapsed && (
          <span className="text-lg font-bold">Dashboard</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-4 flex flex-col gap-3">
        {menuItem("/admin/dashboard", "📊", "Dashboard")}
        {menuItem("/admin/bookings", "📅", "Bookings")}
        {menuItem("/admin/games", "🎮", "Games")}
        {menuItem("/admin/grounds", "🏟", "Grounds")}
      </nav>
    </div>
  );
}
