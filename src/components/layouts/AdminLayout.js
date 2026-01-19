import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../sidebar/AdminSidebar";
import AdminHeader from "../headers/AdminHeader";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 p-6 text-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
