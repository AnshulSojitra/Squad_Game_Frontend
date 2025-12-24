import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";

export default function UserLayout() {
  return (
    <div className="flex min-h-screen bg-gray-900">
      <UserSidebar />

      <div className="flex-1 p-6 bg-gray-900">
        <Outlet />
      </div>
    </div>
  );
}
