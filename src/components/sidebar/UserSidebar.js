import { Link, useLocation } from "react-router-dom";

export default function UserSidebar({ collapsed, setCollapsed }) {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/user/home", icon: "📊" },
    { name: "Book Slots", path: "/user/bookingslot", icon: "⏱️" },
    { name: "My Bookings", path: "/user/mybooking", icon: "📅" },
    { name: "Games", path: "/user/games", icon: "🎮" },
  ];

  return (
    <aside
      className={`bg-gray-950 border-r border-gray-800 transition-all duration-300
      ${collapsed ? "w-16" : "w-64"}`}
    >
      {/* TOP: Logo + Toggle */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
        {!collapsed && (
          // <span className="text-xl font-bold text-indigo-500" to="/">
          //   BoxArena
          // </span>
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-wide text-indigo-500 hover:text-indigo-400 transition"
          >
            BoxArena
          </Link>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white text-xl"
        >
          ☰
        </button>
      </div>

      {/* Menu */}
      <nav className="p-4 space-y-2">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
              ${
                location.pathname === item.path
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
          >
            <span>{item.icon}</span>
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

