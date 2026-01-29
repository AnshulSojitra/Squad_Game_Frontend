import { useEffect, useState } from "react";
import { getAdminBookings } from "../../services/api";
import Pagination from "../../components/common/Pagination";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);


  const ITEMS_PER_PAGE = 10;
  const [page, setPage] = useState(1);


  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await getAdminBookings();
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
      alert("Unable to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(bookings.length / ITEMS_PER_PAGE);

const paginatedBookings = bookings.slice(
  (page - 1) * ITEMS_PER_PAGE,
  page * ITEMS_PER_PAGE
);


  if (loading) {
    return <p className="p-6 text-gray-500">Loading bookings...</p>;
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">User Bookings</h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">No</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Ground</th>
              <th className="px-4 py-3 text-left">Slot</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Booked At</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  No bookings found
                </td>
              </tr>
            ) : (
              paginatedBookings.map((booking, index) => (
                <tr
                  key={booking.bookingId}
                  className="border-t hover:bg-gray-50 text-black"
                >
                  <td className="px-4 py-3">{index + 1}</td>

                  <td className="px-4 py-3">
                    {booking.user?.name}
                  </td>

                  <td className="px-4 py-3">
                    {booking.user?.email}
                  </td>

                  <td className="px-4 py-3">
                    {booking.ground?.name}
                  </td>

                  <td className="px-4 py-3">
                    {booking.slot?.startTime} – {booking.slot?.endTime}
                  </td>

                  <td className="px-4 py-3">
                    {booking.bookingDate}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-gray-500">
                    {new Date(booking.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
/>

    </div>
  );
}
