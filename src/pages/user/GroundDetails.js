import { useEffect, useState } from "react";
import { useSearchParams , useNavigate , useLocation , useParams } from "react-router-dom";
import { getPublicGroundById , confirmBooking } from "../../services/api";

const IMAGE_BASE = process.env.REACT_APP_IMAGE_URL;

export default function GroundDetails({ groundId: propGroundId }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedDate = searchParams.get("date");
  const { groundId: paramGroundId } = useParams();

   // 🔑 Decide source of truth
  const groundId = propGroundId || paramGroundId;


  const [ground, setGround] = useState(null);
//   const [selectedSlot, setSelectedSlot] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();
  const location = useLocation();
  const userToken = localStorage.getItem("userToken");


  useEffect(() => {
    const fetchGround = async () => {
      try {
        const res = await getPublicGroundById(groundId);
        setGround(res.data);
      } catch {
        alert("Failed to load ground details");
      } finally {
        setLoading(false);
      }
    };

    fetchGround();
  }, [groundId]);

  const formatTime12 = (time) => {
  if (!time) return "";

  const [hours, minutes] = time.split(":");
  const h = parseInt(hours, 10);

  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;

  return `${hour12.toString().padStart(2, "0")}:${minutes} ${period}`;
};


//   const toggleSlot = (slot) => {
//   setSelectedSlots((prev) => {
//     const exists = prev.find(
//       (s) => s.startTime === slot.startTime && s.endTime === slot.endTime
//     );

//     if (exists) {
//       // remove slot
//       return prev.filter(
//         (s) =>
//           !(s.startTime === slot.startTime && s.endTime === slot.endTime)
//       );
//     } else {
//       // add slot
//       return [...prev, slot];
//     }
//   });
// };

    const isSlotSelected = (slot) =>
    selectedSlots.some(
        (s) => s.startTime === slot.startTime && s.endTime === slot.endTime
    );

    const totalPrice =
  selectedSlots.length * Number(ground?.pricePerSlot || 0);



  if (loading || !ground) {
    return <p className="text-center mt-10">Loading ground...</p>;
  }

  /* ================= FILTER VALID SLOTS ================= */
  const today = new Date().toISOString().split("T")[0];
  const now = new Date();

  const validSlots = Array.isArray(ground.slots)
    ? ground.slots.filter((slot) => {
        if (!selectedDate) return true;

        const slotStart = new Date(`${selectedDate}T${slot.startTime}`);

        if (selectedDate === today) {
          return slotStart > now;
        }

        return true;
      })
    : [];

    const handleConfirmBooking = async () => {
      if (!token) {
      navigate("/user/login", {
        state: { from: location.pathname + location.search },
      });
      return;
    }

    if (!selectedDate || selectedSlots.length === 0) {
      alert("Select date and slots");
      return;
    }

    try {
        await confirmBooking({
        slotIds: selectedSlots.map(slot => slot.id),
        date: selectedDate,
        });

        alert("Booking confirmed 🎉");
        setSelectedSlots([]);
    } catch (err) {
        alert(err.response?.data?.message || "Booking failed");
    }
    };


    const handleSlotSelect = (slot) => {
  if (!token) {
    navigate("/user/login", {
      state: { from: location.pathname + location.search }
    });
    return;
  }

  setSelectedSlots(prev =>
    prev.some(s => s.id === slot.id)
      ? prev.filter(s => s.id !== slot.id)
      : [...prev, slot]
  );
};


  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">

        {/* BACK */}
        <div className="p-4 border-b">
          <button
            onClick={() => navigate("/user/bookingslot")}
            className="text-indigo-600 font-medium"
          >
            ← Back to Grounds
          </button>
        </div>

        {/* IMAGE */}
        <div className="h-64 bg-gray-200">
          <img
            src={
              ground.images?.[0]
                ? `${IMAGE_BASE}${ground.images[0].imageUrl}`
                : "/placeholder.png"
            }
            alt={ground.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* INFO */}
        <div className="p-6 space-y-3">
          <h1 className="text-2xl font-bold">{ground.name}</h1>

          <p className="text-sm text-indigo-600">🎮 {ground.game}</p>

          <p className="text-gray-600">
            📍 {[ground.area, ground.city, ground.state, ground.country]
              .filter(Boolean)
              .join(", ")}
          </p>

          <p className="text-gray-600">
            ⏰ {ground.openingTime} – {ground.closingTime}
          </p>

          <p className="text-green-600 text-lg font-semibold">
            ₹{ground.pricePerSlot} / slot
          </p>

          {/* AMENITIES */}
          {ground.amenities?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {ground.amenities.map((a, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-xs bg-gray-700 text-gray-200 rounded-full"
                >
                  {typeof a === "string" ? a : a.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* DATE PICKER */}
        <div className="p-6 border-t">
          <label className="block mb-2 font-medium">Select Date</label>
          <input
            type="date"
            min={today}
            value={selectedDate || ""}
            onChange={(e) => setSearchParams({ date: e.target.value })}
            className="border rounded-lg px-4 py-2 w-60"
          />
        </div>

        {/* AVAILABLE SLOTS */}
        <div className="p-6 border-t">
        <h2 className="text-xl font-semibold mb-4">Available Slots</h2>

        {validSlots.length === 0 ? (
            <p className="text-gray-500">No slots available</p>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {validSlots.map((slot, i) => {
                const selected = isSlotSelected(slot);

                return (
                <button
                    key={i}
                    onClick={() => {
                      // toggleSlot(slot);
                      handleSlotSelect(slot);
                    }}
                    className={`px-4 py-3 rounded-lg border text-sm font-medium transition
                    ${
                        selected
                        ? "bg-indigo-600 text-white"
                        : "bg-white hover:bg-indigo-100"
                    }`}
                >
                    {formatTime12(slot.startTime)} – {formatTime12(slot.endTime)}
                </button>
                );
            })}
            </div>
        )}
        </div>

        {/* BOOKING SUMMARY */}
        {selectedSlots.length > 0 && (
        <div className="p-6 border-t bg-gray-50">
            <h3 className="font-semibold mb-2">Selected Slots</h3>

            <ul className="text-sm text-gray-700 mb-3">
            {selectedSlots.map((slot, i) => (
                <li key={i}>
                ⏱ {formatTime12(slot.startTime)} – {formatTime12(slot.endTime)}

                </li>
            ))}
            </ul>

            <p className="font-semibold text-lg">
            Total Price:{" "}
            <span className="text-green-600">₹{totalPrice}</span>
            </p>
        </div>
        )}


        {/* CONFIRM */}
        {selectedSlots.length > 0 && (
        <div className="p-6 border-t flex justify-end">
            {/* <button
            onClick={() => {
                const payload = {
                groundId: ground.id,
                date: selectedDate,
                slots: selectedSlots,
                totalAmount: totalPrice,
                };

                console.log("BOOKING PAYLOAD 👉", payload);
                alert("Booking payload ready (API pending)");
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
            Confirm Booking ({selectedSlots.length} slots)
            </button> */}
            <button
                //onClick={handleConfirmBooking}
                onClick={() => {
                  if (!userToken) {
                    navigate("/user/login", {
                      state: { from: location.pathname },
                    });
                  } else {
                    handleConfirmBooking();
                  }

                }}
                disabled={!token || selectedSlots.length === 0}
                className={`px-6 py-3 rounded-lg font-semibold
                  ${token
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }
                `}
                >
                {/* Confirm Booking ({selectedSlots.length}) */}
                {token ? "Confirm Booking" : "Login to Book"}
            </button>

        </div>
        )}
      </div>
    </div>
  );
}
