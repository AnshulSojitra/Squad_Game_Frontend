import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MapPin, Star } from "lucide-react";
import { getGroundReviews } from "../../services/api";
import { useTheme } from "../../context/ThemeContext";

export default function VenueCard({ ground }) {
  const navigate = useNavigate();
  const [avgRating, setAvgRating] = useState(null);
  const { isDarkMode } = useTheme();

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
      className={`group ${
        isDarkMode
          ? 'rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-indigo-500/25 transform hover:-translate-y-3 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer border border-white/5 bg-gradient-to-b from-gray-800/70 to-gray-900/95 hover:border-indigo-500/30'
          : 'rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer border border-gray-100 bg-white hover:border-indigo-300/50 divide-gray-100'
      }`}
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

      <div className={`p-4 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900 border-t border-gray-100'}`}>
        <h3 className={`${isDarkMode ? 'text-white' : 'text-slate-900'} font-bold text-lg truncate`}>{ground.name}</h3>

        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mt-1 flex items-center gap-2`}>
          <MapPin size={14} />
          <span className="truncate">{[ground.area, ground.city, ground.state].filter(Boolean).join(", ")}</span>
        </p>

        {/* <div className="bg-white/10 backdrop-blur rounded-full px-4 py-2 text-xs text-indigo-500 font-semibold">
          {ground.game}  ₹{ground.pricePerSlot}/slot
        </div> */}

          <div className="flex flex-wrap gap-2 text-sm mt-3">
                  <span className={`px-3 py-1 font-bold rounded-full border transition-colors duration-200 ${isDarkMode ? 'bg-indigo-500/20 text-indigo-500 border-indigo-500/30' : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'}`}>
                    🎮 {ground.game}
                  </span>

                  <span className={`px-3 py-1 font-bold rounded-full border transition-colors duration-200 ${isDarkMode ? 'bg-green-500/20 text-green-500 border-green-500/30' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'}`}>
                    💰 ₹{ground.pricePerSlot}/Slot
                  </span>
                </div>

            <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {ground.amenities?.slice(0, 3).map((a, idx) => (
              <span key={idx} className={`${isDarkMode ? 'px-2 py-0.5 bg-gray-800 text-gray-200 rounded-full text-xs' : 'px-2 py-0.5 bg-gray-200 text-gray-800 rounded-full text-xs'}`}>
                {typeof a === "string" ? a : a.name}
              </span>
            ))}
          </div>

          <div>
            <button className={`${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-md hover:shadow-lg'} px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-200`}>
              Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
