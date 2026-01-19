import { useState } from "react";
import { Outlet } from "react-router-dom";
import SuperAdminSidebar from "../sidebar/SuperAdminSidebar";
import SuperAdminHeader from "../headers/SuperAdminHeader";

export default function SuperAdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Sidebar */}
      <SuperAdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        <SuperAdminHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
