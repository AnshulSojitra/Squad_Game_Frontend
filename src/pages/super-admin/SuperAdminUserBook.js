import { useEffect, useState } from "react";
import { useParams , useNavigate } from "react-router-dom";
import {
  SupAdigetUserBookings,
  cancelBookingBySuperAdmin,
} from "../../services/api";
import ConfirmModal from "../../components/common/ConfirmModal";
import Pagination from "../../components/common/Pagination";

export default function SuperAdminUserBook() {
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 2;
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
    // if (newPage < 1 || newPage > totalPages) return null;
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

  if (!data) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <button
        onClick={() => navigate("/super-admin/users")}
        className="mb-4 flex items-center gap-2 text-sm font-medium text-white hover:text-gray-400"
      >
        ← Back to Users
      </button>

      <h1 className="text-2xl font-bold mb-1 text-white">
        Bookings of {data.user.name}
      </h1>
      <p className="text-gray-100 mb-6">{data.user.email}</p>

      <div className="space-y-4">
        {paginatedBookings.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-lg">
                {b.Slot.Ground.name}
              </p>
              <p className="text-sm text-gray-600">
                {b.date} | {b.startTime} - {b.endTime}
              </p>
              <p className="text-sm">
                ₹{b.totalPrice} •{" "}
                <span
                  className={`font-semibold ${
                    b.status === "confirmed"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {b.status}
                </span>
              </p>
            </div>

            {b.status !== "cancelled" && (
              <button
                onClick={() => openCancelConfirm(b.id)}
                disabled={loadingId === b.id}
                className={`px-4 py-2 rounded text-white bg-red-600 hover:bg-red-700 ${
                  loadingId === b.id
                    ? "opacity-60 cursor-not-allowed"
                    : ""
                }`}
              >
                {loadingId === b.id
                  ? "Cancelling..."
                  : "Cancel Booking"}
              </button>
            )}
          </div>
        ))}
      </div>
      {/* <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      /> */}

      <div className="mt-8 flex justify-center">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>



      {/* CONFIRM MODAL */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        onConfirm={handleConfirmCancel}
        onCancel={handleCancelModal}
      />
      
    </div>
  );
}
