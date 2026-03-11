import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useBoxArena } from "../../context/BoxArenaContext";
import BackButton from "../utils/BackButton";

export default function SuperAdminHeader({ onMenuClick }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const { logoutSuperAdmin, superAdminProfile } = useBoxArena();

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
    logoutSuperAdmin();
    navigate("/super-admin/login");
  };

  return (
    <header className="flex min-h-16 items-center justify-between gap-3 border-b bg-[#0b1220] px-3 py-3 text-white shadow sm:px-4 lg:px-6">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-800/70 text-slate-200 md:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden sm:block">
          <BackButton fallback="/super-admin/dashboard" />
        </div>
        <h1 className="truncate text-sm font-semibold sm:text-base lg:text-lg">
          BoxArena Super Admin
        </h1>
      </div>

      <div className="relative shrink-0" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 sm:gap-3"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Super Admin"
            className="h-8 w-8 rounded-full border sm:h-9 sm:w-9"
          />
          <span className="hidden font-medium sm:inline">{superAdminProfile?.name || "Super Admin"}</span>
        </button>

        {open && (
          <div className="absolute right-0 z-50 mt-3 w-44 rounded-md bg-white text-black shadow-lg sm:w-48">
            <button
              onClick={() => navigate("/super-admin/profile")}
              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              View Profile
            </button>

            <hr />

            <button
              onClick={handleLogout}
              className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
