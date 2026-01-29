import { useEffect, useState } from "react";
import axios from "axios";
import { getUserProfile } from "../../services/api";
import BackButton from "../../components/common/BackButton";

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
<>
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
              alt="Super Admin"
              className="w-24 h-24 rounded-full border-4 border-white shadow-md"
            />
            <div>
              <h1 className="text-2xl font-bold">
                {user.name}
              </h1>
              <p className="opacity-90">Player</p>
            </div>
          </div>
        </div>

        {/* DETAILS */}
        <div className="p-8 space-y-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div>
              <label className="text-sm text-gray-500">Name</label>
              <p className="text-lg font-semibold text-gray-900">
                {user.name}
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="text-lg font-semibold text-gray-900">
                {user.email}
              </p>
            </div>

            {/* <div>
              <label className="text-sm text-gray-500">Phone Number : </label>
              <p className="inline-block px-4 py-1 mt-1 rounded-full
                             bg-indigo-100 text-indigo-700 font-semibold text-sm">
               9988223311
              </p>
            </div> */}

              <div>
              <label className="text-sm text-gray-500">Phone Number</label>
              <p className="text-lg font-semibold text-gray-900">
                {user.phoneNumber}
              </p>
            </div>

            {/* <div>
              <label className="text-sm text-gray-500">User ID</label>
              <p className="text-lg font-semibold text-gray-900">
                #{user.id}
              </p>
            </div> */}

          </div>

        </div>
      </div>
    </div>
</>
  );
}
