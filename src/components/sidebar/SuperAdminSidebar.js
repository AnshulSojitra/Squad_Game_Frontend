import { NavLink } from "react-router-dom";

const menuItems = [
  { to: "/super-admin/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/super-admin/users", label: "Users", icon: "👥" },
  { to: "/super-admin/admins", label: "Admins", icon: "🛡️" },
  { to: "/super-admin/grounds", label: "Grounds", icon: "🏟️" },
  { to: "/super-admin/bookings", label: "Bookings", icon: "📅" },
];

export default function SuperAdminSidebar({ collapsed, setCollapsed }) {
  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-slate-950 text-white transition-all duration-300 flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-slate-800">
        {!collapsed && (
          <span className="text-xl font-bold text-indigo-500">
            BoxArena
          </span>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-300 hover:text-white"
        >
          ☰
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
              ${
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-gray-400 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
