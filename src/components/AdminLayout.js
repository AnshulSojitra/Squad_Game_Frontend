import AdminSidebar from "./AdminSidebar";

import React from "react";
import { Outlet } from "react-router-dom";

export const AdminLayout = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 min-h-screen bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};
