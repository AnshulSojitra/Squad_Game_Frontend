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
    return <p className="text-center mt-10 text-gray-300">Loading profile...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-xl mx-auto bg-gray-900 rounded-xl shadow-lg p-8">

        <h1 className="text-2xl font-bold text-white mb-6">
          Admin Profile
        </h1>

        <div className="space-y-4">
          <ProfileRow label="Name" value={admin.name} />
          <ProfileRow label="Email" value={admin.email} />
        </div>

      </div>
    </div>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div className="flex justify-between bg-gray-800 px-4 py-3 rounded-lg">
      <span className="text-gray-400 font-medium">{label}</span>
      <span className="text-white font-semibold">{value}</span>
    </div>
  );
}
