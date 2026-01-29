import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPublicGround } from "../../services/api";
import GroundDetails from "./GroundDetails";
import Pagination from "../../components/common/Pagination";
import Footer from "../../components/common/Footer";

const IMAGE_BASE = process.env.REACT_APP_IMAGE_URL;

export default function Bookingslot() {
  const [grounds, setGrounds] = useState([]);
  const [selectedGroundId, setSelectedGroundId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [game, setGame] = useState("");
  const navigate = useNavigate("");


  const ITEMS_PER_PAGE = 15;
  const [page, setPage] = useState(1);



  // for filter
  const cities = [...new Set(grounds.map(g => g.city).filter(Boolean))];
  const states = [...new Set(grounds.map(g => g.state).filter(Boolean))];
  const countries = [...new Set(grounds.map(g => g.country).filter(Boolean))];
  const games = [...new Set(grounds.map(g => g.game).filter(Boolean))];


  useEffect(() => {
    const fetchGrounds = async () => {
      try {
        const res = await getPublicGround();
        setGrounds(res.data);
      } catch (err) {
        console.error("Failed to load grounds");
      } finally {
        setLoading(false);
      }
    };

    fetchGrounds();
  }, []);

// filtered grounds
    const filteredGrounds = grounds.filter((g) => {
      const text = `${g.name} ${g.city} ${g.state} ${g.country}`.toLowerCase();

    return (
      text.includes(search.toLowerCase()) &&
      (!city || g.city === city) &&
      (!state || g.state === state) &&
      (!country || g.country === country) &&
      (!game || g.game === game)
     );
   });

// paginated grounds 
const totalPages = Math.ceil(filteredGrounds.length / ITEMS_PER_PAGE);

const paginatedGrounds = filteredGrounds.slice(
  (page - 1) * ITEMS_PER_PAGE,
  page * ITEMS_PER_PAGE
);



  if (loading) {
    return <p className="text-center mt-10">Loading grounds...</p>;
  }

  /* ================= SHOW DETAILS ================= */
  if (selectedGroundId) {
    return (
      <GroundDetails
        groundId={selectedGroundId}
      />
    );
  }

  /* ================= GROUNDS LIST ================= */
  return (
    <div className="min-h-screen bg-gray-900 px-6 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-white">
        Select a Ground
      </h1>

      
      {/* SEARCH & FILTER BAR */}
        <div className="max-w-7xl mx-auto px-6 mt-10 mb-10">
          <div
            className="flex flex-col lg:flex-row gap-4 items-center
                      bg-white/5 backdrop-blur-md border border-white/10
                      rounded-2xl p-5 shadow-lg"
          >

            {/* SEARCH */}
            <div className="relative w-full lg:flex-1">
              <input
                type="text"
                placeholder="Search ground, city, state or country"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl
                          bg-gray-900/70 text-white placeholder-gray-400
                          border border-gray-700
                          focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>

            {/* FILTERS */}
            <div className="flex flex-wrap gap-3 w-full lg:w-auto">

              <select value={city} onChange={(e) => setCity(e.target.value)} className="filter-select">
                <option value="">City</option>
                {cities.map(c => <option key={c}>{c}</option>)}
              </select>

              <select value={state} onChange={(e) => setState(e.target.value)} className="filter-select">
                <option value="">State</option>
                {states.map(s => <option key={s}>{s}</option>)}
              </select>

              <select value={country} onChange={(e) => setCountry(e.target.value)} className="filter-select">
                <option value="">Country</option>
                {countries.map(c => <option key={c}>{c}</option>)}
              </select>

              <select value={game} onChange={(e) => setGame(e.target.value)} className="filter-select">
                <option value="">Game</option>
                {games.map(g => <option key={g}>{g}</option>)}
              </select>

            </div>
          </div>
        </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedGrounds.map((ground) => (
          <div
            key={ground.id}
            // onClick={() => setSelectedGroundId(ground.id)}
            onClick={() => navigate(`/user/grounds/${ground.id}`)}
            className="bg-white rounded-xl shadow-md hover:shadow-lg cursor-pointer overflow-hidden"
          >
            {/* IMAGE */}
            <div className="h-40 bg-gray-200">
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
            <div className="p-4 space-y-2">
              <h3 className="text-lg font-semibold">{ground.name}</h3>

              <p className="text-sm text-gray-500">
                {[ground.area, ground.city, ground.state, ground.country]
                  .filter(Boolean)
                  .join(", ")}
              </p>
                
              <p className="text-sm">
                ⏰ {ground.openingTime} – {ground.closingTime}
              </p>
              <div className="flex gap-2 text-sm mb-2">
                <span className="px-2 py-1 bg-blue-200 font-small rounded-2xl">
                  {ground.game}
                </span>
                <span className="px-2 py-1 bg-green-200 font-small rounded-2xl">
                  ₹{ground.pricePerSlot}/Slot
                </span>
              </div>
              <p className="text-md font-semibold"> Amenities</p>
              {ground.amenities?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {ground.amenities.slice(0, 5).map((amenity, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-700 text-gray-200 rounded-full"
                    >
                      {typeof amenity === "string" ? amenity : amenity.name}
                    </span>
                  ))}

                  {ground.amenities.length > 5 && (
                    <span className="px-2 py-1 text-xs bg-gray-600 text-gray-300 rounded-full mb-2">
                      +{ground.amenities.length - 5} more
                    </span>
                  )}
                </div>
              )}
              {/* <p className="text-green-600 font-semibold">
                ₹{ground.pricePerSlot} / slot
              </p> */}
            </div>
          </div>  
        ))}
      </div>
                  <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
            <hr className="my-10 border-t border-gray-700" />
      <Footer/>
    </div>
  );
}
