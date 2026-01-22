import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../../services/api";
import BackButton from "../common/BackButton";

export default function UserHeader({ collapsed, setCollapsed }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("userToken");

  /* ================= FETCH USER ================= */
  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await getUserProfile();
        setUser(res.data);

        // optional but recommended
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (error) {
        console.error("Failed to fetch user profile");
      }
    };

    fetchUser();
  }, [token]);

  /* ================= CLOSE DROPDOWN ================= */
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
  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="h-16 bg-[#0b1220] border-b shadow-sm flex items-center justify-between px-6 text-white">
      <BackButton/>
      
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">BoxArena User</h1>
      </div>

      {/* RIGHT */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            className="w-9 h-9 rounded-full border"
            alt="user"
          />

          <span className="font-medium">
            {user?.name || "User"}
          </span>
        </button>

        {open && (
          <div className="absolute right-0 mt-3 w-48 bg-white rounded-md shadow-lg z-50 text-black">
            <button
              onClick={() => navigate("/user/profile")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              👤 View Profile
            </button>

            <button
              onClick={() => navigate("/user/mybooking")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              📅 My Bookings
            </button>

          <button
              onClick={() => navigate("/user/change-password")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              🔒 Change Password
            </button>

            <hr />

            <button
              onClick={logout}
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
