import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPublicGroundById } from "../../services/api";
import ReviewList from "../../components/common/ReviewList";

const IMAGE_BASE = process.env.REACT_APP_IMAGE_URL;

export default function GroundDetailsAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ground, setGround] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGround();
  }, [id]);

  const fetchGround = async () => {
    try {
      const res = await getPublicGroundById(id);
      setGround(res.data);
    } catch (error) {
      console.error("Failed to fetch ground", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading ground details...</p>;
  if (!ground) return <p>Ground not found</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 text-black">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">{ground.name}</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          ← Back
        </button>
      </div>

      {/* Images */}
      {ground.images?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {ground.images.map((img, index) => (
            <img
              key={index}
              src={`${IMAGE_BASE}${img.imageUrl}`}
              alt="ground"
              className="h-48 w-full object-cover rounded"
            />
          ))}
        </div>
      )}

      {/* Info */}
      <div className="grid md:grid-cols-2 gap-6 bg-white p-6 rounded shadow">
        <div className="space-y-2">
          <p><b>Game:</b> {ground.game}</p>
          <p><b>Price:</b> ₹{ground.pricePerSlot} / slot</p>
          <p><b>Timing:</b> {ground.openingTime} – {ground.closingTime}</p>
          <p><b>Contact:</b> {ground.contactNo}</p>
          <p>
            <b>Location:</b>{" "}
            {[ground.area, ground.city, ground.state, ground.country]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-2">Amenities</p>
          <div className="flex flex-wrap gap-2">
            {ground.amenities?.map((a, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-gray-700 text-gray-200 rounded-full text-xs"
              >
                {typeof a === "string" ? a : a.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-gray-850 p-6 rounded shadow text-white">
        <h2 className="text-lg font-semibold mb-4">Reviews</h2>
        <ReviewList groundId={ground.id} />
      </div>
    </div>
  );
}
