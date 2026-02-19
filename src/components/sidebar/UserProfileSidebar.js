import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserProfile } from "../../services/api";


import { useTheme } from "../../context/ThemeContext";

export default function UserProfileSidebar() {
  const { isDarkMode } = useTheme();
//   const user = {
//     name: "Niraj Soni",
//     email: "soniniraj369@gmail.com",
//     phone: "9327639991",
//   };
 const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserProfile();
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

    if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load profile
      </div>
    );
  }

  return (
    <div className={`w-72 rounded-xl shadow-lg p-4 ${isDarkMode ? 'bg-gray-800 border border-gray-700 text-gray-200' : 'bg-white border border-gray-200 text-gray-900'}`}>
      
      {/* User Info */}
      <div className="flex flex-col items-center text-center mb-6">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="user"
          className="w-20 h-20 rounded-full mb-3 border-2 border-gray-600"
        />
        <h3 className="font-semibold text-white">{user.name}</h3>
        <p className="text-sm text-gray-400">{user.email}</p>
        <p className="text-sm text-gray-400">{user.phoneNumber}</p>
      </div>

      {/* Menu */}
      <nav className="space-y-2">
        <NavLink
          to="/profile/profile"
          className={({ isActive }) =>
            `block px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`
          }
        >
          My Profile
        </NavLink>
        <NavLink
          to="/profile/mybooking"
          className={({ isActive }) =>
            `block px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`
          }
        >
          All Bookings
        </NavLink>

        <NavLink
          to="/profile/edit"
          className={({ isActive }) =>
            `block px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`
          }
        >
          Edit Profile
        </NavLink>

        <NavLink
          to="/profile/feedback"
          className={({ isActive }) =>
            `block px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`
          }
        >
          Feedback
        </NavLink>
      </nav>
    </div>
  );
}
