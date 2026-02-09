import { useEffect, useState } from "react";
import { getUserBookings, cancelUserBooking } from "../../services/api";
import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";
import ConfirmModal from "../../components/common/ConfirmModal";


export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(null);
  const ITEMS_PER_PAGE = 10;
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'cancelled'
  const [activePage, setActivePage] = useState(1);
  const [cancelledPage, setCancelledPage] = useState(1);

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

// <---------showing toast----------> 
const showToast = (type, message) => {
  setToast({ show: true, type, message });
};

// <------------fetching Bookings----------------->
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

  // const formatTime = (time) => {
  //   const [hour, minute] = time.split(":");
  //   const h = Number(hour);
  //   const suffix = h >= 12 ? "PM" : "AM";
  //   const formattedHour = h % 12 || 12;
  //   return `${formattedHour}:${minute} ${suffix}`;
  // };


  // const handleCancel = async (bookingId) => {
  //   if (!window.confirm("Are you sure you want to cancel this booking?")) return;

  //   try {
  //     setCancelLoading(bookingId);
  //     await cancelUserBooking(bookingId);

  //     // Update UI instantly
  //     setBookings((prev) =>
  //       prev.map((b) =>
  //         b.bookingId === bookingId
  //           ? { ...b, status: "cancelled" }
  //           : b
  //       )
  //     );
  //   } catch (err) {
  //     showToast("error","Failed to cancel booking");
  //   } finally {
  //     setCancelLoading(null);
  //   }
  // };

  const openCancelModal = (bookingId) => {
  setSelectedBookingId(bookingId);
  setShowConfirm(true);
};


const confirmCancelBooking = async () => {
  try {
    setCancelLoading(selectedBookingId);
    await cancelUserBooking(selectedBookingId);

    setBookings((prev) =>
      prev.map((b) =>
        b.bookingId === selectedBookingId
          ? { ...b, status: "cancelled" }
          : b
      )
    );

    showToast("success", "Booking cancelled successfully");
  } catch (err) {
    showToast("error", "Failed to cancel booking");
  } finally {
    setCancelLoading(null);
    setShowConfirm(false);
    setSelectedBookingId(null);
  }
};


  // Filter bookings
  const activeBookings = bookings.filter(b => b.status === "confirmed" || b.status === "completed");
  const cancelledBookings = bookings.filter(b => b.status === "cancelled");

  // Pagination for active bookings
  const totalActivePages = Math.ceil(activeBookings.length / ITEMS_PER_PAGE);
  const paginatedActiveBookings = activeBookings.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE
  );

  // Pagination for cancelled bookings
  const totalCancelledPages = Math.ceil(cancelledBookings.length / ITEMS_PER_PAGE);
  const paginatedCancelledBookings = cancelledBookings.slice(
    (cancelledPage - 1) * ITEMS_PER_PAGE,
    cancelledPage * ITEMS_PER_PAGE
  );


  const renderBookingTable = (bookings, showCancelButton = false, isCancelledSection = false) => (
    <>
      {/* MOBILE CARD VIEW */}
      <div className="block md:hidden space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.bookingId}
            className={`rounded-xl p-4 border transition-all duration-200 ${
              isCancelledSection
                ? 'bg-red-900/20 border-red-700 hover:bg-red-800/30'
                : 'bg-gray-800 border-gray-700 hover:bg-gray-750'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-white text-sm mb-1">
                  {booking.ground.name}
                </h3>
                <p className="text-xs text-gray-400">
                  {booking.ground.area}, {booking.ground.state}, {booking.ground.country}
                </p>
              </div>
              <span
                className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                  booking.status === "confirmed"
                    ? "bg-green-900 text-green-300"
                    : booking.status === "completed"
                    ? "bg-blue-900 text-blue-300"
                    : booking.status === "cancelled"
                    ? "bg-red-900 text-red-300"
                    : "bg-yellow-900 text-yellow-300"
                }`}
              >
                {booking.status}
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Date</p>
                <p className="text-sm text-white font-medium">{booking.date}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Time</p>
                <p className="text-sm text-white font-medium">
                  {/* {formatTime(booking.startTime)} - {formatTime(booking.endTime)} */}
                  {booking.startTime}-{booking.endTime}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Price</p>
                <p className="text-sm font-semibold text-green-400">₹{booking.totalPrice}</p>
              </div>
              {showCancelButton && (
                <div className="flex items-end">
                  {booking.status === "confirmed" && (
                    <button
                     onClick={() => openCancelModal(booking.bookingId)}
                      disabled={cancelLoading === booking.bookingId}
                      className={`w-full px-3 py-2 text-xs font-medium rounded-lg text-white transition-colors ${
                        cancelLoading === booking.bookingId
                          ? "bg-red-500 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {cancelLoading === booking.bookingId ? "Cancelling..." : "Cancel"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className={`hidden md:block overflow-x-auto rounded-lg shadow-lg border ${
        isCancelledSection
          ? 'bg-red-900/20 border-red-700'
          : 'bg-gray-700 border-gray-600'
      }`}>
        <table className="w-full">
          <thead className={isCancelledSection ? 'bg-red-800' : 'bg-gray-600'}>
            <tr>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Ground
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Slot
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Status
              </th>
              {showCancelButton && (
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Action
                </th>
              )}
            </tr>
          </thead>

          <tbody className={isCancelledSection ? 'divide-y divide-red-700' : 'divide-y divide-gray-600'}>
            {bookings.map((booking) => (
              <tr
                key={booking.bookingId}
                className={`transition-colors ${
                  isCancelledSection
                    ? 'hover:bg-red-800/30'
                    : 'hover:bg-gray-600'
                }`}
              >
                <td className="px-4 lg:px-6 py-4">
                  <div>
                    <p className="font-semibold text-white text-sm">
                      {booking.ground.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {booking.ground.area}, {booking.ground.city}, {booking.ground.state}
                    </p>
                  </div>
                </td>

                <td className="px-4 lg:px-6 py-4 text-gray-300 text-sm">
                  {booking.date}
                </td>

                <td className="px-4 lg:px-6 py-4 text-gray-300 text-sm">
                  {/* {formatTime(booking.startTime)} – {formatTime(booking.endTime)} */}
                    {booking.slot.startTime} - {booking.slot.endTime}
                </td>

                <td className="px-4 lg:px-6 py-4 font-semibold text-green-400 text-sm">
                  ₹{booking.totalPrice}
                </td>

                <td className="px-4 lg:px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === "confirmed"
                        ? "bg-green-900 text-green-300"
                        : booking.status === "completed"
                        ? "bg-blue-900 text-blue-300"
                        : booking.status === "cancelled"
                        ? "bg-red-900 text-red-300"
                        : "bg-yellow-900 text-yellow-300"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>

                {showCancelButton && (
                  <td className="px-4 lg:px-6 py-4">
                    {booking.status === "confirmed" && (
                      <button
                        onClick={() => openCancelModal(booking.bookingId)}
                        disabled={cancelLoading === booking.bookingId}
                        className={`px-3 py-2 text-xs font-medium rounded-lg text-white transition-colors ${
                          cancelLoading === booking.bookingId
                            ? "bg-red-500 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        {cancelLoading === booking.bookingId ? "Cancelling..." : "Cancel"}
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">My Bookings</h1>

        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-1 mb-6 sm:mb-8 bg-gray-800 p-1 rounded-lg w-full sm:w-fit">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 sm:px-6 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'bookings'
                ? 'bg-green-600 text-white shadow-md'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="whitespace-nowrap">Bookings ({activeBookings.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`px-4 sm:px-6 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'cancelled'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span className="whitespace-nowrap">Cancelled ({cancelledBookings.length})</span>
          </button>
        </div>
        {/* Tab Content */}
        {activeTab === 'bookings' && (
          <div>
            {activeBookings.length === 0 ? (
              <div className="text-center py-12 sm:py-16 bg-gray-700 rounded-lg border border-gray-600">
                <div className="text-4xl sm:text-5xl mb-4">📅</div>
                <p className="text-gray-400 text-lg sm:text-xl">
                  No active bookings
                </p>
                <p className="text-gray-500 text-sm sm:text-base mt-2 px-4">
                  Your confirmed and completed bookings will appear here
                </p>
              </div>
            ) : (
              <>
                {renderBookingTable(paginatedActiveBookings, true, false)}
                <div className="mt-6 sm:mt-8 flex justify-center">
                  <Pagination
                    currentPage={activePage}
                    totalPages={totalActivePages}
                    onPageChange={setActivePage}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'cancelled' && (
          <div>
            {cancelledBookings.length === 0 ? (
              <div className="text-center py-12 sm:py-16 bg-red-900/20 rounded-lg border border-red-700">
                <div className="text-4xl sm:text-5xl mb-4">🚫</div>
                <p className="text-gray-400 text-lg sm:text-xl">
                  No cancelled bookings
                </p>
                <p className="text-gray-500 text-sm sm:text-base mt-2 px-4">
                  Your cancelled bookings will appear here
                </p>
              </div>
            ) : (
              <>
                {renderBookingTable(paginatedCancelledBookings, false, true)}
                <div className="mt-6 sm:mt-8 flex justify-center">
                  <Pagination
                    currentPage={cancelledPage}
                    totalPages={totalCancelledPages}
                    onPageChange={setCancelledPage}
                  />
                  

                </div>
              </>
            )}
          </div>
        )}

      </div>

        <ConfirmModal
                    isOpen={showConfirm}
                    title="Cancel Booking"
                    message="Are you sure you want to cancel this booking?"
                    onConfirm={confirmCancelBooking}
                    onCancel={() => {
                      setShowConfirm(false);
                      setSelectedBookingId(null);
                    }}
                  />

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
