import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGroundBookings, cancelBookingBySuperAdmin } from "../../services/api";
import ConfirmModal from "../../components/common/ConfirmModal";
import { Calendar, Clock, DollarSign, Users, X, ArrowLeft, Search } from "lucide-react";

export default function SuperAdminGroundsBooking() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { groundId } = useParams();
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleOpenCancelModal = (booking) => {
    setSelectedBooking(booking);
    setIsConfirmOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBooking) return;

    try {
      setLoadingId(selectedBooking.bookingId);
      await cancelBookingBySuperAdmin(selectedBooking.bookingId);

      // Update UI
      setBookings((prev) =>
        prev.map((b) =>
          b.id === selectedBooking.id
            ? { ...b, status: "cancelled" }
            : b
        )
      );

      setIsConfirmOpen(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error(error);
      alert("Failed to cancel booking");
    } finally {
      setLoadingId(null);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await getGroundBookings(groundId);
      setBookings(res.data.bookings || []);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    }
  };

  // Filter bookings based on search term
  const filteredBookings = bookings.filter(booking =>
    booking.User?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.User?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.date?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: bookings.length,
    active: bookings.filter(b => b.status !== "cancelled").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
    revenue: bookings
      .filter(b => b.status !== "cancelled")
      .reduce((sum, b) => sum + (b.price || 0), 0)
  };

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
            <h1 className="text-3xl font-bold text-white mb-2">Ground Bookings</h1>
            <p className="text-gray-400">Manage bookings for this sports ground</p>
          </div>
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
              <p className="text-2xl font-bold text-white">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <X className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Cancelled</p>
              <p className="text-2xl font-bold text-white">{stats.cancelled}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-white">₹{stats.revenue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">All Bookings</h2>

          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">No</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700">
              {filteredBookings.map((booking, index) => (
                <tr key={booking.bookingId} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-400 font-medium">
                    {index + 1}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(booking.user?.name || 'User')}&background=random`}
                        alt={booking.user?.name || 'User'}
                        className="w-8 h-8 rounded-full border border-slate-600"
                      />
                      <div>
                        <p className="font-semibold text-white text-sm">
                          {booking.user?.name || "N/A"}
                        </p>
                        <p className="text-xs text-gray-400">{booking.user?.email || "N/A"}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-gray-300 mb-1">
                        <Calendar className="w-3 h-3" />
                        {booking.date}
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock className="w-3 h-3" />
                        {booking.slot?.startTime} - {booking.slot?.endTime}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-lg font-semibold text-green-400">
                      ₹{booking.price}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === "cancelled"
                          ? "bg-red-500/20 text-red-300 border border-red-500/30"
                          : "bg-green-500/20 text-green-300 border border-green-500/30"
                      }`}
                    >
                      {booking.status === "cancelled" ? "Cancelled" : "Active"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {booking.status !== "cancelled" ? (
                      <button
                        onClick={() => handleOpenCancelModal(booking)}
                        disabled={loadingId === booking.id}
                        className="px-3 py-1.5 text-xs font-medium text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
                      >
                        {loadingId === booking.id ? (
                          <div className="flex items-center gap-1">
                            <div className="animate-spin rounded-full h-3 w-3 border-b border-red-400"></div>
                            Cancelling...
                          </div>
                        ) : (
                          "Cancel"
                        )}
                      </button>
                    ) : (
                      <span className="text-xs text-gray-500">Cancelled</span>
                    )}
                  </td>
                </tr>
              ))}

              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Calendar className="w-12 h-12 text-gray-500" />
                      <p className="text-gray-400">
                        {searchTerm ? "No bookings found matching your search" : "No bookings found"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {searchTerm ? "Try adjusting your search terms" : "Bookings will appear here once made"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        onCancel={() => {
          setIsConfirmOpen(false);
          setSelectedBooking(null);
        }}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}
