import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  SupAdigetUserBookings,
  cancelBookingBySuperAdmin,
} from "../../services/api";
import ConfirmModal from "../../components/common/ConfirmModal";
import Pagination from "../../components/common/Pagination";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  CalendarDays,
  TrendingUp,
  Ban
} from "lucide-react";

export default function SuperAdminUserBook() {
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 6;
  const [page, setPage] = useState(1);

  let bookingList = data ? data.bookings : [];

  const totalPages = Math.max(
    1,
    Math.ceil(bookingList.length / ITEMS_PER_PAGE)
  );

  const paginatedBookings = bookingList.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Calculate stats
  const totalBookings = bookingList.length;
  const confirmedBookings = bookingList.filter(b => b.status === 'confirmed').length;
  const cancelledBookings = bookingList.filter(b => b.status === 'cancelled').length;
  const totalRevenue = bookingList
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + (b.price || 0), 0);

  /* ---------------- FETCH BOOKINGS ---------------- */
  const fetchBookings = async () => {
    const res = await SupAdigetUserBookings(userId);
    setData(res.data);
  };

  useEffect(() => {
    fetchBookings();
  }, [userId]);

  useEffect(() => {
    setPage(1);
  }, [data]);

  const openCancelConfirm = (bookingId) => {
    setSelectedBookingId(bookingId);
    setConfirmOpen(true);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBookingId) return;

    setLoadingId(selectedBookingId);
    try {
      await cancelBookingBySuperAdmin(selectedBookingId);
      await fetchBookings();
    } catch (err) {
      alert("Failed to cancel booking");
    } finally {
      setLoadingId(null);
      setConfirmOpen(false);
      setSelectedBookingId(null);
    }
  };

  const handleCancelModal = () => {
    setConfirmOpen(false);
    setSelectedBookingId(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/10 border-green-500/20 text-green-400';
      case 'cancelled':
        return 'bg-red-500/10 border-red-500/20 text-red-400';
      default:
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-400 text-lg">Loading user bookings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/super-admin/users")}
            className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-300 hover:text-white transition-all duration-200 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Back to Users</span>
          </button>
        </div>

        {/* User Profile Header */}
        <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-800"></div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {data.user.name}'s Bookings
              </h1>
              <div className="flex items-center gap-4 mt-2 text-slate-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{data.user.email}</span>
                </div>
                {data.user.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{data.user.phoneNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <CalendarDays className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Bookings</p>
                <p className="text-2xl font-bold text-white">{totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Confirmed</p>
                <p className="text-2xl font-bold text-white">{confirmedBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Cancelled</p>
                <p className="text-2xl font-bold text-white">{cancelledBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Revenue</p>
                <p className="text-2xl font-bold text-white">₹{totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Booking History</h2>
            <div className="text-sm text-slate-400">
              Showing {paginatedBookings.length} of {totalBookings} bookings
            </div>
          </div>

          {paginatedBookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No bookings found</p>
              <p className="text-slate-500 text-sm">This user hasn't made any bookings yet</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {paginatedBookings.map((b) => (
                <div
                 key={b.bookingId}
                  className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/30 rounded-xl p-6 hover:border-slate-500/50 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-slate-700/50 rounded-lg group-hover:bg-slate-600/50 transition-colors duration-200">
                          <MapPin className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {b.groundName}
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                            <div className="flex items-center gap-2 text-slate-300">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              <span className="text-sm">{b.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                              <Clock className="w-4 h-4 text-slate-400" />
                              <span className="text-sm">{b.slotTime}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                              {/* <DollarSign className="w-4 h-4 text-slate-400" /> */}
                              <span className="text-sm font-medium">₹{b.price}</span>
                            </div>
                          </div>

                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(b.status)}`}>
                            {getStatusIcon(b.status)}
                            <span className="capitalize">{b.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {b.status !== "cancelled" && (
                      <button
                        onClick={() => openCancelConfirm(b.bookingId)}
                        disabled={loadingId === b.id}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
                          loadingId === b.id ? 'animate-pulse' : ''
                        }`}
                      >
                        {loadingId === b.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Cancelling...</span>
                          </>
                        ) : (
                          <>
                            <Ban className="w-4 h-4" />
                            <span>Cancel Booking</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>

        {/* Confirm Modal */}
        <ConfirmModal
          isOpen={confirmOpen}
          title="Cancel Booking"
          message="Are you sure you want to cancel this booking? This action cannot be undone and may affect the user."
          onConfirm={handleConfirmCancel}
          onCancel={handleCancelModal}
        />
      </div>
    </div>
  );
}
