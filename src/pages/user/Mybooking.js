import { useEffect, useState } from "react";
import { getUserBookings } from "../../services/api";

export default function Mybooking() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const res = await getUserBookings();
      setBookings(res.data);
    };

    fetchBookings();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-white p-4 rounded shadow"
            >
              <p className="font-semibold">{b.ground.name}</p>
              <p>Date: {b.date}</p>
              <p>
                Time: {b.startTime} ({b.hours} hrs)
              </p>
              <p>Total: ₹{b.totalPrice}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
