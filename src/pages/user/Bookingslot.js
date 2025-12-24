import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGroundById, createBooking } from "../../services/api";

export default function Bookingslot() {
  const { groundId } = useParams();
  const navigate = useNavigate();

  const [ground, setGround] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    date: "",
    startTime: "",
    hours: 1,
  });

  useEffect(() => {
    const fetchGround = async () => {
      try {
        const res = await getGroundById(groundId);
        setGround(res.data);
      } catch {
        alert("Failed to load ground");
      } finally {
        setLoading(false);
      }
    };

    fetchGround();
  }, [groundId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const totalPrice =
    ground ? form.hours * ground.pricePerHour : 0;

  const handleBooking = async (e) => {
    e.preventDefault();

    try {
      await createBooking({
        groundId: ground._id,
        date: form.date,
        startTime: form.startTime,
        hours: Number(form.hours),
        totalPrice,
      });

      navigate("/user/mybooking");
    } catch {
      alert("Booking failed");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!ground) return <p>Ground not found</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex justify-center">
      <div className="w-full max-w-xl bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">
          Book {ground.name}
        </h2>

        {/* Ground Info */}
        <div className="mb-6 text-sm text-gray-300 space-y-1">
          <p>Game: {ground.game}</p>
          <p>
            Available: {ground.startTime} – {ground.endTime}
          </p>
          <p>Price / Hour: ₹{ground.pricePerHour}</p>
        </div>

        <form onSubmit={handleBooking} className="space-y-4">
          {/* Date */}
          <div>
            <label className="block text-sm mb-1">Date</label>
            <input
              type="date"
              name="date"
              required
              value={form.date}
              onChange={handleChange}
              className="w-full rounded-lg px-3 py-2 text-black"
            />
          </div>

          {/* Start Time */}
          <div>
            <label className="block text-sm mb-1">Start Time</label>
            <input
              type="time"
              name="startTime"
              required
              value={form.startTime}
              onChange={handleChange}
              className="w-full rounded-lg px-3 py-2 text-black"
            />
          </div>

          {/* Hours */}
          <div>
            <label className="block text-sm mb-1">Hours</label>
            <input
              type="number"
              name="hours"
              min="1"
              max="6"
              value={form.hours}
              onChange={handleChange}
              className="w-full rounded-lg px-3 py-2 text-black"
            />
          </div>

          {/* Total */}
          <div className="text-lg font-semibold text-indigo-400">
            Total Price: ₹{totalPrice}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
}
