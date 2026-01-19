import { NavLink } from "react-router-dom";

export default function AdminSidebar({ collapsed, setCollapsed }) {
  return (
    <aside
      className={`bg-[#0b1220] text-white transition-all duration-300
      ${collapsed ? "w-16" : "w-64"}
      flex-shrink-0`}
    >
      {/* Top Section */}
      <div className="h-16 flex items-center justify-between px-3 border-b border-white/10">
        {!collapsed && (
          <span className="text-lg font-bold">Dashboard</span>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-xl font-bold focus:outline-none"
        >
          ☰
        </button>
      </div>

      {/* Menu */}
      <nav className="mt-4 space-y-1 px-2">
  <SidebarItem
    to="/admin/dashboard"
    label="📊 Dashboard"
    emoji="📊"
    collapsed={collapsed}
  />

  <SidebarItem
    to="/admin/bookings"
    label="📅 Bookings"
    emoji="📅"
    collapsed={collapsed}
  />

  <SidebarItem
    to="/admin/games"
    label="🎮 Games"
    emoji="🎮"
    collapsed={collapsed}
  />

  <SidebarItem
    to="/admin/grounds"
    label="🏟️ Grounds"
    emoji="🏟️"
    collapsed={collapsed}
  />
</nav>

    </aside>
  );
}
function SidebarItem({ to, label,emoji, collapsed }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        flex items-center justify-center
        ${collapsed ? "px-0" : "px-4 justify-start"}
        py-3 rounded-lg transition-all

        ${isActive
          ? "bg-white/10 border-l-4 border-white"
          : "hover:bg-white/5"}
        `
      }
    >
       {collapsed ? (
        <span className="text-xl">{emoji}</span>
      ) : (
        <span className="text-sm">{label}</span>
      )}
    </NavLink>
  );
}
