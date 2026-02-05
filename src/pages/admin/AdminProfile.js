import { useEffect, useState } from "react";
import { getAdminProfile } from "../../services/api";

export default function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getAdminProfile();
        setAdmin(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load admin profile");
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

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Profile</h1>
          <p className="text-gray-400">View and manage your admin account</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-700">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl text-white font-bold">
            {admin.name?.charAt(0)?.toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold text-white">{admin.name}</h2>
          <p className="text-gray-400">Administrator</p>
        </div>

        <div className="space-y-6">
          <ProfileRow label="Full Name" value={admin.name} icon="👤" />
          <ProfileRow label="Email Address" value={admin.email} icon="📧" />
          <ProfileRow label="Role" value="Administrator" icon="👑" />
          <ProfileRow label="Account Status" value="Active" icon="✅" />
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-gray-700/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-indigo-400">∞</div>
              <div className="text-sm text-gray-400">Access Level</div>
            </div>
            <div className="bg-gray-700/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-400">24/7</div>
              <div className="text-sm text-gray-400">Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileRow({ label, value, icon }) {
  return (
    <div className="flex items-center justify-between bg-gray-700/50 px-6 py-4 rounded-xl hover:bg-gray-700/70 transition-colors duration-200">
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="text-gray-300 font-medium">{label}</span>
      </div>
      <span className="text-white font-semibold">{value}</span>
    </div>
  );
}
