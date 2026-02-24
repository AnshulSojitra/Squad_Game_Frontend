import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Lenis from "lenis";
import Footer from "../components/common/Footer";
import { getPublicGround } from "../services/api";
import LandingFeatures from "../components/homepagefeature/LandingFeatures";
import HeroSlider from "../components/homepagefeature/HeroSlider";
import ExplorebyCity from "../components/homepagefeature/ExplorebyCities";
import ScrollToTopButton from "../components/common/ScrollToTopButton";
import StickySearch from "../components/common/StickySearch";
import VenueCardSlider from "../components/common/VenueCardSlider";
import ScrollReveal from "../components/common/ScrollReveal";
import { useTheme } from "../context/ThemeContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const lenisRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [game, setGame] = useState("");


  // for filter
  const cities = [...new Set(grounds.map(g => g.city).filter(Boolean))];
  const games = [...new Set(grounds.map(g => g.game).filter(Boolean))];
  const states = [...new Set(grounds.map(g => g.state).filter(Boolean))];
  const { isDarkMode } = useTheme();

  const userToken = localStorage.getItem("userToken");


  /* ---------------- LENIS ULTRA-SMOOTH SCROLL ---------------- */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ({ scroll }) => {
      setShowScrollTop(scroll > 300);
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollToTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: false });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /* ---------------- FETCH GROUNDS ---------------- */
  useEffect(() => {
    const fetchGrounds = async () => {
      try {
        const res = await getPublicGround();
        setGrounds(res.data || []);
      } catch (err) {
        console.error("Failed to fetch grounds", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrounds();
  }, []);

  // /* ---------------- FILTER BY DATE ---------------- */
  // const filteredGrounds = grounds.filter((ground) => {
  //   if (!selectedDate) return true;

  //   return ground.slots?.some(
  //     (slot) => slot.date === selectedDate && slot.isAvailable !== false
  //   );
  // });


  const filteredGrounds = grounds.filter((g) => {
    const text = `${g.name} ${g.city} ${g.state} ${g.country}`.toLowerCase();

    return (
      text.includes(search.toLowerCase()) &&
      (!city || g.city === city) &&
      (!game || String(g.game || "").toLowerCase() === String(game || "").toLowerCase()) &&
      (!state || g.state === state) 
    );
  });

  const clearFilters = () => {
    setSearch("");
    setCity("");
    setGame("");
  };

  return (
    <div className={`min-h-screen flex flex-col overflow-hidden transition-colors duration-300
    ${
      isDarkMode
        ? 'bg-gray-900 text-gray-100'
        : 'bg-gradient-to-b from-slate-50 via-blue-50/30 to-white text-gray-900'
    }`}>
      {/* Animated gradient orbs - ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-3xl" />
      </div>

      {/* Add padding for fixed navbar */}
      <div className="pt-16"></div>

      {/* HERO */}
      <div className="relative">
        <HeroSlider />
      </div>

      <main className="flex-1">
        {/* GROUNDS SECTION */}
        <ScrollReveal animation="fade-up" delay={0}>
          <section className="px-4 sm:px-6 lg:px-8 py-20 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className={`text-3xl sm:text-4xl font-bold  mb-2 ${
                  isDarkMode
                    ? 'text-white'
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700'
                }`}>
                  Find a Ground
                </h2>
                <p className={isDarkMode ? 'text-gray-500 text-lg' : 'text-gray-600 text-lg'}>Quickly find grounds near you and book instantly.</p>
              </div>
          </div>

          {/* Search sticker placed under the heading for clarity */}
          <div className="mt-6 mb-8">
            <StickySearch
              search={search}
              setSearch={setSearch}
              state={state}
              setState={setState}
              city={city}
              setCity={setCity}
              game={game}
              setGame={setGame}
              cities={cities}
              games={games}
              states={states}
              onClear={clearFilters}
              overlay={false}
            />
          </div>

          {/* Category chips */}
          <div className="flex gap-3 overflow-x-auto pb-3 hide-scrollbar mb-8 mt-6">
    <button
      onClick={() => { setGame(""); }}
      className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 whitespace-nowrap ${
        game === "" ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg" : isDarkMode ? "bg-gray-800 text-gray-300 hover:bg-gray-600" : "bg-white text-gray-700 border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-300"
      }`}
    >
      All Games
    </button>
                    {games.map((g, index) => {
                      const gKey = String(g).toLowerCase();
                      const selectedGame = game ? String(game).toLowerCase() : "";
                      return (
                        <button
                          key={g}
                          onClick={() => setGame(gKey)}
                          className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 whitespace-nowrap ${
                            selectedGame === gKey ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg" : isDarkMode ? "bg-gray-800 text-gray-300 hover:bg-gray-600" : "bg-white text-gray-700 border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-300"
                          }`}
                        >
                          {g}
                        </button>
                      );
                    })}
          </div>

          {/* Listings - Horizontal Slider */}
          {filteredGrounds.length === 0 && !loading ? (
            <div className={`text-center py-16 animate-fade-in rounded-2xl transition-colors duration-300 ${
              isDarkMode 
                ? 'text-gray-400'
                : 'text-gray-600 bg-gradient-to-br from-blue-50 to-indigo-50'
            }`}>
              <div className="text-6xl mb-4">🏟️</div>
              <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>No grounds found</h3>
              <p className="mb-4">Try clearing your filters or search for something else.</p>
              <button
                onClick={clearFilters}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-6 py-2 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <VenueCardSlider
              grounds={filteredGrounds}
              loading={loading}
            />
          )}

          <div className="text-center mt-12">
            <Link
              to="/grounds"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold transition-all duration-500 ease-smooth transform hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/30 group"
            >
              View More Grounds
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </Link>
          </div>
        </section>
        </ScrollReveal>

        {/* FEATURES SECTION */}
        <ScrollReveal animation="fade-up" delay={100}>
          <LandingFeatures />
        </ScrollReveal>

        {/* EXPLORE BY CITY SECTION */}
        <ScrollReveal animation="fade-up" delay={100}>
          <ExplorebyCity />
        </ScrollReveal>

        {/* CTA SECTION */}
        {!userToken && (
        <section className="px-6 py-20 mx-6 mt-16">
          <ScrollReveal animation="scale" delay={0}>
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 text-center rounded-3xl p-12 shadow-2xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-blue-500/20 backdrop-blur-sm"></div>
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="w-full h-full bg-gradient-to-br from-white/5 to-transparent"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white animate-float-slow">
                Wanna Add a Venue?
              </h2>
              <p className="text-xl mb-8 text-indigo-100 max-w-2xl mx-auto">
                Add a venue and make become a ground owner effortlessly. Discover amazing venues and earn the worth of your Ground.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-500 ease-smooth transform hover:scale-105 hover:shadow-xl shadow-lg group animate-float"
              >
                Add Ground Today
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300 inline-block">🚀</span>
              </button>
            </div>
          </div>
          </ScrollReveal>
        </section>
        )}
      </main>

      <ScrollReveal animation="fade-up" delay={0}>
        <Footer />
      </ScrollReveal>
      <ScrollToTopButton onScrollToTop={scrollToTop} visible={showScrollTop} />
    </div>
  );
}
