import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminHeader() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const adminName = "Admin User";
  const profileImg =
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleLogout = () => {
     localStorage.removeItem("adminToken");
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b shadow-sm flex items-center justify-between px-6">
      {/* Left */}
      <div className="flex items-center gap-4">

        <h1 className="text-lg font-semibold">Squad Game Admin</h1>
      </div>

      {/* Right */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3"
        >
          <img
            src={profileImg}
            alt="Admin"
            className="w-9 h-9 rounded-full border"
          />
          <span className="hidden sm:block font-medium">{adminName}</span>
        </button>

        {open && (
          <div className="absolute right-0 mt-3 w-48 bg-white rounded-md shadow-lg z-50">
            <button
              onClick={() => navigate("/admin/profile")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              👤 View Profile
            </button>

            <button
              onClick={() => navigate("/admin/change-password")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              🔒 Change Password
            </button>

            <hr />

            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
