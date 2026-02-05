import { useEffect, useState } from "react";
import { getAdminBookings } from "../../services/api";
import Pagination from "../../components/common/Pagination";
import SearchInput from "../../components/common/SearchInput";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ITEMS_PER_PAGE = 10;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
const [groundFilter, setGroundFilter] = useState("all");


  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminBookings();
      setBookings(res.data || []);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
      setError("Unable to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };


// const uniqueGrounds = Array.from(
//   new Map(
//     bookings
//       .map((b) => {
//         if (b.ground?.id) {
//           return [b.ground.id, b.ground];
//         }
//         if (b.groundId && b.groundName) {
//           return [b.groundId, { id: b.groundId, name: b.groundName }];
//         }
//         return null;
//       })
//       .filter(Boolean)
//   ).values()
// );
const uniqueGrounds = Array.from(
  new Set(
    bookings
      .map((b) => b.ground?.name)
      .filter(Boolean)
  )
);




//   const filteredBookings = bookings.filter((booking) => {
//   if (!booking) return false;

//   // 🔍 Search filter
//   const searchText = search.toLowerCase();
//   const matchesSearch =
//     (booking.user?.name || "").toLowerCase().includes(searchText) ||
//     (booking.user?.email || "").toLowerCase().includes(searchText) ||
//     (booking.ground?.name || "").toLowerCase().includes(searchText) ||
//     (booking.status || "").toLowerCase().includes(searchText);

//   // 📌 Status filter
//   const matchesStatus =
//     statusFilter === "all" ||
//     booking.status?.toLowerCase() === statusFilter;

//   // const matchesGround =
//   // groundFilter === "all" ||
//   // booking.ground?.id === Number(groundFilter) ||
//   // booking.groundId === Number(groundFilter);

// const matchesGround =
//   groundFilter === "all" ||
//   booking.ground?.name === groundFilter;

//   return matchesSearch && matchesStatus && matchesGround;
// });


const filteredBookings = bookings.filter((booking) => {
  if (!booking) return false;

  const searchText = search.toLowerCase();

  const matchesSearch =
    (booking.user?.name || "").toLowerCase().includes(searchText) ||
    (booking.user?.email || "").toLowerCase().includes(searchText) ||
    (booking.ground?.name || "").toLowerCase().includes(searchText) ||
    (booking.status || "").toLowerCase().includes(searchText);

  const matchesStatus =
    statusFilter === "all" ||
    booking.status?.toLowerCase() === statusFilter;

  const matchesGround =
    groundFilter === "all" ||
    booking.ground?.name === groundFilter;

  return matchesSearch && matchesStatus && matchesGround;
});


  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, groundFilter]);

  useEffect(() => {
    const maxPage = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE) || 1;
    if (page > maxPage) setPage(maxPage);
  }, [filteredBookings.length, page]);

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = filteredBookings.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-GB");
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "✅";
      case "cancelled":
        return "❌";
      case "pending":
        return "⏳";
      default:
        return "";
    }
  };



  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">User Bookings</h1>
            <p className="text-gray-400">Manage all booking requests</p>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p className="text-gray-400">Loading bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">User Bookings</h1>
            <p className="text-gray-400">Manage all booking requests</p>
          </div>
        </div>
        <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-6 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-300 text-lg font-semibold mb-2">Error Loading Bookings</p>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchBookings}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">User Bookings</h1>
          <p className="text-gray-400">Manage all booking requests</p>
        </div>
        <div className="text-sm text-gray-400">
          Total: {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="mb-6 flex flex-col lg:flex-row gap-4">
      {/* Search */}
      <div className="flex-1">
        <SearchInput
          value={search}
          placeholder="Search by user, email, ground, status..."
          onChange={setSearch}
        />
      </div>

      {/* Status Filter */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="all">All Bookings</option>
        <option value="confirmed">Confirmed</option>
        <option value="cancelled">Cancelled</option>
        <option value="completed">Completed</option>
      </select>

      {/* Ground Filter */}
      <select
        value={groundFilter}
        onChange={(e) => setGroundFilter(e.target.value)}
        className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="all">All Grounds</option>
        {/* {uniqueGrounds.map((ground) => (
          <option key={ground.id} value={ground.id}>
            {ground.name}
          </option>
        ))} */}
        {uniqueGrounds.map((groundName) => (
        <option key={groundName} value={groundName}>
          {groundName}
        </option>
      ))}
      </select>
    </div>


      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-gray-400 text-lg">No bookings found</p>
            <p className="text-gray-500 text-sm">Try adjusting your search terms</p>
          </div>
        ) : (
          paginatedBookings.map((booking, index) => (
            <div
              key={booking?.bookingId || index}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {(booking?.user?.name?.charAt(0) || "?").toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{booking?.user?.name || "Unknown User"}</h3>
                    <p className="text-gray-400 text-sm">{booking?.user?.email || "No email"}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking?.status)}`}>
                  {getStatusIcon(booking?.status)} {booking?.status || "Unknown"}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">🏟️</span>
                  <span className="text-white">{booking?.ground?.name || "Unknown Ground"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-indigo-400">⏰</span>
                  <span className="text-gray-300 text-sm">
                    {booking?.slot?.startTime || "??:??"} – {booking?.slot?.endTime || "??:??"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-purple-400">📅</span>
                  <span className="text-gray-300 text-sm">
                    {formatDate(booking?.bookingDate)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>🕒</span>
                  <span>Booked {formatTime(booking?.createdAt)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gradient-to-r from-gray-700 to-gray-800 text-white">
              <tr>
                <th className="px-4 lg:px-6 py-4 text-left font-semibold">No</th>
                <th className="px-4 lg:px-6 py-4 text-left font-semibold">User</th>
                <th className="px-4 lg:px-6 py-4 text-left font-semibold">phoneNumber</th>
                <th className="px-4 lg:px-6 py-4 text-left font-semibold">Ground</th>
                <th className="px-4 lg:px-6 py-4 text-left font-semibold">Slot</th>
                <th className="px-4 lg:px-6 py-4 text-left font-semibold">Date</th>
                <th className="px-4 lg:px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-4 lg:px-6 py-4 text-left font-semibold">Booked At</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-gray-400">
                    <div className="text-4xl mb-2">📅</div>
                    <p>No bookings found</p>
                    <p className="text-sm">Try adjusting your search terms</p>
                  </td>
                </tr>
              ) : (
                paginatedBookings.map((booking, index) => (
                  <tr
                    key={booking?.bookingId || index}
                    className="border-t border-gray-700 hover:bg-gray-700/50 transition-colors duration-200 text-white"
                  >
                    <td className="px-4 lg:px-6 py-4 font-medium">
                      {(page - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>

                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                          {(booking?.user?.name?.charAt(0) || "?").toUpperCase()}
                        </div>
                         <div className="flex flex-col min-w-0">
                        <span className="font-medium text-white truncate max-w-32">
                          {booking?.user?.name || "Unknown"}
                        </span>
                        <span className="text-sm text-gray-400 truncate max-w-32">
                          {booking?.user?.email}
                        </span>
                      </div>
                      </div>
                    </td>

                    <td className="px-4 lg:px-6 py-4 text-gray-300 truncate max-w-48">
                      {booking?.user?.phoneNumber || "No email"}
                    </td>

                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-green-400">🏟️</span>
                        <span className="truncate max-w-32">{booking?.ground?.name || "Unknown"}</span>
                      </div>
                    </td>

                    <td className="px-4 lg:px-6 py-4">
                      <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs border border-indigo-500/30 whitespace-nowrap">
                        ⏰ {booking?.slot?.startTime || "??:??"} – {booking?.slot?.endTime || "??:??"}
                      </span>
                    </td>

                    <td className="px-4 lg:px-6 py-4">
                      <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs border border-purple-500/30 whitespace-nowrap">
                        📅 {formatDate(booking?.bookingDate)}
                      </span>
                    </td>

                    <td className="px-4 lg:px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getStatusColor(booking?.status)}`}>
                        {getStatusIcon(booking?.status)} {booking?.status || "Unknown"}
                      </span>
                    </td>

                    <td className="px-4 lg:px-6 py-4 text-gray-400 text-sm whitespace-nowrap">
                      {formatDate(booking?.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
