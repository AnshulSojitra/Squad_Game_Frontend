import { NavLink } from "react-router-dom";

const menuItems = [
   { to: "/super-admin/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/super-admin/users", label: "Users", icon: "👥" },
  { to: "/super-admin/admins", label: "Ground Owner", icon: "🛡️" },
  { to: "/super-admin/grounds", label: "Grounds", icon: "🏟️" },
  { to: "/super-admin/bookings", label: "Bookings", icon: "📅" },
];

export default function SuperAdminSidebar({ collapsed, setCollapsed }) {
  return (
    <aside
      className={`bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white transition-all duration-500 ease-in-out shadow-2xl border-r border-slate-700/50
      ${collapsed ? "w-20" : "w-64"}
      flex flex-col backdrop-blur-sm`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
        {!collapsed && (
          <div className="flex items-center gap-3">
            {/* <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">SA</span>
            </div> */}
            <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Super Admin
            </span>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 h-8 rounded-lg bg-slate-800/50 hover:bg-slate-700/70 text-slate-300 hover:text-white transition-all duration-300 flex items-center justify-center group shadow-md hover:shadow-lg"
        >
          <span className={`text-sm transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}>
            {collapsed ? '=' : '='}
          </span>
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `
              group relative flex items-center justify-center
              ${collapsed ? "px-0" : "px-4 justify-start"}
              py-3 rounded-xl transition-all duration-300 ease-in-out
              hover:scale-105 hover:shadow-lg

              ${isActive
                ? "bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border-l-4 border-emerald-400 shadow-lg shadow-emerald-500/20"
                : "hover:bg-gradient-to-r hover:from-slate-800/60 hover:to-slate-700/60 hover:shadow-md"}
              `
            }
          >
            {/* Active indicator glow */}
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl blur-sm"></div>
                )}

                <div className="relative flex items-center gap-3">
                  <span className={`text-xl transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className={`text-sm font-medium transition-all duration-300 ${
                      isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                    }`}>
                      {item.label}
                    </span>
                  )}
                </div>

                {/* Hover effect line */}
                <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-l-full transition-all duration-300 ${
                  ({ isActive }) => isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}></div>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom decorative element */}
      <div className="mt-auto mb-4 px-3">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
      </div>
    </aside>
  );
}
