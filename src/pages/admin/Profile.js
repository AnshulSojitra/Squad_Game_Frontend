import { useEffect, useState } from "react";
import { getAdminProfile } from "../../services/api";
import BackButton from "../../components/utils/BackButton";
import { useNavigate } from "react-router-dom";

export default function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getAdminProfile();
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load admin profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">👤</div>
        <p className="text-gray-400 text-lg">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in bg-gray-900 min-h-screen pt-10 pb-16 px-4 sm:px-6 lg:px-8 text-white">
      {/* FLOATING BACK BUTTON */}
      <div className="absolute top-6 left-6 z-50">
        <BackButton />
      </div>

      <div className="max-w-3xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-700">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white/30">
              {profile.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {profile.name}
              </h1>
              <p className="opacity-90 text-lg">Administrator</p>
            </div>
          </div>
        </div>

        {/* DETAILS */}
        <div className="p-8 space-y-6">
          <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div className="p-4 bg-gray-700/50 rounded-xl">
              <label className="text-sm text-gray-400 block mb-2">Full Name</label>
              <p className="text-lg font-semibold text-white flex items-center gap-2">
                <span>👤</span>
                {profile.name}
              </p>
            </div>

            <div className="p-4 bg-gray-700/50 rounded-xl">
              <label className="text-sm text-gray-400 block mb-2">Email Address</label>
              <p className="text-lg font-semibold text-white flex items-center gap-2">
                <span>📧</span>
                {profile.email}
              </p>
            </div>

            <div className="p-4 bg-gray-700/50 rounded-xl">
              <label className="text-sm text-gray-400 block mb-2">Phone Number</label>
              <p className="text-lg font-semibold text-white flex items-center gap-2">
                <span>📞</span>
                {profile.phoneNumber || "Not provided"}
              </p>
            </div>

            <div className="p-4 bg-gray-700/50 rounded-xl">
              <label className="text-sm text-gray-400 block mb-2">Role</label>
              <p className="inline-flex items-center gap-2 px-4 py-2 mt-1 rounded-full bg-blue-500/20 text-blue-300 font-semibold text-sm border border-blue-500/30">
                <span>👑</span>
                Administrator
              </p>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-700">
            {/* <button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
              Edit Profile
            </button> */}
            <button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
               onClick={() => navigate("/admin/change-password")}
               >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
