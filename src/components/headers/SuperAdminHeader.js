import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SuperAdminHeader() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("superAdminToken");
    navigate("/super-admin/login");
  };

  return (
    <header className="h-16 bg-white flex items-center justify-between px-6 shadow">
      <h1 className="text-lg font-semibold">BoxArena Super Admin</h1>

      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Super Admin"
            className="w-9 h-9 rounded-full border"
          />
          <span className="font-medium">Super Admin</span>
        </button>

        {open && (
          <div className="absolute right-0 mt-3 w-48 bg-white rounded-md shadow-lg z-50">
            <button
              onClick={() => navigate("/super-admin/profile")}
              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              👤 View Profile
            </button>

            <hr />

            <button
              onClick={handleLogout}
              className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
