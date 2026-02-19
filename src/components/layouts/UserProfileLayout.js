import { Outlet } from "react-router-dom";
import UserProfileSidebar from "../../components/sidebar/UserProfileSidebar";
import Navbar from "../../components/common/Navbar";
import { useTheme } from "../../context/ThemeContext";

export default function UserProfileLayout() {
  const { isDarkMode } = useTheme();
  return (
    <div className={`min-h-screen py-20 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      {/* Top Navbar */}
      <Navbar />

      {/* Body */}
      <div className="max-w-7xl mx-auto mt-6 flex gap-6 px-4">
        {/* Sidebar */}
        <UserProfileSidebar />

        {/* Main Content */}
        <div className={`${isDarkMode ? 'flex-1 bg-gray-800 text-gray-100' : 'flex-1 bg-white text-gray-900'} rounded-xl shadow-lg p-6`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
