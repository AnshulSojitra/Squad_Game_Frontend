import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white transition-all duration-300 
        ${isCollapsed ? "w-16" : "w-64"} flex-shrink-0`}
      >
        <AdminSidebar isCollapsed={isCollapsed} />
      </aside>

      {/* Right Side */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        <main className="flex-1 overflow-y-auto bg-gray-900 p-6 text-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
