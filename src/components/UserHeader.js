import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function UserHeader() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("userToken");

  const profileImg =
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  /* Close dropdown on outside click */
  useEffect(() => {
    const closeDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    navigate("/user/login");
  };

  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 px-6 flex items-center justify-between">
      
      {/* LEFT */}
      <div className="flex items-center gap-8">
        <Link
          to="/"
          className="text-xl font-bold text-indigo-500 hover:text-indigo-400 transition"
        >
          BoxArena
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/grounds"
            className="text-gray-300 hover:text-white text-sm font-medium"
          >
            Grounds
          </Link>

          {token && (
            <Link
              to="/user/mybookings"
              className="text-gray-300 hover:text-white text-sm font-medium"
            >
              My Bookings
            </Link>
          )}
        </nav>
      </div>

      {/* RIGHT */}
      {token ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 text-gray-200 hover:text-white"
          >
            <img
              src={profileImg}
              alt="User"
              className="w-9 h-9 rounded-full border border-gray-600"
            />
            <span className="text-sm font-medium">
              {user?.name || "User"}
            </span>
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
              <button
                onClick={() => navigate("/user/profile")}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                👤 View Profile
              </button>

              <button
                onClick={() => navigate("/user/mybookings")}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                📅 My Bookings
              </button>

              <hr />

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link
            to="/user/login"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold"
          >
            Login
          </Link>

          <Link
            to="/user/register"
            className="px-4 py-2 border border-indigo-600 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-lg text-sm font-semibold"
          >
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
}
