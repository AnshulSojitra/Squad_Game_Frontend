import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MapPin, Star } from "lucide-react";
import { getGroundReviews } from "../../services/api";

export default function VenueCard({ ground }) {
  const navigate = useNavigate();
  const [avgRating, setAvgRating] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchRating = async () => {
      if (!ground?.id) return;
      try {
        const res = await getGroundReviews(ground.id);
        if (mounted) setAvgRating(res.data?.avgRating ?? null);
      } catch (err) {
        console.error("Failed to fetch avg rating for ground", ground?.id, err);
      }
    };

    fetchRating();
    return () => {
      mounted = false;
    };
  }, [ground?.id]);

  const image = ground.images?.[0]
    ? `${process.env.REACT_APP_IMAGE_URL}${ground.images[0].imageUrl}`
    : "/placeholder.png";

  return (
    <div
      onClick={() => navigate(`/user/grounds/${ground.id}`)}
      className="group bg-gradient-to-b from-gray-800/70 to-gray-900/95 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-indigo-500/25 transform hover:-translate-y-3 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer border border-white/5 hover:border-indigo-500/30"
    >
      <div className="relative h-44 sm:h-52 md:h-40 lg:h-48 w-full overflow-hidden">
        <img src={image} alt={ground.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[800ms] ease-out" />

        {/* <div className="absolute top-3 left-3 bg-white/10 backdrop-blur rounded-full px-3 py-1 text-xs text-indigo-500 font-semibold">
          {ground.game}
        </div>

        <div className="absolute top-3 right-3 bg-white/10 backdrop-blur rounded-full px-3 py-1 text-xs text-indigo-500 font-semibold">
          ₹{ground.pricePerSlot}/slot
        </div> */}

        <div className="absolute bottom-3 left-3 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full px-3 py-1 text-xs text-white flex items-center gap-2">
          <Star size={14} /> <span className="font-semibold">{typeof avgRating === 'number' ? avgRating.toFixed(1) : (ground?.avgRating ? Number(ground.avgRating).toFixed(1) : "—")}</span>
        </div>
      </div>

      <div className="p-4 bg-gray-900">
        <h3 className="text-white font-bold text-lg truncate">{ground.name}</h3>

        <p className="text-sm text-gray-300 mt-1 flex items-center gap-2">
          <MapPin size={14} />
          <span className="truncate">{[ground.area, ground.city, ground.state].filter(Boolean).join(", ")}</span>
        </p>

        {/* <div className="bg-white/10 backdrop-blur rounded-full px-4 py-2 text-xs text-indigo-500 font-semibold">
          {ground.game}  ₹{ground.pricePerSlot}/slot
        </div> */}

          <div className="flex flex-wrap gap-2 text-sm mt-3">
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
                    🎮 {ground.game}
                  </span>

                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full border border-green-500/30">
                    💰 ₹{ground.pricePerSlot}/Slot
                  </span>
                </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {ground.amenities?.slice(0, 3).map((a, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-gray-800 text-gray-200 rounded-full text-xs">
                {typeof a === "string" ? a : a.name}
              </span>
            ))}
          </div>

          <div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg text-sm font-semibold">
              Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
