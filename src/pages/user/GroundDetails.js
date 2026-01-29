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
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import RateVenueModal from "../../components/common/RateVenueModal";
import Footer from "../../components/common/Footer";
import ReviewList from "../../components/common/ReviewList";




const IMAGE_BASE = process.env.REACT_APP_IMAGE_URL;

export default function GroundDetails({ groundId: propGroundId }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedDate = searchParams.get("date");
  const { groundId: paramGroundId } = useParams();
  const groundId = propGroundId || paramGroundId;

  const [ground, setGround] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  const { isLoaded } = useLoadScript({
  googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
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

  
// ---------------------- LOADING STATE ----------------------
  if (loading || !ground) {
    return <p className="text-center mt-20 text-white">Loading...</p>;
  }

  const images = ground.images || [];

  const handlePrevImage = () =>
    setCurrentImageIndex((p) => (p === 0 ? images.length - 1 : p - 1));

  const handleNextImage = () =>
    setCurrentImageIndex((p) => (p === images.length - 1 ? 0 : p + 1));

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

  const extractIframeSrc = (iframeString) => {
  if (!iframeString) return null;

  const match = iframeString.match(/src="([^"]+)"/);
  return match ? match[1] : null;
};

const mapSrc = extractIframeSrc(ground.locationUrl);


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
    <div className="h-screen bg-gray-900 overflow-y-auto">
          
     

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">
             <BackButton to="/user/bookingslot" />
            {/* IMAGE SLIDER */}
            <div className="relative rounded-2xl overflow-y-auto h-[420px]">
              <img
                src={`${IMAGE_BASE}${images[currentImageIndex]?.imageUrl}`}
                className="w-full h-full object-cover"
                alt={ground.name}
              />
              <div className="absolute inset-0 bg-black/30" />

              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2
                               bg-white/30 hover:bg-white/50
                               text-white p-3 rounded-full"
                  >
                    ‹
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2
                               bg-white/30 hover:bg-white/50
                               text-white p-3 rounded-full"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* BASIC INFO */}
            <div className="bg-white rounded-2xl p-6 shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">{ground.name}</h1>
                   <p className="text-gray-600 mt-1">
                     ⏰ {ground.openingTime} – {ground.closingTime}
                   </p>
                  <p className="text-indigo-600 font-medium mt-1">
                   🎮 {ground.game}
                 </p>

                 <p className="text-indigo-600 font-medium mt-1">
                   📞 {ground.contactNo}
                 </p>
                  <p className="text-gray-600 mt-2">
                    {ground.area}, {ground.city}, {ground.state}, {ground.country}
                  </p>
                </div>
                {/* <p className="font-semibold">
                  ⭐ 4.6 <span className="text-gray-500">(21)</span>
                </p> */}
                <div className="flex items-center gap-3 mt-2">
                <p className="font-semibold text-lg">
                  ⭐ {reviewsData.avgRating || 0}
                  <span className="text-gray-500">
                  ({reviewsData.totalReviews || 0})
                </span>
                </p>

                <button
                  onClick={() =>
                    token ? setShowRatingModal(true) : navigate("/user/login")
                  }
                  className="text-indigo-600 text-sm font-medium hover:underline"
                >
                  Rate Venue
                </button>
              </div>

              </div>
            </div>

            {/* AMENITIES */}
            <div className="bg-white rounded-2xl p-6 shadow">
              <h2 className="font-semibold text-lg mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                {ground.amenities?.map((a, i) => (
                  <div key={i} className="flex items-center gap-2">
                    ✔ {a.name}
                  </div>
                ))}
              </div>
            </div>

            {/* ABOUT */}
            <div className="bg-white rounded-2xl p-6 shadow">
              <h2 className="font-semibold text-lg mb-2">About Venue</h2>
              <p className="text-gray-600">
                {ground.description || "No description available"}
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="bg-white rounded-2xl p-6 shadow-xl h-fit sticky top-24">

              <h4 className="font-semibold mb-2">Price</h4>
           
                   <p className="text-3xl font-bold text-green-600">
                     ₹{ground.pricePerSlot}
                   </p>
                   <p className="text-sm text-gray-500">per slot</p>
                 

            <hr className="my-4" />

            <label className="font-medium block mb-2">
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
            className="input-style"
          />

          <p className="text-xs text-gray-500 mt-1">
            Booking allowed till {maxBookingDateObj.toLocaleDateString()}
          </p>



            <div className="grid grid-cols-2 gap-3">
              {validSlots.map((slot) => {
                const selected = isSlotSelected(slot);
                return (
                  <button
                    key={slot.id}
                    onClick={() => handleSlotSelect(slot)}
                    className={`py-2 rounded-lg text-sm
                      ${
                        selected
                          ? "bg-indigo-600 text-white"
                          : "border hover:border-indigo-500"
                      }`}
                  >
                    {formatTime12(slot.startTime)} -{" "}
                    {formatTime12(slot.endTime)}
                  </button>
                );
              })}
            </div>

            <p className="font-bold text-lg mt-6">
              Total: <span className="text-green-600">₹{totalPrice}</span>
            </p>

            <button
              onClick={() =>
                token ? handleConfirmBooking() : navigate("/user/login")
              }
              className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
            >
              {token ? "Confirm Booking" : "Login to Book"}
            </button>

              {isLoaded && ground.latitude && ground.longitude && (
              <div className="mt-6 bg-white rounded-xl shadow p-4">
                <h3 className="text-lg font-semibold mb-2">📍 Location</h3>

                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "300px" }}
                  center={{
                    lat: Number(ground.latitude),
                    lng: Number(ground.longitude),
                  }}
                  zoom={16}
                >
                  <Marker
                    position={{
                      lat: Number(ground.latitude),
                      lng: Number(ground.longitude),
                    }}
                  />
                </GoogleMap>
              </div>
            )}

          </div>
        </div>
        {/* REVIEW SECTION  */}
        <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-xl font-bold mb-4 text-white">Ground Reviews</h1>
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
