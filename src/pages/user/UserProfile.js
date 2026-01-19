import { useEffect, useState } from "react";
import axios from "axios";
import { getUserProfile } from "../../services/api";

export default function UserProfile() {
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
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">
        👤 User Profile
      </h1>

      <div className="bg-gray-900 rounded-xl shadow-lg p-8 flex gap-6">
        {/* Avatar */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="User"
          className="w-24 h-24 rounded-full border-4 border-indigo-500"
        />

        {/* Details */}
        <div className="flex-1 space-y-4">
          <ProfileRow label="User ID" value={user.id} />
          <ProfileRow label="Name" value={user.name} />
          <ProfileRow label="Email" value={user.email} />
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable Row ---------- */
function ProfileRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-gray-800 pb-2">
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}
