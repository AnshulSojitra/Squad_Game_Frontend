import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAdmins, toggleAdminBlock , deleteAdminBySuperAdmin} from "../../services/api";
import Pagination from "../../components/utils/Pagination";
import ConfirmModal from "../../components/utils/ConfirmModal";
import { ShieldCheck, Activity, Search } from "lucide-react";




export default function SuperAdminAdmins() {
  const [admins, setAdmins] = useState([]);
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 10;
  const [page, setPage] = useState(1);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");


  // Filter admins based on search query
  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAdmins.length / ITEMS_PER_PAGE);

const paginatedAdmins = filteredAdmins.slice(
  (page - 1) * ITEMS_PER_PAGE,
  page * ITEMS_PER_PAGE
);


  /* ---------------- Toggle Component ---------------- */
  function ToggleSwitch({ enabled, onToggle }) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation(); // 🚨 stop row click
          onToggle();
        }}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition
          ${enabled ? "bg-red-500" : "bg-green-500"}
        `}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition
            ${enabled ? "translate-x-6" : "translate-x-1"}
          `}
        />
      </button>
    );
  }

  /* ---------------- Fetch Admins ---------------- */
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await getAllAdmins();
      setAdmins(res.data.admins);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- Toggle Block / Unblock ---------------- */
  const handleToggleBlock = async (admin) => {
    try {
      await toggleAdminBlock(admin.id);

      // Optimistic UI update
      setAdmins((prev) =>
        prev.map((a) =>
          a.id === admin.id
            ? { ...a, isBlocked: !a.isBlocked }
            : a
        )
      );
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

 /* ---------------- Delete admin  ---------------- */

    const openDeleteConfirm = (e, adminId) => {
      e.stopPropagation(); // 🚫 prevent card navigation
      setSelectedAdminId(adminId);
      setConfirmOpen(true);
    };
    
    const handleConfirmDelete = async () => {
      if (!selectedAdminId) return;

      try {
        setLoadingId(selectedAdminId);
        await deleteAdminBySuperAdmin(selectedAdminId);
        await fetchAdmins(); // refresh list
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete admin");
      } finally {
        setLoadingId(null);
        setConfirmOpen(false);
        setSelectedAdminId(null);
      }
    };
    
    const handleCancelDelete = () => {
      setConfirmOpen(false);
      setSelectedAdminId(null);
    };


  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Ground Owner Management</h1>
          <p className="text-gray-400">Manage and monitor all admin accounts</p>
        </div>

        <button
          onClick={() => navigate("/super-admin/admins/create")}
          className="
            inline-flex items-center gap-2
            bg-gradient-to-r from-blue-600 to-indigo-600
            hover:from-blue-700 hover:to-indigo-700
            text-white px-6 py-3 rounded-xl
            text-sm font-semibold
            shadow-lg hover:shadow-xl
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            transform hover:scale-105
          "
        >
          <span className="text-lg leading-none">+</span>
          Add New Admin
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Ground Owner</p>
              <p className="text-2xl font-bold text-white">{filteredAdmins.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Activity className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Ground Owner</p>
              <p className="text-2xl font-bold text-white">
                {filteredAdmins.filter(admin => !admin.isBlocked).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Blocked Ground Owner</p>
              <p className="text-2xl font-bold text-white">
                {filteredAdmins.filter(admin => admin.isBlocked).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search admins by name or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1); // Reset to first page when searching
            }}
            className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">All Ground Owner</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Admin Details
                </th>
                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Play Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700">
              {paginatedAdmins.map((admin, index) => (
                <tr
                  key={admin.id}
                  onClick={() => navigate(`/super-admin/admins/${admin.id}`)}
                  className="hover:bg-slate-700/30 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 text-sm text-gray-400 font-medium">
                    {(page - 1) * ITEMS_PER_PAGE + index + 1}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name)}&background=random`}
                        alt={admin.name}
                        className="w-10 h-10 rounded-full border-2 border-slate-600"
                      />
                      <div>
                        <p className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {admin.name}
                        </p>
                        <p className="text-sm text-gray-400">{admin.email}</p>
                      </div>
                    </div>
                  </td>

                 <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {admin.planType}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {admin.role}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          admin.isBlocked
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : "bg-green-500/20 text-green-300 border border-green-500/30"
                        }`}
                      >
                        {admin.isBlocked ? "Blocked" : "Active"}
                      </span>

                      <ToggleSwitch
                        enabled={admin.isBlocked}
                        onToggle={() => handleToggleBlock(admin)}
                      />
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/super-admin/admins/${admin.id}`);
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors"
                      >
                        View
                      </button>

                      <button
                        onClick={(e) => openDeleteConfirm(e, admin.id)}
                        disabled={loadingId === admin.id}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                          loadingId === admin.id
                            ? "bg-red-500/50 text-red-300 cursor-not-allowed"
                            : "bg-red-500/10 text-red-300 border border-red-500/20 hover:bg-red-500/20"
                        }`}
                      >
                        {loadingId === admin.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredAdmins.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <ShieldCheck className="w-12 h-12 text-gray-500" />
                      <p className="text-gray-400">
                        {searchQuery ? "No admins found matching your search" : "No admins found"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {searchQuery ? "Try adjusting your search terms" : "Get started by adding your first admin"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredAdmins.length > 0 && (
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
        isOpen={confirmOpen}
        title="Delete Admin"
        message="Are you sure you want to delete this admin? All associated data will be permanently removed."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
