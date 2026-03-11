import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBoxArena } from "../../context/BoxArenaContext";
import BackButton from "../utils/BackButton";

export default function AdminHeader({ onMenuClick }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { adminProfile: admin, logoutAdmin } = useBoxArena();

  const profileImg =
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  /* ================= CLOSE DROPDOWN ON OUTSIDE CLICK ================= */
  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    logoutAdmin();
    navigate("/");
  };

  return (
    <header className="h-16 bg-[#0b1220] border-b shadow-sm flex items-center justify-between px-4 sm:px-6 text-white">
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
          aria-label="Open menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="hidden sm:block">
          <BackButton />
        </div>
        <h1 className="text-sm sm:text-lg font-semibold truncate">Ground Owner</h1>
      </div>

      {/* Left */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3"
        >
          {/* Avatar */}
          <img
            src={profileImg}
            alt="Admin"
            className="w-9 h-9 rounded-full border"
          />

          {/* Admin Name */}
          <span className="hidden sm:inline font-medium text-white">
            {admin ? admin.name : "Admin"}
          </span>
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-3 w-48 bg-white rounded-md shadow-lg z-50 text-black">
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
