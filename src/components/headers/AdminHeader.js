import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminProfile } from "../../services/api";
import BackButton from "../common/BackButton";

export default function AdminHeader() {
  const [open, setOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const profileImg =
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  /* ================= FETCH ADMIN PROFILE ================= */
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await getAdminProfile();
        setAdmin(res.data);

        // optional: cache for reuse
        localStorage.setItem("admin", JSON.stringify(res.data));
      } catch (err) {
        console.error("Failed to fetch admin profile", err);
      }
    };

    fetchAdmin();
  }, []);

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
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/");
  };

  return (
    <header className="h-16 bg-[#0b1220] border-b shadow-sm flex items-center justify-between px-6 text-white">
      <BackButton />
      {/* Left */}
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold"> Ground Owner</h1>
      </div>

      {/* Right */}
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
          <span className="font-medium text-white">
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
