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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  if (!ground) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏟️</div>
        <p className="text-gray-400 text-lg">Ground not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{ground.name}</h1>
          <p className="text-gray-400">Ground details and reviews</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          <span className="flex items-center gap-2">
            ← Back
          </span>
        </button>
      </div>

      {/* Images */}
      {ground.images?.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {ground.images.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={`${IMAGE_BASE}${img.imageUrl}`}
                  alt="ground"
                  className="h-48 w-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Ground Information</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-xl">
              <span className="text-2xl">🎮</span>
              <div>
                <p className="text-sm text-gray-400">Game Type</p>
                <p className="text-white font-semibold">{ground.game}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-xl">
              <span className="text-2xl">💰</span>
              <div>
                <p className="text-sm text-gray-400">Price per Slot</p>
                <p className="text-white font-semibold">₹{ground.pricePerSlot}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-xl">
              <span className="text-2xl">⏰</span>
              <div>
                <p className="text-sm text-gray-400">Operating Hours</p>
                <p className="text-white font-semibold">{ground.openingTime} – {ground.closingTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-xl">
              <span className="text-2xl">📞</span>
              <div>
                <p className="text-sm text-gray-400">Contact</p>
                <p className="text-white font-semibold">{ground.contactNo}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-700/50 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">📍</span>
                <p className="text-sm text-gray-400">Location</p>
              </div>
              <p className="text-white font-semibold">
                {[ground.area, ground.city, ground.state, ground.country]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>

            <div className="p-4 bg-gray-700/50 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🏢</span>
                <p className="text-sm text-gray-400">Amenities</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {ground.amenities?.map((a, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm border border-indigo-500/30"
                  >
                    {typeof a === "string" ? a : a.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Customer Reviews</h2>
        <ReviewList groundId={ground.id} />
      </div>
    </div>
  );
}
