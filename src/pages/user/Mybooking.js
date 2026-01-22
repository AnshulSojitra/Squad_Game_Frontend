import { useEffect, useState } from "react";
import { getUserBookings, cancelUserBooking } from "../../services/api";
import Pagination from "../../components/common/Pagination";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(null);
  const ITEMS_PER_PAGE = 10;
  const [page, setPage] = useState(1);



  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await getUserBookings();
      setBookings(res.data.data); // backend response structure
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time) => {
  const [hour, minute] = time.split(":");
  const h = Number(hour);
  const suffix = h >= 12 ? "PM" : "AM";
  const formattedHour = h % 12 || 12;
  return `${formattedHour}:${minute} ${suffix}`;
  };


  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      setCancelLoading(bookingId);
      await cancelUserBooking(bookingId);

      // Update UI instantly
      setBookings((prev) =>
        prev.map((b) =>
          b.bookingId === bookingId
            ? { ...b, status: "cancelled" }
            : b
        )
      );
    } catch (err) {
      alert("Failed to cancel booking");
    } finally {
      setCancelLoading(null);
    }
  };

  // paginated grounds 
  const totalPages = Math.ceil(bookings.length / ITEMS_PER_PAGE);

const paginatedBookings = bookings.slice(
  (page - 1) * ITEMS_PER_PAGE,
  page * ITEMS_PER_PAGE
);


  if (loading) {
    return <p className="text-center mt-10">Loading bookings...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 px-6 py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

        {bookings.length === 0 ? (
          <p className="text-gray-500 text-center">
            You have no bookings yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-sm">
                  <th className="p-3">Ground</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Slot</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedBookings.map((booking) => (
                  <tr
                    key={booking.bookingId}
                    className="border-b text-sm"
                  >
                    <td className="p-3">
                      <p className="font-medium">
                        {booking.ground.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.ground.area} ,  
                        {booking.ground.state} ,  
                        {booking.ground.country}
                      </p>
                    </td>

                    <td className="p-3">{booking.date}</td>

                    <td className="p-3">
                      {formatTime(booking.startTime)} –{" "}
                      {formatTime(booking.endTime)}
                    </td>

                    <td className="p-3 font-semibold text-green-600">
                      ₹{booking.totalPrice}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    <td className="p-3">
                      {booking.status === "confirmed" && (
                        <button
                          onClick={() =>
                            handleCancel(booking.bookingId)
                          }
                          disabled={cancelLoading === booking.bookingId}
                          className="text-red-600 hover:underline text-sm"
                        >
                          {cancelLoading === booking.bookingId
                            ? "Cancelling..."
                            : "Cancel"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

    </div>
  );
}
