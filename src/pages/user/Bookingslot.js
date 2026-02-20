import { useEffect, useState } from "react";
import { getPublicGround } from "../../services/api";
import { useTheme } from "../../context/ThemeContext";
import Pagination from "../../components/utils/Pagination";
import Footer from "../../components/common/Footer";
import StickySearch from "../../components/common/StickySearch";
import VenueCard from "../../components/common/VenueCard";

export default function Bookingslot() {
  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();
  
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [game, setGame] = useState("");

  const clearFilters = () => {
    setSearch("");
    setCity("");
    setState("");
    setCountry("");
    setGame("");
  };

  const ITEMS_PER_PAGE = 28;
  const [page, setPage] = useState(1);



  // for filter
  const cities = [...new Set(grounds.map(g => g.city).filter(Boolean))];
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

// reset to page 1 when filters change
useEffect(() => {
  setPage(1);
}, [search, city, state, country, game]);

// keep current page within range when totalPages changes
useEffect(() => {
  if (totalPages > 0 && page > totalPages) {
    setPage(totalPages);
  }
}, [totalPages, page]);




  /* ================= GROUNDS LIST ================= */
  return (
    <>
    <div className={`min-h-screen px-4 sm:px-6 lg:px-8 py-16 sm:py-20 transition-colors duration-300 ${
      isDarkMode
        ? 'bg-gray-900'
        : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Select a Ground
        </h1>

        <p className={`text-center mb-6 sm:mb-8 text-sm sm:text-base max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Find and book the perfect sports ground for your game. Choose from various locations and amenities.
        </p>

        {/* SEARCH & FILTER BAR */}
        <div className="mb-6 sm:mb-8">
          <StickySearch
            search={search}
            setSearch={setSearch}
            city={city}
            setCity={setCity}
            game={game}
            setGame={setGame}
            cities={cities}
            games={games}
            onClear={clearFilters}
            overlay={false}
          />
        </div>

        {/* RESULTS COUNT */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
          <div className="text-gray-400 text-sm">
            {loading ? (
              "Loading grounds..."
            ) : (
              <>
                Showing {paginatedGrounds.length} of {filteredGrounds.length} ground{paginatedGrounds.length !== 1 ? 's' : ''}
                {filteredGrounds.length > ITEMS_PER_PAGE && (
                  <span className="text-gray-500 ml-1">
                    (Page {page} of {totalPages})
                  </span>
                )}
              </>
            )}
          </div>

          {/* SORT/CLEAR BUTTONS - MOBILE FRIENDLY */}
          <div className="flex gap-2">
            {(search || city || game) && (
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 text-xs sm:text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-colors duration-200 flex items-center gap-1"
              >
                <span>🗑️</span>
                <span className="hidden sm:inline">Clear Filters</span>
                <span className="sm:hidden">Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* GROUNDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {loading ? (
            Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <div key={i} className="h-64 sm:h-72 lg:h-80 rounded-xl sm:rounded-2xl bg-gray-800 animate-pulse" />
            ))
          ) : paginatedGrounds.length === 0 ? (
            <div className="col-span-full text-center py-12 sm:py-16">
              <div className="text-4xl sm:text-5xl mb-4">🏟️</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">
                No grounds found
              </h3>
              <p className="text-gray-400 text-sm sm:text-base mb-4 max-w-md mx-auto">
                Try adjusting your search criteria or clearing the filters to see more results.
              </p>
              <button
                onClick={clearFilters}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-6 py-2.5 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            paginatedGrounds.map((ground, index) => (
              <div
                key={ground.id}
                className="animate-fade-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <VenueCard ground={ground} />
              </div>
            ))
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center mb-8">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}

        {/* BOTTOM SPACING FOR FOOTER */}
        <div className="h-8"></div>
      </div>
        </div>
      <Footer/>
    </>
  );
}
