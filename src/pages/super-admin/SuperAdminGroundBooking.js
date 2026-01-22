import { useEffect, useState } from "react";
import { useParams , useNavigate } from "react-router-dom";
import { getGroundBookings , cancelBookingBySuperAdmin } from "../../services/api";
import ConfirmModal from "../../components/common/ConfirmModal";

export default function SuperAdminGroundsBooking() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
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
  try {
    cancelBookingBySuperAdmin(selectedBooking.id);

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
  }
};


  const fetchBookings = async () => {
    const res = await getGroundBookings(groundId);
    setBookings(res.data.bookings);
  };

  return (
    <div className="min-h-screen bg-gray-850 p-6">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Ground Bookings
      </h2>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr className="text-left text-sm font-semibold text-gray-700">
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {bookings.map((booking, index) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-600">
                    {index + 1}
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {booking.User?.name || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.User?.email || "N/A"}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {booking.date}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {booking.Slot?.startTime} - {booking.Slot?.endTime}
                  </td>

                  <td className="px-6 py-4 font-medium">
                    ₹{booking.totalPrice}
                  </td>

                  {/* <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td> */}
                  <td className="px-6 py-4">
                  {booking.status !== "cancelled" ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent row click
                        handleOpenCancelModal(booking);
                      }}
                      className="px-4 py-1.5 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200"
                    >
                      Cancel
                    </button>
                  ) : (
                    <span className="text-sm text-gray-400">Cancelled</span>
                  )}
                </td>

                </tr>
              ))}

              {bookings.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-500">
                    No bookings found
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
