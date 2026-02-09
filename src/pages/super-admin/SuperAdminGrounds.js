import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllGroundsSupAdi, toggleGroundBlock, deleteGroundBySuperAdmin } from "../../services/api";
import Pagination from "../../components/common/Pagination";
import ToggleSwitch from "../../components/common/ToggleSwitch";
import ConfirmModal from "../../components/common/ConfirmModal";
import { MapPin, DollarSign, Clock, Users, Search, Trash2, Eye } from "lucide-react";

const IMAGE_BASE = process.env.REACT_APP_IMAGE_URL;

export default function SuperAdminGrounds() {
  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 9;
  const [page, setPage] = useState(1);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedGroundId, setSelectedGroundId] = useState(null);

  /* ================= FETCH GROUNDS ================= */
  useEffect(() => {
    const fetchGrounds = async () => {
      try {
        const res = await getAllGroundsSupAdi();

        // ✅ SAFELY extract array
        const groundsArray =
          res.data?.grounds ||
          res.data?.data ||
          res.data ||
          [];

        setGrounds(Array.isArray(groundsArray) ? groundsArray : []);
      } catch (err) {
        console.error("Failed to load grounds", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrounds();
  }, []);

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
    ground.admin?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ground.game?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredGrounds.length / ITEMS_PER_PAGE);
  const paginatedGrounds = filteredGrounds.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const stats = {
    total: grounds.length,
    active: grounds.filter(g => !g.isBlocked).length,
    blocked: grounds.filter(g => g.isBlocked).length
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
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Ground Management</h1>
          <p className="text-gray-400">Monitor and manage all sports grounds on the platform</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-400" />
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
              <Users className="w-6 h-6 text-green-400" />
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
      </div>

      {/* Grounds Grid */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">All Grounds</h2>

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

        {paginatedGrounds.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <MapPin className="w-12 h-12 text-gray-500" />
              <p className="text-gray-400">
                {searchTerm ? "No grounds found matching your search" : "No grounds found"}
              </p>
              <p className="text-sm text-gray-500">
                {searchTerm ? "Try adjusting your search terms" : "Grounds will appear here once added by admins"}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedGrounds.map((ground) => (
                <div
                  key={ground.id}
                  className="bg-slate-700/50 rounded-xl border border-slate-600 overflow-hidden hover:border-slate-500 transition-all duration-200 group"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-slate-600 overflow-hidden">
                    <img
                      src={
                        ground.images?.[0]
                          ? `${IMAGE_BASE}${ground.images[0].imageUrl}`
                          : "/placeholder.png"
                      }
                      alt={ground.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          ground.isBlocked
                            ? "bg-red-500/90 text-white"
                            : "bg-green-500/90 text-white"
                        }`}
                      >
                        {ground.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {ground.name}
                      </h3>
                      <p className="text-sm text-gray-400 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Owner: {ground.admin?.name || "Unknown"}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <MapPin className="w-3 h-3" />
                      {[ground.area, ground.city, ground.state, ground.country]
                        .filter(Boolean)
                        .join(", ")}
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Clock className="w-3 h-3" />
                      {ground.openingTime} – {ground.closingTime}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                        {ground.game}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30 rounded-full flex items-center gap-1">
                        ₹{ground.pricePerSlot}/slot
                      </span>
                    </div>

                    {/* Amenities */}
                    {ground.amenities?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {ground.amenities.slice(0, 3).map((a) => (
                          <span
                            key={a.id}
                            className="px-2 py-1 text-xs bg-slate-600 text-gray-300 rounded-full"
                          >
                            {a.name}
                          </span>
                        ))}
                        {ground.amenities.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-slate-600 text-gray-400 rounded-full">
                            +{ground.amenities.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-600">
                      <div className="flex items-center gap-2">
                        <ToggleSwitch
                          enabled={ground.isBlocked}
                          onToggle={() => handleToggleGroundBlock(ground)}
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/super-admin/grounds/${ground.id}/bookings`);
                          }}
                          className="px-3 py-1.5 text-xs font-medium text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors mt-2 ml-2"
                          title="View Bookings"
                        >
                          {/* <Eye className="w-4 h-4" /> */}
                          View Booking
                        </button>
                         {/* <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/super-admin/users/${user.id}/bookings`);
                      }}
                      className="px-3 py-1.5 text-xs font-medium text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors mt-2 ml-2"
                    >
                      View Bookings
                    </button> */}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteConfirm(ground.id);
                          }}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete Ground"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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