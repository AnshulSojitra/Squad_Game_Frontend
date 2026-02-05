import { useState } from "react";
import { Outlet } from "react-router-dom";
import UserSidebar from "../../components/sidebar/UserSidebar";
import UserHeader from "../../components/headers/UserHeader";

export default function UserLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
     {/* <UserSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      /> */}


      {/* Main */}
      <div className="flex flex-col flex-1">
        {/* <UserHeader/> */}

        <main className="flex-1 overflow-y-auto p-6 bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

