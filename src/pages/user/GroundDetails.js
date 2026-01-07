import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPublicGroundById } from "../../services/api";

const IMAGE_BASE = process.env.REACT_APP_IMAGE_URL;

export default function GroundDetails({ groundId, onBack }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedDate = searchParams.get("date");

  const [ground, setGround] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">

        {/* BACK */}
        <div className="p-4 border-b">
          <button onClick={onBack} className="text-indigo-600 font-medium">
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

        {/* SLOTS */}
        <div className="p-6 border-t">
          <h2 className="text-xl font-semibold mb-4">Available Slots</h2>

          {validSlots.length === 0 ? (
            <p className="text-gray-500">No slots available</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {validSlots.map((slot, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-4 py-3 rounded-lg border ${
                    selectedSlot === slot
                      ? "bg-indigo-600 text-white"
                      : "bg-white hover:bg-indigo-100"
                  }`}
                >
                  {slot.startTime} – {slot.endTime}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CONFIRM */}
        {selectedSlot && (
          <div className="p-6 border-t flex justify-end">
            <button
              onClick={() =>
                console.log("BOOK SLOT", {
                  groundId: ground.id,
                  date: selectedDate,
                  slot: selectedSlot,
                })
              }
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg"
            >
              Confirm Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
