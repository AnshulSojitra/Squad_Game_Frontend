import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllUsers,
  toggleUserBlock,
  deleteUser
} from "../../services/api";
import Pagination from "../../components/utils/Pagination";
import ToggleSwitch from "../../components/utils/ToggleSwitch";
import { Users, UserCheck, UserX, Search } from "lucide-react";
import ConfirmModal from "../../components/utils/ConfirmModal";


export default function SuperAdminUsers() {
  const [users, setUsers] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 10;
  const [page, setPage] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
const [selectedUserId, setSelectedUserId] = useState(null);


  /* ---------------- Fetch Users ---------------- */
  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data.users);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (user) => {
    try {
      setLoadingId(user.id);
      await toggleUserBlock(user.id);
      await fetchUsers();
    } catch (error) {
      console.error("Block/unblock failed", error);
    } finally {
      setLoadingId(null);
    }
  };

  //----------------- Delete User------------------------//
//   const handleDeleteUser = async (userId) => {
//   const confirmed = window.confirm(
//     "⚠️ Are you sure?\nThis will permanently delete the user and all related data."
//   );

//   if (!confirmed) return;

//   try {
//     await deleteUser(userId);
//     await fetchUsers(); // refresh list
//   } catch (error) {
//     console.error("Failed to delete user", error);
//     alert("Failed to delete user");
//   }
// };

const handleDeleteUser = (userId) => {
  setSelectedUserId(userId);
  setShowConfirm(true);
};

const confirmDelete = async () => {
  try {
    await deleteUser(selectedUserId);
    await fetchUsers();
  } catch (error) {
    console.error("Failed to delete user", error);
    alert("Failed to delete user");
  } finally {
    setShowConfirm(false);
    setSelectedUserId(null);
  }
};


  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const stats = {
    total: users.length,
    active: users.filter(u => !u.isBlocked).length,
    blocked: users.filter(u => u.isBlocked).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-400">Monitor and manage all platform users</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <UserCheck className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Users</p>
              <p className="text-2xl font-bold text-white">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <UserX className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Blocked Users</p>
              <p className="text-2xl font-bold text-white">{stats.blocked}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">All Users</h2>

          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50 text-center">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">#</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">User Details</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700">
              {paginatedUsers.map((user, index) => (
                <tr
                  key={user.id}
                  onClick={() => navigate(`/super-admin/users/${user.id}/bookings`)}
                  className="hover:bg-slate-700/30 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 text-sm text-gray-400 font-medium">
                    {(page - 1) * ITEMS_PER_PAGE + index + 1}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                        alt={user.name}
                        className="w-10 h-10 rounded-full border-2 border-slate-600"
                      />
                      <div>
                        <p className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 capitalize">
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          user.isBlocked
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : "bg-green-500/20 text-green-300 border border-green-500/30"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>

                      {loadingId === user.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                      ) : (
                        <ToggleSwitch
                          enabled={user.isBlocked}
                          onToggle={() => handleToggleBlock(user)}
                        />
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/super-admin/users/${user.id}/bookings`);
                      }}
                      className="px-3 py-1.5 text-xs font-medium text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors mt-2 ml-2"
                    >
                      View Bookings
                    </button>
                    {/* <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteUser(user.id);
                      }}
                      className="px-3 py-1.5 text-xs font-medium text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors mt-2 ml-2"
                    >
                      Delete
                    </button> */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteUser(user.id);
                      }}
                       className="px-3 py-1.5 text-xs font-medium text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors mt-2 ml-2"
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              ))}

              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Users className="w-12 h-12 text-gray-500" />
                      <p className="text-gray-400">
                        {searchTerm ? "No users found matching your search" : "No users found"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {searchTerm ? "Try adjusting your search terms" : "Users will appear here once registered"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {paginatedUsers.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-700 bg-slate-800/30">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
      <ConfirmModal
        isOpen={showConfirm}
        title="Delete User?"
        message=" This will permanently delete the user and all related data. This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowConfirm(false);
          setSelectedUserId(null);
        }}
      />

    </div>
  );
}
