import { useEffect } from "react";
import { useBoxArena } from "../../context/BoxArenaContext";
import { User, Mail, Shield, Hash, Calendar } from "lucide-react";

export default function SuperAdminProfile() {
  const { superAdminProfile: profile, loading, refreshSuperAdminProfile } = useBoxArena();

  useEffect(() => {
    if (!profile) {
      refreshSuperAdminProfile();
    }
  }, []);

  if (loading.superAdminProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-2">Failed to load profile</div>
          <p className="text-gray-400">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your super administrator account</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-slate-700 p-4 sm:p-8">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="relative">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=6366f1&color=fff&size=96`}
                alt="Super Admin"
                className="w-24 h-24 rounded-full border-4 border-slate-600 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1 sm:text-3xl">
                {profile.name}
              </h1>
              <p className="text-gray-400 text-lg">Super Administrator</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-green-400">Active Account</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-4 sm:p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4">Personal Information</h2>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Full Name</p>
                    <p className="text-lg font-semibold text-white">{profile.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <Mail className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email Address</p>
                    <p className="text-lg font-semibold text-white">{profile.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4">Account Information</h2>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Shield className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Role</p>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-sm font-semibold">
                        Super Admin
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg">
                  <div className="p-3 bg-orange-500/20 rounded-lg">
                    <Hash className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">User ID</p>
                    <p className="text-lg font-semibold text-white">#{profile.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div className="mt-8 pt-8 border-t border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-6">Account Overview</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Member Since</p>
                    <p className="text-lg font-bold text-white">2024</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <Shield className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Access Level</p>
                    <p className="text-lg font-bold text-white">Full</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <User className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Account Status</p>
                    <p className="text-lg font-bold text-white">Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
