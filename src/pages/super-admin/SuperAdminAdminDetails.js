import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdminGrounds, toggleGroundBlock, deleteGroundBySuperAdmin } from "../../services/api";
import ToggleSwitch from "../../components/common/ToggleSwitch";
import Pagination from "../../components/common/Pagination";
import ConfirmModal from "../../components/common/ConfirmModal";
import { ArrowLeft, User, MapPin, Phone, Mail, Building2, DollarSign, Calendar, Trash2, Eye, Search } from "lucide-react";

export default function SuperAdminAdminDetails() {
  const { adminId } = useParams();
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedGroundId, setSelectedGroundId] = useState(null);

  const ITEMS_PER_PAGE = 10;
  const [page, setPage] = useState(1);

  /* ---------------- FETCH ADMIN GROUNDS ---------------- */
  useEffect(() => {
    fetchAdminGrounds();
  }, []);

  const fetchAdminGrounds = async () => {
    try {
      setLoading(true);
      const res = await getAdminGrounds(adminId);
      setAdmin(res.data.admin);
      setGrounds(res.data.grounds || []);
    } catch (error) {
      console.error("Failed to fetch admin grounds", error);
    } finally {
      setLoading(false);
    }
  };

  //================= TOGGLE BLOCK GROUNDS ================= //
  const handleToggleGroundBlock = async (ground) => {
    try {
      await toggleGroundBlock(ground.id);

      // Optimistic UI update
      setGrounds((prev) =>
        prev.map((g) =>
          g.id === ground.id
            ? { ...g, isBlocked: !g.isBlocked }
            : g
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update ground status");
    }
  };

  //================= DELETE GROUNDS ================== //
  const openDeleteConfirm = (groundId) => {
    setSelectedGroundId(groundId);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedGroundId) return;

    try {
      await deleteGroundBySuperAdmin(selectedGroundId);
      setGrounds((prev) => prev.filter((g) => g.id !== selectedGroundId));
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to delete ground"
      );
    } finally {
      setConfirmOpen(false);
      setSelectedGroundId(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setSelectedGroundId(null);
  };

  // Filter grounds based on search term
  const filteredGrounds = grounds.filter(ground =>
    ground.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ground.game?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ground.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredGrounds.length / ITEMS_PER_PAGE);
  const paginatedGrounds = filteredGrounds.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const stats = {
    total: grounds.length,
    active: grounds.filter(g => !g.isBlocked).length,
    blocked: grounds.filter(g => g.isBlocked).length,
    totalRevenue: grounds.reduce((sum, g) => sum + (g.pricePerSlot || 0), 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Details</h1>
            <p className="text-gray-400">View admin information and manage their grounds</p>
          </div>
        </div>
      </div>

      {/* Admin Info Card */}
      {admin && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-slate-700 p-6">
            <div className="flex items-center gap-4">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name)}&background=6366f1&color=fff&size=64`}
                alt={admin.name}
                className="w-16 h-16 rounded-full border-2 border-slate-600"
              />
              <div>
                <h2 className="text-2xl font-bold text-white">{admin.name}</h2>
                <p className="text-gray-400">Ground Administrator</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                <Mail className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-sm text-white font-medium">{admin.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                <Phone className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="text-sm text-white font-medium">{admin.phoneNumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                <Building2 className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-xs text-gray-400">Grounds</p>
                  <p className="text-sm text-white font-medium">{stats.total} Total</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                <User className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="text-xs text-gray-400">ID</p>
                  <p className="text-sm text-white font-medium">#{admin.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Grounds</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <User className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Grounds</p>
              <p className="text-2xl font-bold text-white">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Blocked Grounds</p>
              <p className="text-2xl font-bold text-white">{stats.blocked}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Revenue Potential</p>
              <p className="text-2xl font-bold text-white">₹{stats.totalRevenue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grounds Table */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Managed Grounds</h2>

          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search grounds..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">#</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Ground Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Game</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Price/Slot</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700">
              {paginatedGrounds.map((ground, index) => (
                <tr key={ground.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-400 font-medium">
                    {(page - 1) * ITEMS_PER_PAGE + index + 1}
                  </td>

                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-white">{ground.name}</p>
                      <p className="text-sm text-gray-400">{ground.contactNo}</p>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-300">
                      <MapPin className="w-3 h-3" />
                      {ground.city}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                      {ground.game}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-lg font-semibold text-green-400">
                      ₹{ground.pricePerSlot}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          ground.isBlocked
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : "bg-green-500/20 text-green-300 border border-green-500/30"
                        }`}
                      >
                        {ground.isBlocked ? "Blocked" : "Active"}
                      </span>

                      <ToggleSwitch
                        enabled={ground.isBlocked}
                        onToggle={() => handleToggleGroundBlock(ground)}
                      />
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/super-admin/grounds/${ground.id}/bookings`)}
                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="View Bookings"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => openDeleteConfirm(ground.id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete Ground"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {paginatedGrounds.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Building2 className="w-12 h-12 text-gray-500" />
                      <p className="text-gray-400">
                        {searchTerm ? "No grounds found matching your search" : "No grounds found"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {searchTerm ? "Try adjusting your search terms" : "This admin hasn't added any grounds yet"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {paginatedGrounds.length > 0 && (
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
        title="Delete Ground"
        message="Are you sure you want to delete this ground? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
