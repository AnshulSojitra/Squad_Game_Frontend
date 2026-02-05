import { useEffect, useState } from "react";
import {
  getAllBookingsBySuperAdmin,
  cancelBookingBySuperAdmin,
} from "../../services/api";
import ConfirmModal from "../../components/common/ConfirmModal";
import Pagination from "../../components/common/Pagination";
import { Calendar, Users, MapPin, DollarSign, Filter } from "lucide-react";

export default function SuperAdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [confirmData, setConfirmData] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'confirmed', 'cancelled'
  const ITEMS_PER_PAGE = 10;
  const [page, setPage] = useState(1);


  const fetchBookings = async () => {
    try {
      const res = await getAllBookingsBySuperAdmin();
      if (res && res.data) {
        setBookings(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async () => {
    if (!confirmData) return;

    try {
      setLoadingId(confirmData.bookingId);
      await cancelBookingBySuperAdmin(confirmData.bookingId);
      await fetchBookings();

    } catch (error) {
      console.error("Cancel booking failed", error);
    } finally {
      setLoadingId(null);
      setConfirmData(null);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filterStatus === 'all') return true;
    return booking.status === filterStatus;
  });

    const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = filteredBookings.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );


  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    revenue: bookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + (b.price || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Booking Management</h1>
          <p className="text-gray-400">Monitor and manage all platform bookings</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Bookings</p>
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
              <p className="text-sm text-gray-400">Active Bookings</p>
              <p className="text-2xl font-bold text-white">{stats.confirmed}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <MapPin className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Cancelled</p>
              <p className="text-2xl font-bold text-white">{stats.cancelled}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-white">₹{stats.revenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Table */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">All Bookings</h2>

          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Bookings</option>
              <option value="confirmed">Active Only</option>
              <option value="cancelled">Cancelled Only</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">No</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Ground</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Ground Owner</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700">
              {paginatedBookings.map((b, index) => (
                <tr key={b.bookingId} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-400 font-medium">
                    {index + 1}
                  </td>

                  {/* USER */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          b.user?.name || "User"
                        )}&background=random`}
                        className="w-8 h-8 rounded-full border border-slate-600"
                        alt={b.user?.name}
                      />
                      <div>
                        <p className="font-medium text-white">{b.user?.name}</p>
                        <p className="text-sm text-gray-400">{b.user?.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* GROUND */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-white">{b.groundName}</p>
                      <p className="text-sm text-gray-400">{b.city}</p>
                    </div>
                  </td>

                  {/* GROUND OWNER */}
                  <td className="px-6 py-4">
                    {b.admin ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            b.admin.name
                          )}&background=random`}
                          className="w-8 h-8 rounded-full border border-slate-600"
                          alt={b.admin.name}
                        />
                        <div>
                          <p className="font-medium text-white">{b.admin.name}</p>
                          <p className="text-sm text-gray-400">{b.admin.email}</p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </td>

                  {/* DATE & TIME */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-white">{b.date}</p>
                      <p className="text-sm text-gray-400">
                        {b.slotStartTime} - {b.slotEndTime}
                      </p>
                    </div>
                  </td>

                  {/* PRICE */}
                  <td className="px-6 py-4">
                    <span className="font-semibold text-green-400">
                      ₹{b.price}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        b.status === "confirmed"
                          ? "bg-green-500/20 text-green-300 border border-green-500/30"
                          : "bg-red-500/20 text-red-300 border border-red-500/30"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4">
                    {b.status === "confirmed" ? (
                      <button
                        onClick={() =>
                          setConfirmData({
                            bookingId: b.bookingId,
                            groundName: b.groundName,
                          })
                        }
                        disabled={loadingId === b.bookingId}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          loadingId === b.bookingId
                            ? "bg-red-500/50 text-red-300 cursor-not-allowed"
                            : "bg-red-500/10 text-red-300 border border-red-500/20 hover:bg-red-500/20"
                        }`}
                      >
                        {loadingId === b.bookingId ? "Cancelling..." : "Cancel"}
                      </button>
                    ) : (
                      <span className="text-gray-500 text-sm">Cancelled</span>
                    )}
                  </td>
                </tr>
              ))}

              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Calendar className="w-12 h-12 text-gray-500" />
                      <p className="text-gray-400">No bookings found</p>
                      <p className="text-sm text-gray-500">
                        {filterStatus === 'all' ? 'No bookings have been made yet' :
                         filterStatus === 'confirmed' ? 'No active bookings found' :
                         'No cancelled bookings found'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
         
        </div>
         {paginatedBookings.length > 0 && (
                    <div className="px-6 py-4 border-t border-slate-700 bg-slate-800/30">
                      <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                      />
                    </div>
                  )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!confirmData}
        title="Cancel Booking"
        message={`Are you sure you want to cancel this booking${confirmData?.groundName ? ` for ${confirmData.groundName}` : ""}?`}
        onCancel={() => setConfirmData(null)}
        onConfirm={handleCancel}
      />
    </div>
  );
}
