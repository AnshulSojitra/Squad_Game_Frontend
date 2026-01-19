import { useEffect, useState } from "react";
import {
  getAllBookingsBySuperAdmin,
  cancelBookingBySuperAdmin,
} from "../../services/api";
import ConfirmModal from "../../components/common/ConfirmModal";

export default function SuperAdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [confirmData, setConfirmData] = useState(null);

 const fetchBookings = async () => {
  try {
    const res = await getAllBookingsBySuperAdmin();

    if (res && res.data) {
      setBookings(res.data.bookings || []);
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
      cancelBookingBySuperAdmin(confirmData.bookingId);
      await fetchBookings();
    } catch (error) {
      console.error("Cancel booking failed", error);
    } finally {
      setLoadingId(null);
      setConfirmData(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">
        All Bookings
      </h1>

      <div className="overflow-x-auto rounded-lg">
        <table className="w-full bg-white text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">No.</th>
              <th className="p-3">User</th>
              <th className="p-3">Ground</th>
              <th className="p-3">Ground Owner</th>
              <th className="p-3">Date & Time</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b , index) => (
              <tr
                key={b.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-3">{index + 1}</td>

                <td className="p-3">
                  <div className="font-medium">{b.User?.name}</div>
                  <div className="text-gray-500 text-xs">
                    {b.User?.email}
                  </div>
                </td>

                <td className="p-3">
                  <div className="font-medium">
                    {b.Slot?.Ground?.name}
                  </div>
                  {/* <div className="text-gray-500 text-xs">
                    {b.Slot?.Ground?.city}
                  </div> */}
                </td>

                <td className="p-3">
                  {b.Slot?.Ground?.Admin ? (
                    <>
                      <div className="font-medium">
                        {b.Slot.Ground.Admin.name}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {b.Slot.Ground.Admin.email}
                      </div>
                    </>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>


                <td className="p-3">
                  <div>{b.date}</div>
                  <div className="text-gray-500 text-xs">
                    {b.startTime} - {b.endTime}
                  </div>
                </td>

                <td className="p-3">₹{b.totalPrice}</td>

                <td className="p-3">
                  <span
                    className={`font-medium ${
                      b.status === "confirmed"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>

                <td className="p-3">
                  {b.status === "confirmed" ? (
                    <button
                      onClick={() =>
                        setConfirmData({
                          bookingId: b.id,
                          groundName: b.Slot?.Ground?.name,
                        })
                      }
                      disabled={loadingId === b.id}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      {loadingId === b.id
                        ? "Cancelling..."
                        : "Cancel"}
                    </button>
                  ) : (
                    <span className="text-gray-400">
                      Cancelled
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!confirmData}
        title="Cancel Booking"
        message={`Are you sure you want to cancel this booking${
          confirmData?.groundName
            ? ` for ${confirmData.groundName}`
            : ""
        }?`}
        onCancel={() => setConfirmData(null)}
        onConfirm={handleCancel}
      />
    </div>
  );
}
