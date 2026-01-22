import { useEffect, useState } from "react";
import { getAdminProfile } from "../../services/api";
import BackButton from "../../components/common/BackButton";

export default function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <p className="text-center mt-10 text-white">
        Loading profile...
      </p>
    );
  }

  if (!profile) {
    return (
      <p className="text-center mt-10 text-red-500">
        Failed to load profile
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-10">
      {/* FLOATING BACK BUTTON */}
      <div className="absolute top-6 left-6 z-50">
        <BackButton />
      </div>
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
          <div className="flex items-center gap-6">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Admin"
              className="w-24 h-24 rounded-full border-4 border-white shadow-md"
            />
            <div>
              <h1 className="text-2xl font-bold">
                {profile.name}
              </h1>
              <p className="opacity-90">Administrator</p>
            </div>
          </div>
        </div>

        {/* DETAILS */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div>
              <label className="text-sm text-gray-500">Name</label>
              <p className="text-lg font-semibold text-gray-900">
                {profile.name}
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="text-lg font-semibold text-gray-900">
                {profile.email}
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Phone Number</label>
              <p className="text-lg font-semibold text-gray-900">
                {profile.phoneNumber}
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Role</label>
              <p className="inline-block px-4 py-1 mt-1 rounded-full
                             bg-blue-100 text-blue-700 font-semibold text-sm">
                Admin
              </p>
            </div>

            {/* <div>
              <label className="text-sm text-gray-500">Password</label>
              <p className="text-lg font-semibold text-gray-400 tracking-widest">
                ••••••••
              </p>
            </div> */}

          </div>
        </div>
      </div>
    </div>
  );
}
