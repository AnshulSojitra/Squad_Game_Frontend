import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGroundBookings, cancelBookingBySuperAdmin } from "../../services/api";
import ConfirmModal from "../../components/utils/ConfirmModal";
import { Calendar, Clock, DollarSign, Users, X, ArrowLeft, Search } from "lucide-react";

export default function SuperAdminGroundsBooking() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { groundId } = useParams();
  const [bookings, setBookings] = useState([]);
  const [ground, setGround] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const normalizeStatus = (status) => String(status || "").trim().toLowerCase();

  const getStatusConfig = (status) => {
    const normalizedStatus = normalizeStatus(status);

    switch (normalizedStatus) {
      case "cancelled":
        return {
          label: "Cancelled",
          badgeClass:
            "bg-red-500/20 text-red-300 border border-red-500/30",
        };
      case "completed":
        return {
          label: "Completed",
          badgeClass:
            "bg-blue-500/20 text-blue-300 border border-blue-500/30",
        };
      default:
        return {
          label: "Confirmed",
          badgeClass:
            "bg-green-500/20 text-green-300 border border-green-500/30",
        };
    }
  };

  const canCancelBooking = (status) => normalizeStatus(status) === "confirmed";

  const handleOpenCancelModal = (booking) => {
    setSelectedBooking(booking);
    setIsConfirmOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBooking) return;

    try {
      setLoadingId(selectedBooking.bookingId);
      await cancelBookingBySuperAdmin(selectedBooking.bookingId);

      setBookings((prev) =>
        prev.map((b) =>
          b.bookingId === selectedBooking.bookingId
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
      setGround(res.data.ground || { name: "Ground" });
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    }
  };

  // Filter bookings based on search term
  const filteredBookings = bookings.filter(booking =>
    booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.date?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: bookings.length,
    active: bookings.filter(b => normalizeStatus(b.status) === "confirmed").length,
    cancelled: bookings.filter(b => normalizeStatus(b.status) === "cancelled").length,
    completed: bookings.filter(b => normalizeStatus(b.status) === "completed").length,
    revenue: bookings
      .filter(b => normalizeStatus(b.status) !== "cancelled")
      .reduce((sum, b) => sum + (b.price || 0), 0)
  };

  return (
    <>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-3 sm:items-center sm:gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl mb-2">{ground?.name || "Ground"} Bookings</h1>
            <p className="text-gray-400">Manage bookings for this sports ground</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
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

        <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border border-cyan-500/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-white">{stats.completed}</p>
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
        <div className="flex flex-col gap-3 border-b border-slate-700 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-semibold text-white">All Bookings</h2>

          {/* Search */}
          <div className="relative w-full md:w-auto">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full min-w-0 pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent md:w-72"
            />
          </div>
        </div>

        <div className="hidden overflow-x-auto md:block">
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
                  {(() => {
                    const statusConfig = getStatusConfig(booking.status);

                    return (
                      <>
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
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.badgeClass}`}
                    >
                      {statusConfig.label}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {canCancelBooking(booking.status) ? (
                      <button
                        onClick={() => handleOpenCancelModal(booking)}
                        disabled={loadingId === booking.bookingId}
                        className="px-3 py-1.5 text-xs font-medium text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
                      >
                        {loadingId === booking.bookingId ? (
                          <div className="flex items-center gap-1">
                            <div className="animate-spin rounded-full h-3 w-3 border-b border-red-400"></div>
                            Cancelling...
                          </div>
                        ) : (
                          "Cancel"
                        )}
                      </button>
                    ) : (
                      <span className="text-xs text-gray-500">{statusConfig.label}</span>
                    )}
                  </td>
                      </>
                    );
                  })()}
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

        <div className="divide-y divide-slate-700 md:hidden">
          {filteredBookings.map((booking, index) => (
            <div key={booking.bookingId} className="space-y-3 px-4 py-4">
              {(() => {
                const statusConfig = getStatusConfig(booking.status);

                return (
                  <>
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(booking.user?.name || "User")}&background=random`}
                    alt={booking.user?.name || "User"}
                    className="w-8 h-8 rounded-full border border-slate-600"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-white text-sm">{booking.user?.name || "N/A"}</p>
                    <p className="text-xs text-gray-400 break-all">{booking.user?.email || "N/A"}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">#{index + 1}</span>
              </div>

              <div className="text-sm text-gray-300 space-y-1">
                <div>{booking.date}</div>
                <div>{booking.slot?.startTime} - {booking.slot?.endTime}</div>
                <div className="font-semibold text-green-400">Rs {booking.price}</div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.badgeClass}`}
                >
                  {statusConfig.label}
                </span>

                {canCancelBooking(booking.status) ? (
                  <button
                    onClick={() => handleOpenCancelModal(booking)}
                    disabled={loadingId === booking.bookingId}
                    className="px-3 py-1.5 text-xs font-medium text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
                  >
                    {loadingId === booking.bookingId ? "Cancelling..." : "Cancel"}
                  </button>
                ) : (
                  <span className="text-xs text-gray-500">{statusConfig.label}</span>
                )}
              </div>
                  </>
                );
              })()}
            </div>
          ))}

          {filteredBookings.length === 0 && (
            <div className="px-6 py-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <Calendar className="w-12 h-12 text-gray-500" />
                <p className="text-gray-400">
                  {searchTerm ? "No bookings found matching your search" : "No bookings found"}
                </p>
                <p className="text-sm text-gray-500">
                  {searchTerm ? "Try adjusting your search terms" : "Bookings will appear here once made"}
                </p>
              </div>
            </div>
          )}
        </div>
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
      </>
  );
}
