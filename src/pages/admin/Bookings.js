import { useEffect, useState } from "react";
import Pagination from "../../components/utils/Pagination";
import SearchInput from "../../components/utils/SearchInput";
import { useBoxArena } from "../../context/AppDataContext";

export default function AdminBookings() {
  const { adminBookings: bookings, loading, refreshAdminBookings } = useBoxArena();

  const ITEMS_PER_PAGE = 10;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [groundFilter, setGroundFilter] = useState("all");

  useEffect(() => {
    refreshAdminBookings();
  }, []);

  const uniqueGrounds = Array.from(
    new Set(bookings.map((b) => b.ground?.name).filter(Boolean))
  );

  const filteredBookings = bookings.filter((booking) => {
    if (!booking) return false;

    const searchText = search.toLowerCase();

    const matchesSearch =
      (booking.user?.name || "").toLowerCase().includes(searchText) ||
      (booking.user?.email || "").toLowerCase().includes(searchText) ||
      (booking.ground?.name || "").toLowerCase().includes(searchText) ||
      (booking.status || "").toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "all" || booking.status?.toLowerCase() === statusFilter;

    const matchesGround =
      groundFilter === "all" || booking.ground?.name === groundFilter;

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
        hour: "2-digit",
        minute: "2-digit",
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

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "Confirmed";
      case "cancelled":
        return "Cancelled";
      case "pending":
        return "Pending";
      default:
        return status || "Unknown";
    }
  };

  if (loading.adminBookings) {
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
            <div className="mb-4 text-4xl">Loading...</div>
            <p className="text-gray-400">Loading bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl">User Bookings</h1>
          <p className="text-gray-400">Manage all booking requests</p>
        </div>
        <div className="text-sm text-gray-400">
          Total: {filteredBookings.length} booking
          {filteredBookings.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row">
        <div className="min-w-0 flex-1">
          <SearchInput
            value={search}
            placeholder="Search by user, email, ground, status..."
            onChange={setSearch}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 lg:w-auto"
        >
          <option value="all">All Bookings</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={groundFilter}
          onChange={(e) => setGroundFilter(e.target.value)}
          className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 lg:w-auto"
        >
          <option value="all">All Grounds</option>
          {uniqueGrounds.map((groundName) => (
            <option key={groundName} value={groundName}>
              {groundName}
            </option>
          ))}
        </select>
      </div>

      <div className="block space-y-4 md:hidden">
        {filteredBookings.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mb-4 text-5xl">No Data</div>
            <p className="text-lg text-gray-400">No bookings found</p>
            <p className="text-sm text-gray-500">Try adjusting your search terms</p>
          </div>
        ) : (
          paginatedBookings.map((booking, index) => (
            <div
              key={booking?.bookingId || index}
              className="overflow-hidden rounded-2xl border border-gray-700 bg-gray-800/50 p-4 backdrop-blur-sm"
            >
              <div className="mb-4 flex flex-col gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 font-semibold text-white">
                    {(booking?.user?.name?.charAt(0) || "?").toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="break-words font-semibold text-white">
                          {booking?.user?.name || "Unknown User"}
                        </h3>
                        <p className="break-all text-sm text-gray-400">
                          {booking?.user?.email || "No email"}
                        </p>
                      </div>
                      <span className="shrink-0 text-[11px] text-gray-500">
                        #{(page - 1) * ITEMS_PER_PAGE + index + 1}
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className={`inline-flex w-fit max-w-full rounded-full border px-3 py-1 text-[11px] font-semibold ${getStatusColor(booking?.status)}`}
                >
                  {getStatusLabel(booking?.status)}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 text-green-400">Ground</span>
                  <span className="break-words text-white">
                    {booking?.ground?.name || "Unknown Ground"}
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <span className="mt-0.5 text-indigo-400">Slot</span>
                  <span className="break-words text-sm text-gray-300">
                    {booking?.slot?.startTime || "??:??"} - {booking?.slot?.endTime || "??:??"}
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <span className="mt-0.5 text-purple-400">Date</span>
                  <span className="text-sm text-gray-300">
                    {formatDate(booking?.bookingDate)}
                  </span>
                </div>

                <div className="flex items-start gap-2 text-xs text-gray-500">
                  <span className="mt-0.5">Booked</span>
                  <span className="break-words">
                    {formatDate(booking?.createdAt)} {formatTime(booking?.createdAt)}
                  </span>
                </div>

                <div className="flex items-start gap-2 text-xs text-gray-400">
                  <span className="mt-0.5">Phone</span>
                  <span className="break-words">
                    {booking?.user?.phoneNumber || "No phone number"}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hidden overflow-hidden rounded-2xl bg-gray-800/50 shadow-xl backdrop-blur-sm md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gradient-to-r from-gray-700 to-gray-800 text-white">
              <tr>
                <th className="px-4 py-4 text-left font-semibold lg:px-6">No</th>
                <th className="px-4 py-4 text-left font-semibold lg:px-6">User</th>
                <th className="px-4 py-4 text-left font-semibold lg:px-6">phoneNumber</th>
                <th className="px-4 py-4 text-left font-semibold lg:px-6">Ground</th>
                <th className="px-4 py-4 text-left font-semibold lg:px-6">Slot</th>
                <th className="px-4 py-4 text-left font-semibold lg:px-6">Date</th>
                <th className="px-4 py-4 text-left font-semibold lg:px-6">Status</th>
                <th className="px-4 py-4 text-left font-semibold lg:px-6">Booked At</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-400">
                    <div className="mb-2 text-4xl">No Data</div>
                    <p>No bookings found</p>
                    <p className="text-sm">Try adjusting your search terms</p>
                  </td>
                </tr>
              ) : (
                paginatedBookings.map((booking, index) => (
                  <tr
                    key={booking?.bookingId || index}
                    className="border-t border-gray-700 text-white transition-colors duration-200 hover:bg-gray-700/50"
                  >
                    <td className="px-4 py-4 font-medium lg:px-6">
                      {(page - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>

                    <td className="px-4 py-4 lg:px-6">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-white">
                          {(booking?.user?.name?.charAt(0) || "?").toUpperCase()}
                        </div>
                        <div className="min-w-0 flex flex-col">
                          <span className="max-w-32 truncate font-medium text-white">
                            {booking?.user?.name || "Unknown"}
                          </span>
                          <span className="max-w-32 truncate text-sm text-gray-400">
                            {booking?.user?.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="max-w-48 truncate px-4 py-4 text-gray-300 lg:px-6">
                      {booking?.user?.phoneNumber || "No phone"}
                    </td>

                    <td className="px-4 py-4 lg:px-6">
                      <span className="max-w-32 truncate">
                        {booking?.ground?.name || "Unknown"}
                      </span>
                    </td>

                    <td className="px-4 py-4 lg:px-6">
                      <span className="whitespace-nowrap rounded-full border border-indigo-500/30 bg-indigo-500/20 px-3 py-1 text-xs text-indigo-300">
                        {booking?.slot?.startTime || "??:??"} - {booking?.slot?.endTime || "??:??"}
                      </span>
                    </td>

                    <td className="px-4 py-4 lg:px-6">
                      <span className="whitespace-nowrap rounded-full border border-purple-500/30 bg-purple-500/20 px-3 py-1 text-xs text-purple-300">
                        {formatDate(booking?.bookingDate)}
                      </span>
                    </td>

                    <td className="px-4 py-4 lg:px-6">
                      <span
                        className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(booking?.status)}`}
                      >
                        {getStatusLabel(booking?.status)}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-400 lg:px-6">
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

