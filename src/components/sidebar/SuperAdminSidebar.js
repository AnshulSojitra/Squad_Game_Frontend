import { NavLink } from "react-router-dom";
import {
  Grid2x2,
  MapPin,
  NotebookTabs,
  PanelLeftClose,
  PanelLeftOpen,
  Shield,
  Trophy,
  Users,
  X,
} from "lucide-react";

const menuItems = [
  { to: "/super-admin/dashboard", label: "Dashboard", icon: Grid2x2 },
  { to: "/super-admin/users", label: "Users", icon: Users },
  { to: "/super-admin/admins", label: "Ground Owner", icon: Shield },
  { to: "/super-admin/grounds", label: "Grounds", icon: MapPin },
  { to: "/super-admin/games", label: "Tournaments", icon: Trophy },
  { to: "/super-admin/bookings", label: "Bookings", icon: NotebookTabs },
];

export default function SuperAdminSidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const showLabels = !collapsed || mobileOpen;

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/72 backdrop-blur-sm md:hidden"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex max-w-[85vw] flex-col overflow-hidden border-r border-cyan-950/50 bg-slate-900 text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)] transition-transform duration-300 md:static md:z-auto md:max-w-none md:translate-x-0 ${
          collapsed ? "w-20 md:w-20" : "w-64 md:w-64"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <div className="min-w-0">
            {showLabels ? (
              <span className="truncate text-[1.25rem] font-extrabold tracking-[-0.03em] text-transparent bg-gradient-to-r from-[#33f4c9] to-[#1de9c4] bg-clip-text sm:text-[1.7rem]">
                Super Admin
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden h-8 w-8 items-center justify-center rounded-xl border border-white/6 bg-white/5 text-slate-300 transition-all duration-200 hover:border-[#25e9c6]/20 hover:bg-white/10 hover:text-white md:flex"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/6 bg-white/5 text-slate-300 transition-all duration-200 hover:border-[#25e9c6]/20 hover:bg-white/10 hover:text-white md:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-7">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
              >
                {({ isActive }) => (
                  <div
                    className={`group relative flex min-h-[58px] items-center overflow-hidden rounded-[18px] transition-all duration-300 ${
                      showLabels ? "justify-start px-5" : "justify-center px-0"
                    } ${
                      isActive
                        ? "bg-[linear-gradient(90deg,rgba(33,151,144,0.48)_0%,rgba(14,72,94,0.58)_100%)] shadow-[0_0_28px_rgba(20,224,197,0.18)]"
                        : "hover:bg-white/[0.04]"
                    }`}
                  >
                    {isActive ? (
                      <>
                        <div className="absolute bottom-1 top-1 left-0 w-1 rounded-r-full bg-[#25e9c6]" />
                        <div className="absolute bottom-2 top-2 right-0 w-1 rounded-l-full bg-[#25e9c6]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,233,198,0.08),transparent_72%)]" />
                      </>
                    ) : null}

                    <div className="relative flex items-center gap-4">
                      <Icon
                        strokeWidth={1.9}
                        className={`h-[22px] w-[22px] transition-colors duration-200 ${
                          isActive
                            ? "text-[#9ef7ea]"
                            : "text-slate-300 group-hover:text-white"
                        }`}
                      />
                      {showLabels ? (
                        <span
                          className={`text-[1.06rem] font-semibold tracking-[-0.02em] ${
                            isActive
                              ? "text-white"
                              : "text-slate-300 group-hover:text-white"
                          }`}
                        >
                          {item.label}
                        </span>
                      ) : null}
                    </div>
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
