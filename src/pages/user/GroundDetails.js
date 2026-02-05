import { useEffect, useState } from "react";
import {
  useSearchParams,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import { getPublicGroundById, confirmBooking , getGroundReviews , submitGroundReview} from "../../services/api";
import Toast from "../../components/common/Toast";
import BackButton from "../../components/common/BackButton";
import RateVenueModal from "../../components/common/RateVenueModal";
import Footer from "../../components/common/Footer";
import ReviewList from "../../components/common/ReviewList";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";




const IMAGE_BASE = process.env.REACT_APP_IMAGE_URL;

export default function GroundDetails({ groundId: propGroundId }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedDate = searchParams.get("date");
  const { groundId: paramGroundId } = useParams();
  const groundId = propGroundId || paramGroundId;

  const [ground, setGround] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImagePaused, setIsImagePaused] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("userToken");

  const [showRatingModal, setShowRatingModal] = useState(false);

  const [reviewsData, setReviewsData] = useState({
  avgRating: 0,
  totalReviews: 0,
  reviews: [],
});

  

  

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });


  const showToast = (type, message) =>
    setToast({ show: true, type, message });
  
// ------------------ RATING SUBMISSION ------------------ //
//   const handleRatingSubmit = async ({ rating, feedback }) => {
//   try {
//     await submitGroundReview(groundId, {
//       rating,
//       comment: feedback,
//     });

//     showToast("success", "Thanks for your feedback ⭐");

//     // 🔄 Refresh reviews instantly
//     const res = await getGroundReviews(groundId);
//     setReviewsData(res.data);

//     setShowRatingModal(false);
//   } catch (err) {
//     showToast(
//       "error",
//       err.response?.data?.message || "Failed to submit review"
//     );
//   }
// };
const handleRatingSubmit = async ({ rating, feedback }) => {
  if (!token) {
    showToast("error", "Please login to rate this venue");
    navigate("/user/login");
    return;
  }

  try {
    await submitGroundReview(groundId, {
      rating,
      comment: feedback,
    });

    showToast("success", "Thanks for your feedback ⭐");

    const res = await getGroundReviews(groundId);
    setReviewsData(res.data);

    setShowRatingModal(false);
  } catch (err) {
    showToast(
      "error",
      err.response?.data?.message || "Failed to submit review"
    );
  }
};



// ------------------- Fetching Ratings ------------------- //
  useEffect(() => {
  if (!groundId) return;

  const fetchReviews = async () => {
    try {
      const res = await getGroundReviews(groundId);
      setReviewsData(res.data);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    }
  };

  fetchReviews();
}, [groundId]);


  /* ================= FETCH GROUND ================= */
  useEffect(() => {
    const fetchGround = async () => {
      try {
        const res = await getPublicGroundById(groundId);
        setGround(res.data);
      } catch {
        showToast("error", "Failed to load ground details");
      } finally {
        setLoading(false);
      }
    };
    fetchGround();
  }, [groundId]);

  
const images = ground?.images || [];
  const [touchStartX, setTouchStartX] = useState(null);

  // Auto-rotate images every 5s unless paused by hover
  useEffect(() => {
    if (!images.length || images.length === 1) return;
    if (isImagePaused) return;

    const t = setInterval(() => {
      setCurrentImageIndex((p) => (p + 1) % images.length);
    }, 5000);

    return () => clearInterval(t);
  }, [images.length, isImagePaused]);

  // ---------------------- LOADING STATE ----------------------
  if (loading || !ground) {
    return <p className="text-center mt-20 text-white">Loading...</p>;
  }

  const handlePrevImage = () =>
    setCurrentImageIndex((p) => (p === 0 ? images.length - 1 : p - 1));

  const handleNextImage = () =>
    setCurrentImageIndex((p) => (p === images.length - 1 ? 0 : p + 1));

  const onTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchStartX == null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNextImage();
      else handlePrevImage();
    }
    setTouchStartX(null);
  };

  const onKeyDownSlider = (e) => {
    if (e.key === "ArrowLeft") handlePrevImage();
    if (e.key === "ArrowRight") handleNextImage();
  };
  const formatTime12 = (time) => {
    const [h, m] = time.split(":");
    const hour = Number(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };

  // Date object (for calculations)
const todayObj = new Date();

// String (for <input type="date">)
const todayStr = todayObj.toISOString().split("T")[0];

// Max booking date
const maxBookingDateObj = new Date(todayObj);
maxBookingDateObj.setDate(
  todayObj.getDate() + (ground.advanceBookingDays || 0)
);

const maxDateStr = maxBookingDateObj.toISOString().split("T")[0];

// Current time (used for slot filtering)
const now = new Date();


//---------slots according to the date selected --------//
  const validSlots = Array.isArray(ground.slots)
    ? ground.slots.filter((slot) => {
        if (!selectedDate) return true;
        const slotStart = new Date(`${selectedDate}T${slot.startTime}`);
        return selectedDate !== todayStr || slotStart > now;
      })
    : [];

  const isSlotSelected = (slot) =>
    selectedSlots.some((s) => s.id === slot.id);

  const totalPrice =
    selectedSlots.length * Number(ground.pricePerSlot || 0);

  const handleSlotSelect = (slot) => {
    if (!token) {
      navigate("/user/login", { state: { from: location.pathname } });
      return;
    }
    setSelectedSlots((prev) =>
      prev.some((s) => s.id === slot.id)
        ? prev.filter((s) => s.id !== slot.id)
        : [...prev, slot]
    );
  };





//------------------- CONFIRM BOOKING HANDLER ---------------------//
  const handleConfirmBooking = async () => {
    if (!selectedDate || selectedSlots.length === 0) {
      showToast("error", "Select date and slots");
      return;
    }
    try {
      await confirmBooking({
        slotIds: selectedSlots.map((s) => s.id),
        date: selectedDate,
      });
      showToast("success", "Booking confirmed 🎉");
      setSelectedSlots([]);
    } catch (err) {
      showToast("error", err.response?.data?.message || "Booking failed");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-900 overflow-y-auto pt-10 pb-16 text-gray-800">
          
     

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
             <BackButton to="/user/bookingslot" />
            {/* IMAGE SLIDER */}
            <div
              className="relative rounded-xl lg:rounded-2xl overflow-hidden h-[280px] sm:h-[350px] lg:h-[420px] bg-gray-800"
              onMouseEnter={() => setIsImagePaused(true)}
              onMouseLeave={() => setIsImagePaused(false)}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              onKeyDown={onKeyDownSlider}
              tabIndex={0}
            >
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={`${IMAGE_BASE}${img.imageUrl}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                    idx === currentImageIndex ? "opacity-100 z-20" : "opacity-0 z-10"
                  }`}
                  alt={`${ground.name} - ${idx + 1}`}
                />
              ))}

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 z-30" />

              {/* Controls */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur z-40"
                    aria-label="previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur z-40"
                    aria-label="next image"
                  >
                    <ChevronRight size={24} />
                  </button>

                  {/* Dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-40">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImageIndex(i)}
                        className={`w-2 h-2 rounded-full ${
                          i === currentImageIndex ? "bg-white" : "bg-white/40"
                        }`}
                        aria-label={`Go to image ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* BASIC INFO */}
            <div className="bg-white rounded-xl lg:rounded-2xl p-4 sm:p-6 shadow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl font-bold">{ground.name}</h1>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">
                    ⏰ {ground.openingTime} – {ground.closingTime}
                  </p>
                  <p className="text-indigo-600 font-medium mt-1 text-sm sm:text-base">
                    🎮 {ground.game}
                  </p>
                  <p className="text-indigo-600 font-medium mt-1 text-sm sm:text-base">
                    📞 {ground.contactNo}
                  </p>
                  <p className="text-gray-600 mt-2 text-sm sm:text-base">
                    {ground.area}, {ground.city}, {ground.state}, {ground.country}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-indigo-600 text-white px-3 py-1 rounded-lg">
                      <Star size={16} className="text-yellow-400" />
                      <span className="ml-2 font-semibold">{(reviewsData.avgRating || 0).toFixed(1)}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      <div>{reviewsData.totalReviews || 0} reviews</div>
                      <div className="text-xs">Updated recently</div>
                    </div>
                  </div>

                  {/* Rating breakdown - hidden on mobile, shown on larger screens */}
                  <div className="hidden sm:block w-40">
                    {[5,4,3,2,1].map((r) => {
                      const count = (reviewsData.reviews || []).filter(rv => rv.rating === r).length;
                      const total = reviewsData.totalReviews || 0;
                      const pct = total ? Math.round((count / total) * 100) : 0;
                      return (
                        <div key={r} className="flex items-center gap-2 text-xs">
                          <span className="w-4">{r}★</span>
                          <div className="h-2 bg-gray-200 rounded flex-1 overflow-hidden">
                            <div className="h-2 bg-yellow-400 rounded transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-6 text-right text-gray-500">{pct}%</span>
                        </div>
                      )
                    })}
                  </div>

                  <button
                    onClick={() =>
                      token ? setShowRatingModal(true) : navigate("/user/login")
                    }
                    className="text-indigo-600 text-sm font-medium hover:underline whitespace-nowrap"
                  >
                    Rate Venue
                  </button>
                </div>
              </div>
            </div>

            {/* AMENITIES */}
            <div className="bg-white rounded-xl lg:rounded-2xl p-4 sm:p-6 shadow">
              <h2 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-sm">
                {ground.amenities?.map((a, i) => (
                  <div key={i} className="flex items-center gap-2">
                    ✔ {a.name}
                  </div>
                ))}
              </div>
            </div>

            {/* ABOUT */}
            <div className="bg-white rounded-xl lg:rounded-2xl p-4 sm:p-6 shadow">
              <h2 className="font-semibold text-base sm:text-lg mb-2">About Venue</h2>
              <p className="text-gray-600 text-sm sm:text-base">
                {ground.description || "No description available"}
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="bg-white rounded-xl lg:rounded-2xl p-4 sm:p-6 shadow-xl h-fit lg:sticky lg:top-24">

            <h4 className="font-semibold mb-2 text-base sm:text-lg">Price</h4>

            <p className="text-2xl sm:text-3xl font-bold text-green-600">
              ₹{ground.pricePerSlot}
            </p>
            <p className="text-sm text-gray-500">per slot</p>

            <hr className="my-3 sm:my-4" />

            <label className="font-medium block mb-2 text-sm sm:text-base">
              Select Date
            </label>

            <input
              type="date"
              min={todayStr}
              max={maxDateStr}
              value={selectedDate || ""}
              onChange={(e) => {
                setSearchParams({ date: e.target.value });
              }}
              className="input-style w-full"
            />

            <p className="text-xs text-gray-500 mt-1">
              Booking allowed till {maxBookingDateObj.toLocaleDateString()}
            </p>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-4">
              {validSlots.map((slot) => {
                const selected = isSlotSelected(slot);
                return (
                  <button
                    key={slot.id}
                    onClick={() => handleSlotSelect(slot)}
                    className={`py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors
                      ${
                        selected
                          ? "bg-indigo-600 text-white"
                          : "border border-gray-300 hover:border-indigo-500 text-gray-700"
                      }`}
                  >
                    {formatTime12(slot.startTime)} -{" "}
                    {formatTime12(slot.endTime)}
                  </button>
                );
              })}
            </div>

            <p className="font-bold text-base sm:text-lg mt-4 sm:mt-6">
              Total: <span className="text-green-600">₹{totalPrice}</span>
            </p>

            <button
              onClick={() =>
                token ? handleConfirmBooking() : navigate("/user/login")
              }
              className="w-full mt-3 sm:mt-4 py-2 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm sm:text-base transition-colors"
            >
              {token ? "Confirm Booking" : "Login to Book"}
            </button>

            {ground.locationUrl && (
              <div className="mt-4 sm:mt-6 bg-white rounded-xl shadow p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-semibold mb-2">📍 Location</h3>
                <button
                  onClick={() => window.open(ground.locationUrl, '_blank')}
                  className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                >
                  Open in Google Maps
                </button>
              </div>
            )}

          </div>
        </div>

        {/* REVIEW SECTION */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <h1 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">Ground Reviews</h1>
          <ReviewList groundId={groundId} />
        </div>
      </div>
      <RateVenueModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRatingSubmit}
      />


      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, show: false })}
      />

        <hr className="my-10 border-t border-gray-700" />
            <Footer/>
    </div>
  );
}
