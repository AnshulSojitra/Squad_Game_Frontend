import { useEffect, useState } from "react";
import {
  useSearchParams,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import { getPublicGroundById, getGroundReviews, submitGroundReview} from "../../services/api";
import { useTheme } from "../../context/ThemeContext";
import Toast from "../../components/common/Toast";
import BackButton from "../../components/common/BackButton";
import RateVenueModal from "../../components/common/RateVenueModal";
import Footer from "../../components/common/Footer";
import ReviewList from "../../components/common/ReviewList";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import RazorpayPayment from "../../components/payment/RazorpayPayment"





const IMAGE_BASE = process.env.REACT_APP_IMAGE_URL;

export default function GroundDetails({ groundId: propGroundId }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedDate = searchParams.get("date");
  const { groundId: paramGroundId } = useParams();
  const groundId = propGroundId || paramGroundId;
  const { isDarkMode } = useTheme();

  const [ground, setGround] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImagePaused, setIsImagePaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const gstPercentage = ground?.gstPercentage || 0;
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
  

// ------------------- Fetch User Profile ------------------- //
  
// ------------------ RATING SUBMISSION ------------------ //
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
  if (!groundId) return;

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

  /* ================= FETCH GROUND WITH DATE ================= */

  useEffect(() => {
  if (!groundId || !selectedDate) return;

  const fetchSlotsForDate = async () => {
    try {
      const res = await getPublicGroundById(groundId, selectedDate);

      // 🔥 only replace slots, not entire ground
      setGround((prev) => ({
        ...prev,
        slots: res.data.slots,
      }));

      setSelectedSlots([]); // reset selection on date change
    } catch {
      showToast("error", "Failed to load slots");
    }
  };

  fetchSlotsForDate();
}, [groundId, selectedDate]);

  
// Image View
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
// GST AMOUNT
  const gstAmount = ((totalPrice * gstPercentage) / 100).toFixed(2);

// total amount after tax
  const totalAmount = (Number(totalPrice) + Number(gstAmount)).toFixed(2);


    const handleSlotSelect = (slot) => {
      // 🚫 Block booked slots
      if (!slot.available) return;

      if (!token) {
        navigate("/user/login", { state: { from: location.pathname } });
        return;
      }

      setSelectedSlots((prev) =>
        prev.some((s) => s.id === slot.id)
          ? prev.filter((s) => s.id !== slot.id)
          : [...prev, slot]
      );
      console.log("SLOT DEBUG", slot.id, slot.available, typeof slot.available);

    };




//================= UI ================= */
  return (
    <>
    <div className={`min-h-screen overflow-y-auto pt-10 pb-16 transition-colors duration-300 ${
      isDarkMode
        ? 'bg-gray-900 text-gray-100'
        : 'bg-white text-gray-900'
    }`}>
          
     

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
             <BackButton to="/user/bookingslot" />
            {/* IMAGE SLIDER */}
            <div
              className={`relative rounded-xl lg:rounded-2xl overflow-hidden h-[280px] sm:h-[350px] lg:h-[420px] transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
              }`}
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
            <div className={`rounded-xl lg:rounded-2xl p-4 sm:p-6 shadow transition-colors duration-300 ${
              isDarkMode
                ? 'bg-gray-800/50 text-white'
                : 'bg-gray-50 text-gray-900 border border-gray-200'
            }`}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl font-bold">{ground.name}</h1>
                  <p className={`mt-1 text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    ⏰ {ground.openingTime} – {ground.closingTime}
                  </p>
                  <p className={`font-medium mt-1 text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    🎮 {ground.game}
                  </p>
                  <p className={`font-medium mt-1 text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    📞 {ground.contactNo}
                  </p>
                  <p className={`mt-2 text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
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
                        <div key={r} className={`flex items-center gap-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <span className="w-4">{r}★</span>
                          <div className={`h-2 rounded flex-1 overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <div className="h-2 bg-yellow-400 rounded transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className={`w-6 text-right ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{pct}%</span>
                        </div>
                      )
                    })}
                  </div>

                  <button
                    onClick={() =>
                      token ? setShowRatingModal(true) : navigate("/user/login")
                    }
                    className={`text-sm font-medium hover:underline whitespace-nowrap ${
                      isDarkMode ? 'text-indigo-600' : 'text-indigo-600'
                    }`}
                  >
                    Rate Venue
                  </button>
                </div>
              </div>
            </div>

            {/* AMENITIES */}
            <div className={`rounded-xl lg:rounded-2xl p-4 sm:p-6 shadow transition-colors duration-300 ${
              isDarkMode
                ? 'bg-gray-800/50 text-white'
                : 'bg-gray-50 text-gray-900 border border-gray-200'
            }`}>
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
            <div className={`rounded-xl lg:rounded-2xl p-4 sm:p-6 shadow transition-colors duration-300 ${
              isDarkMode
                ? 'bg-gray-800/50 text-white'
                : 'bg-gray-50 text-gray-900 border border-gray-200'
            }`}>
              <h2 className="font-semibold text-base sm:text-lg mb-2">About Venue</h2>
              <p className={`text-sm sm:text-base ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {ground.description || "No description available"}
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className={`rounded-xl lg:rounded-2xl p-4 sm:p-6 shadow-xl h-fit lg:sticky lg:top-24 transition-colors duration-300 ${
            isDarkMode
              ? 'bg-gray-800/50 text-white'
              : 'bg-gray-50 text-gray-900 border border-gray-200'
          }`}>

            <h4 className="font-semibold mb-2 text-base sm:text-lg">Price</h4>

            <p className="text-2xl sm:text-3xl font-bold text-green-600">
              ₹{ground.pricePerSlot}
            </p>
            <p className="text-sm text-gray-300">per slot</p>

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
              className={`input-style w-full text-sm sm:text-base rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300 ${
                isDarkMode
                  ? 'text-white bg-gray-700 border border-gray-600'
                  : 'text-gray-900 bg-white border border-gray-300'
              }`}
            />

            <p className={`text-xs mt-1 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Booking allowed till {maxBookingDateObj.toLocaleDateString()}
            </p>

             <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-4">
                {validSlots.map((slot) => {
                    const selected = isSlotSelected(slot);
                    const isBooked = !Boolean(slot.available);

                    return (
                      <button
                        key={slot.id}
                        disabled={isBooked}
                        onClick={() => handleSlotSelect(slot)}
                        className={`py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-all
                          ${
                            isBooked
                              ? isDarkMode
                                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : selected
                              ? "bg-indigo-600 text-white"
                              : isDarkMode
                              ? "border border-gray-600 hover:border-indigo-500 text-gray-300"
                              : "border border-gray-300 hover:border-indigo-500 text-gray-900"
                          }
                        `}
                        title={isBooked ? "Slot already booked" : ""}
                      >
                        {formatTime12(slot.startTime)} - {formatTime12(slot.endTime)}
                        {isBooked && (
                          <span className="block text-[10px] text-red-500 mt-1">
                            Booked
                          </span>
                        )}
                      </button>
                    );
                })}
             </div>

            
              <hr className="my-3 sm:my-4" />

              {selectedDate && selectedSlots.length > 0 ? (
                <>
                  {/* <p className="font-bold text-base sm:text-lg mt-4 sm:mt-6"> */}
                  <p className={`font-bold text-base sm:text-base mt-4 sm:mt-6 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Ground Price : <span className="text-green-600">₹{totalPrice}</span>
                  </p>
                  <p className={`font-bold text-base sm:text-base mt-4 sm:mt-6 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Tax : <span className="text-green-600">{gstPercentage}%</span>
                  </p>
                  
                  <p className={`font-bold text-base sm:text-sm mt-4 sm:mt-6 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Total Tax : <span className="text-green-600"> {gstAmount}</span>
                  </p> 
                  <hr className={`my-3 sm:my-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                  <p className={`font-bold text-base sm:text-lg mt-4 sm:mt-6 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Total Amount : <span className="text-green-600">₹{totalAmount}</span>
                  </p>
                </>
              ) : (
                    <p className={`mt-4 sm:mt-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Select date and slots to see price details</p>
              )}

            {/* {selectedDate && selectedSlots.length > 0 && user && totalPrice > 0 ? (
              <RazorpayPayment
                amount={totalPrice}
                bookingId={selectedSlotIds}
                user={user}
                selectedDate={selectedDate}
              />
            ) : (
              <button
                onClick={() => {
                  if (!token) {
                    navigate("/user/login");
                  } else if (!selectedDate || selectedSlots.length === 0) {
                    showToast("error", "Please select date and slots");
                  }
                }}
                disabled={totalPrice === 0}
                className="w-full mt-4 sm:mt-6 py-2 sm:py-3 bg-gray-400 text-white rounded-lg font-medium text-sm sm:text-base transition-colors cursor-not-allowed"
              >
                {token ? "Select date and slots" : "Login to Book"}
              </button>
            )} */}

            {selectedDate && selectedSlots.length > 0 ? (
              <RazorpayPayment
                slotIds={selectedSlots.map(s => s.id)}
                selectedDate={selectedDate}
                amount={totalAmount}
              />
            ) : (
              <button
                disabled
                className={`w-full mt-4 py-3 rounded-lg font-medium transition-colors cursor-not-allowed ${
                  isDarkMode
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-gray-300 text-gray-500'
                }`}
              >
                Select date and slots
              </button>
            )}

            {ground.locationUrl && (
              <div className={`mt-4 sm:mt-6 rounded-xl shadow p-3 sm:p-4 transition-colors duration-300 ${
                isDarkMode
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
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
          <h1 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Ground Reviews</h1>
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
    </div>
            <Footer/>
    </>
  );
}
