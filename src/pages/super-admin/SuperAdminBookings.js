import { useEffect, useState } from "react";
import { cancelBookingBySuperAdmin } from "../../services/api";
import ConfirmModal from "../../components/utils/ConfirmModal";
import Pagination from "../../components/utils/Pagination";
import { Calendar, Users, MapPin, DollarSign, Filter } from "lucide-react";
import Loader from "../../components/utils/Loader";
import { useBoxArena } from "../../context/BoxArenaContext";

export default function SuperAdminBookings() {
  const {
    superAdminBookings: bookings,
    loading,
    refreshSuperAdminBookings,
    setSuperAdminBookings,
  } = useBoxArena();
  const [loadingId, setLoadingId] = useState(null);
  const [confirmData, setConfirmData] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const ITEMS_PER_PAGE = 15;
  const [page, setPage] = useState(1);

  useEffect(() => {
    refreshSuperAdminBookings();
  }, []);

  const formatDatePretty = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleCancel = async () => {
    if (!confirmData) return;

    try {
      setLoadingId(confirmData.bookingId);
      await cancelBookingBySuperAdmin(confirmData.bookingId);
      setSuperAdminBookings((prev) =>
        prev.map((b) =>
          b.bookingId === confirmData.bookingId
            ? { ...b, status: "cancelled" }
            : b
        )
      );
    } catch (error) {
      console.error("Cancel booking failed", error);
    } finally {
      setLoadingId(null);
      setConfirmData(null);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filterStatus === "all") return true;
    return booking.status === filterStatus;
  });

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = filteredBookings.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    revenue: bookings
      .filter((b) => b.status === "confirmed")
      .reduce((sum, b) => sum + (b.price || 0), 0),
  };

  if (loading.superAdminBookings) {
    return <Loader variant="simple" text="Loading bookings..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Booking Management</h1>
          <p className="text-gray-400">Monitor and manage all platform bookings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center gap-4"><div className="p-3 bg-blue-500/20 rounded-lg"><Calendar className="w-6 h-6 text-blue-400" /></div><div><p className="text-sm text-gray-400">Total Bookings</p><p className="text-2xl font-bold text-white">{stats.total}</p></div></div>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center gap-4"><div className="p-3 bg-green-500/20 rounded-lg"><Users className="w-6 h-6 text-green-400" /></div><div><p className="text-sm text-gray-400">Active Bookings</p><p className="text-2xl font-bold text-white">{stats.confirmed}</p></div></div>
        </div>
        <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-6">
          <div className="flex items-center gap-4"><div className="p-3 bg-red-500/20 rounded-lg"><MapPin className="w-6 h-6 text-red-400" /></div><div><p className="text-sm text-gray-400">Cancelled</p><p className="text-2xl font-bold text-white">{stats.cancelled}</p></div></div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-xl p-6">
          <div className="flex items-center gap-4"><div className="p-3 bg-emerald-500/20 rounded-lg"><DollarSign className="w-6 h-6 text-emerald-400" /></div><div><p className="text-sm text-gray-400">Total Revenue</p><p className="text-2xl font-bold text-white">Rs {stats.revenue.toLocaleString()}</p></div></div>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-700 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">All Bookings</h2>
            <p className="text-xs text-gray-500 mt-1">Viewing {paginatedBookings.length} of {filteredBookings.length} bookings</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
            >
              <option value="all">All Bookings</option>
              <option value="confirmed">Active</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto max-w-full">
          <table className="min-w-[1200px] w-full border-collapse">
            <thead className="bg-slate-700/50 text-white">
              <tr>
                <th className="px-6 py-4 w-[60px]">No</th>
                <th className="px-6 py-4 w-[240px]">User</th>
                <th className="px-6 py-4 w-[180px]">Ground</th>
                <th className="px-6 py-4 w-[220px] hidden lg:table-cell">Ground Owner</th>
                <th className="px-6 py-4 w-[220px]">Date & Time</th>
                <th className="px-6 py-4 w-[100px]">Price</th>
                <th className="px-6 py-4 w-[120px]">Status</th>
                <th className="px-6 py-4 w-[140px]">Actions</th>
                <th className="px-6 py-4 w-[120px] hidden lg:table-cell">Booked At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {paginatedBookings.map((b, index) => (
                <tr key={b.bookingId} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-4 text-sm text-gray-400 font-medium">{(page - 1) * ITEMS_PER_PAGE + index + 1}</td>
                  <td className="px-6 py-4"><div className="min-w-0"><p className="font-medium text-white truncate">{b.user?.name}</p><p className="text-sm text-gray-400 truncate max-w-[180px]">{b.user?.email}</p></div></td>
                  <td className="max-w-[120px]"><div><p className="font-medium text-white truncate">{b.groundName}</p><p className="text-sm text-gray-400 truncate">{b.city}</p></div></td>
                  <td className="px-4 py-4 hidden lg:table-cell"><span className="text-white">{b.admin?.name || "N/A"}</span></td>
                  <td className="px-6 py-4"><div className="flex flex-col gap-1 max-w-[200px]"><span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-2xl text-xs border border-indigo-500/30 ">{b.slotStartTime} - {b.slotEndTime}</span><span className="inline-flex items-center gap-1 bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-2xl text-xs">{formatDatePretty(b.date)}</span></div></td>
                  <td className="px-6 py-4"><span className="font-semibold text-green-400">Rs {b.price}</span></td>
                  <td className="px-4 py-4"><span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${b.status === "confirmed" ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-red-500/20 text-red-300 border-red-500/30"}`}>{b.status}</span></td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {b.status === "confirmed" ? (
                      <button
                        onClick={() => setConfirmData({ bookingId: b.bookingId, groundName: b.groundName })}
                        disabled={loadingId === b.bookingId}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${loadingId === b.bookingId ? "bg-red-500/50 text-red-300 cursor-not-allowed" : "bg-red-500/10 text-red-300 border border-red-500/20 hover:bg-red-500/20"}`}
                      >
                        {loadingId === b.bookingId ? "Cancelling..." : "Cancel"}
                      </button>
                    ) : <span className="text-gray-500 text-sm">Cancelled</span>}
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell"><span className="font-semibold text-white">{formatDatePretty(b.createdAt)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginatedBookings.length > 0 && (
          <div className="px-4 sm:px-6 py-4 border-t border-slate-700 bg-slate-800/30">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

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
