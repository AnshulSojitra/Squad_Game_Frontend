import { useEffect, useState, useRef } from "react";
import { useNavigate , Link } from "react-router-dom";
import Footer from "../components/common/Footer";
import { getPublicGround } from "../services/api";
import SportsSlider from "../components/common/SportsSlider";
import LandingFeatures from "../components/common/LandingFeatures";
import HeroSlider from "../components/common/HeroSlider";
import ExplorebyCity from "../components/common/ExplorebyCities";
import ScrollToTopButton from "../components/common/ScrollToTopButton";



const IMAGE_BASE = process.env.REACT_APP_IMAGE_URL;

export default function LandingPage() {
  const navigate = useNavigate();

  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [game, setGame] = useState("");


  // for filter
  const cities = [...new Set(grounds.map(g => g.city).filter(Boolean))];
  const states = [...new Set(grounds.map(g => g.state).filter(Boolean))];
  const countries = [...new Set(grounds.map(g => g.country).filter(Boolean))];
  const games = [...new Set(grounds.map(g => g.game).filter(Boolean))];




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

 
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -350,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 350,
      behavior: "smooth",
    });
  };

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



  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Banner */}
     <HeroSlider/>
      {/* <Banner/> */}

      {/* <SportsSlider/> */}

      {/* ---------------- HERO SECTION ---------------- */}

      <section className="py-16 px-6 bg-gradient-to-b from-[#0f172a] to-[#020617]">
      <h2 className="text-3xl font-bold text-center text-white mb-10">
          Available Grounds
      </h2>
      
        
        <div className="relative">
        {/* arrows here */}


      {/* SCROLL CONTAINER */}
       <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {grounds.slice(0,4).map((ground) => (
          <div
            key={ground.id}
            onClick={() => navigate(`/user/grounds/${ground.id}`)}
            className="min-w-[320px] max-w-[320px] bg-gray-800 rounded-xl 
                       shadow-md hover:scale-[1.04] transition-transform duration-300 overflow-hidden"
          >
            {/* IMAGE */}
            <div className="h-40 w-full bg-gray-700">
              <img
                src={
                  ground.images?.[0]
                    ? `${process.env.REACT_APP_IMAGE_URL}${ground.images[0].imageUrl}`
                    : "/placeholder.png"
                }
                alt={ground.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* CONTENT */}
            <div className="p-4 space-y-2 text-white">
              <h3 className="text-lg font-semibold">{ground.name}</h3>

              <p className="text-sm text-gray-400">
                {[ground.area, ground.city, ground.state, ground.country]
                  .filter(Boolean)
                  .join(", ")}
              </p>

              <div className="flex gap-2 text-sm">
                <span className="px-2 py-1 bg-indigo-600 rounded">
                  {ground.game}
                </span>
                <span className="px-2 py-1 bg-green-600 rounded">
                  ₹{ground.pricePerSlot}/Slot
                </span>
              </div>

              <p className="text-sm text-gray-400">
                ⏰ {ground.openingTime} – {ground.closingTime}
              </p>
            </div>
            {/* AMENITIES */}
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
          </div>
        ))}
        </div>
        <div className="text-center mt-10">
          <Link
            to="/grounds"
            className="inline-block px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            View All Grounds →
          </Link>
        </div>
      </div>
    </section>


    {/* LandingFeatures */}
    <LandingFeatures/>

    <ExplorebyCity/>

      {/* ---------------- CTA ---------------- */}
      <section className="px-6 py-16 bg-indigo-600 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Play?
        </h2>

        <p className="mb-6">
          Join Game Squad and make game booking effortless.
        </p>

        <button
          onClick={() => navigate("/user/UserRegister")}
          className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Get Started
        </button>
      </section>

      {/* Footer */}
      <Footer />
      <ScrollToTopButton/>
    </div>
  );
}
