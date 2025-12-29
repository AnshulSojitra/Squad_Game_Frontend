import { Link, useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";

export default function AdminSidebar({ isCollapsed }) {
  const location = useLocation();

  const linkClass = ({ isActive }) =>
    `flex items-center px-4 py-2 rounded-lg transition-all duration-200
     ${
       isActive
         ? "border-l-4 border-white bg-gray-800 text-white"
         : "text-gray-300 hover:bg-gray-700 hover:text-white"
     }`;

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
       <NavLink to="/admin/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/admin/bookings" className={linkClass}>
          Bookings
        </NavLink>

        <NavLink to="/admin/games" className={linkClass}>
          Games
        </NavLink>

        <NavLink to="/admin/grounds" className={linkClass}>
          Grounds
        </NavLink>
      </nav>
    </div>
  );
}
