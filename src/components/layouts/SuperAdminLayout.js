import { useState } from "react";
import { Outlet } from "react-router-dom";
import SuperAdminSidebar from "../sidebar/SuperAdminSidebar";
import SuperAdminHeader from "../headers/SuperAdminHeader";

export default function SuperAdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
      <SuperAdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <SuperAdminHeader onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
