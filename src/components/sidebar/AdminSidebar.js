import { NavLink } from "react-router-dom";
import { PanelLeftClose } from "lucide-react";

export default function AdminSidebar({
  collapsed,
  setCollapsed,
  onItemClick,
  showMobileClose = false,
  onMobileClose,
}) {
  const isMobileDrawer = showMobileClose && !collapsed;

  return (
    <aside
      className={`bg-slate-900 text-white transition-all duration-500 ease-in-out shadow-2xl
      ${collapsed ? "w-16" : "w-64"}
      flex-shrink-0 backdrop-blur-sm
      ${isMobileDrawer ? "w-full rounded-r-3xl border-r border-slate-700/60" : ""}`}
    >
      {/* Top Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
        {!collapsed && (
          <div className="flex items-center gap-3">
            {/* <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">GO</span>
            </div> */}
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Ground Owner
            </span>
          </div>
        )}

        {/* Toggle Button */}
        <div className="flex items-center gap-2">
          {showMobileClose && (
            <button
              type="button"
              onClick={onMobileClose}
              className="w-10 h-10 rounded-2xl bg-slate-800/50 hover:bg-slate-700/70 text-slate-200 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
              aria-label="Close menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          <button
            type="button"
            onClick={() => setCollapsed?.(!collapsed)}
            className="hidden md:flex w-8 h-8 rounded-lg bg-slate-800/50 hover:bg-slate-700/70 text-slate-300 hover:text-white transition-all duration-300 items-center justify-center group shadow-md hover:shadow-lg"
            aria-label="Toggle collapse"
          >
            <span className={`text-sm transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}>
               <PanelLeftClose className="h-4 w-4" />
            </span>
          </button>
        </div>
      </div>

      {/* Menu */}
      <nav className={`mt-6 space-y-2 px-3 ${isMobileDrawer ? "pb-6" : ""}`}>
        <SidebarItem
          to="/admin/dashboard"
          label="Dashboard"
          emoji="📊"
          collapsed={collapsed}
          onItemClick={onItemClick}
        />

        <SidebarItem
          to="/admin/bookings"
          label="Bookings"
          emoji="📅"
          collapsed={collapsed}
          onItemClick={onItemClick}
        />

         {/* <SidebarItem
          to="/admin/games"
          label="Games"
          emoji="🎮"
          collapsed={collapsed}
        />  */}

        <SidebarItem
          to="/admin/grounds"
          label="Grounds"
          emoji="🏟️"
          collapsed={collapsed}
          onItemClick={onItemClick}
        />
      </nav>

      {/* Bottom decorative element */}
      <div className="mt-auto mb-4 px-3">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
      </div>
    </aside>
  );
}

function SidebarItem({ to, label, emoji, collapsed, onItemClick }) {
  return (
    <NavLink
      to={to}
      onClick={onItemClick}
      className={({ isActive }) =>
        `
        group relative flex items-center justify-center
        ${collapsed ? "px-0" : "px-4 justify-start"}
        py-3 rounded-xl transition-all duration-300 ease-in-out
        hover:scale-105 hover:shadow-lg

        ${isActive
          ? "bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-l-4 border-indigo-400 shadow-lg shadow-indigo-500/20"
          : "hover:bg-gradient-to-r hover:from-slate-800/60 hover:to-slate-700/60 hover:shadow-md"}
        `
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl blur-sm"></div>
          )}

          <div className="relative flex items-center gap-3">
            <span className={`text-xl transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
              {emoji}
            </span>
            {!collapsed && (
              <span className={`text-sm font-medium transition-all duration-300 ${
                isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
              }`}>
                {label}
              </span>
            )}
          </div>

          <div
            className={`absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-l-full transition-all duration-300 ${
              isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          />
        </>
      )}
    </NavLink>
  );
}
