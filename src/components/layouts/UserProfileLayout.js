import { Outlet } from "react-router-dom";
import UserProfileSidebar from "../../components/sidebar/UserProfileSidebar";
import Navbar from "../../components/common/Navbar";

export default function UserProfileLayout() {
  return (
    <div className="min-h-screen bg-gray-900 py-20">
      {/* Top Navbar */}
      <Navbar />

      {/* Body */}
      <div className="max-w-7xl mx-auto mt-6 flex gap-6 px-4">
        {/* Sidebar */}
        <UserProfileSidebar />

        {/* Main Content */}
        <div className="flex-1 bg-gray-800 rounded-xl shadow-lg p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
