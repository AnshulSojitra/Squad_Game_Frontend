import { Link } from "react-router-dom";
import { useState } from "react";

export default function UserSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`h-screen bg-gray-900 text-white transition-all duration-300 
      ${collapsed ? "w-16" : "w-64"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && (
          <span className="text-lg font-bold">User Panel</span>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-300 hover:text-white"
        >
          ☰
        </button>
      </div>

      {/* Links */}
      <nav className="p-4 flex flex-col gap-4">
        <Link
          to="/user/home"
          className="flex items-center gap-3 hover:bg-gray-800 p-2 rounded"
        >
          🏠 {!collapsed && "Home"}
        </Link>

        <Link
          to="/user/mybooking"
          className="flex items-center gap-3 hover:bg-gray-800 p-2 rounded"
        >
          📅 {!collapsed && "My Booking"}
        </Link>

        <Link
          to="/user/bookingslot"
          className="flex items-center gap-3 hover:bg-gray-800 p-2 rounded"
        >
          ⏱ {!collapsed && "Booking Slots"}
        </Link>

        <Link
          to="/user/games"
          className="flex items-center gap-3 hover:bg-gray-800 p-2 rounded"
        >
          🎮 {!collapsed && "Games"}
        </Link>
      </nav>
    </aside>
  );
}
