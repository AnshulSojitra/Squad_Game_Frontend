import { useEffect, useState } from "react";
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* FLOATING BACK BUTTON */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-50">
          <BackButton />
        </div>
        <div className="max-w-3xl mx-auto bg-white rounded-xl lg:rounded-2xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6 lg:p-8 text-white">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="User"
              className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full border-2 sm:border-4 border-white shadow-md"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                {user.name}
              </h1>
              <p className="opacity-90 text-sm sm:text-base">Player</p>
            </div>
          </div>
        </div>

        {/* DETAILS */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

            <div>
              <label className="text-xs sm:text-sm text-gray-500 block mb-1">Name</label>
              <p className="text-base sm:text-lg font-semibold text-gray-900">
                {user.name}
              </p>
            </div>

            <div>
              <label className="text-xs sm:text-sm text-gray-500 block mb-1">Email</label>
              <p className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                {user.email}
              </p>
            </div>

            <div>
              <label className="text-xs sm:text-sm text-gray-500 block mb-1">Phone Number</label>
              <p className="text-base sm:text-lg font-semibold text-gray-900">
                {user.phoneNumber}
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
</>
  );
}
