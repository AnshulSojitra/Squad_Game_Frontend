import { useNavigate } from "react-router-dom";
import ScrollReveal from "../common/ScrollReveal";
import { useTheme } from "../../context/ThemeContext";

const cities = [
  {
    name: "Ahmedabad",
    // grounds: 125,
    image: "/assets/cities/ahmedabad.jpg",
  },
  {
    name: "Surat",
   // grounds: 89,
    image: "/assets/cities/surat.jpg",
  },
  {
    name: "Vadodara",
   // grounds: 67,
    image: "/assets/cities/vadodara.jpg",
  },
  {
    name: "Rajkot",
   // grounds: 45,
    image: "/assets/cities/rajkot.jpg",
  },
  {
    name: "Gandhinagar",
   // grounds: 38,
    image: "/assets/cities/gandhinagar.jpg",
  },
  {
    name: "Bharuch",
   // grounds: 22,
    image: "/assets/cities/bharuch.jpg",
  },
];

export default function ExploreByCity() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleCityClick = (city) => {
    navigate(`/Grounds?city=${encodeURIComponent(city)}`);
  };

  return (
    <section className={`py-28 transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-b from-black via-gray-950 to-gray-900' : 'bg-gradient-to-b from-blue-50/50 via-white to-slate-50'}`}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${isDarkMode ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-100/60 text-indigo-700 border border-indigo-300'} text-sm font-medium mb-4`}>
            📍 Explore by Location
          </span>

          <h2 className={`text-3xl md:text-4xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700'}`}>
            Find Grounds in Your City
          </h2>

          <p className={`mt-3 text-lg max-w-xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Browse sports grounds across major cities. We’re expanding fast!
          </p>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {cities.map((city, i) => (
            <ScrollReveal key={city.name} animation="fade-up" delay={i * 60}>
            <button
              onClick={() => handleCityClick(city.name)}
              className={`relative rounded-2xl overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-3 hover:scale-[1.03] ${isDarkMode ? 'border border-white/5' : 'border border-gray-200 bg-gradient-to-br from-white to-blue-50/30 hover:border-indigo-300'}`}
            >
              <img
                src={city.image}
                alt={city.name}
                className="h-40 w-full object-cover group-hover:scale-110 transition-transform duration-[800ms] ease-out"
              />
              <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-t from-black/80 via-black/30 to-transparent' : 'bg-gradient-to-t from-white/50 via-white/15 to-transparent group-hover:from-indigo-600/30'} group-hover:from-black/70 transition-colors duration-500`} />

              <div className="absolute bottom-4 left-4 text-left">
                <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-100 drop-shadow-md'} font-semibold text-lg drop-shadow-lg group-hover:translate-y-0 transition-transform duration-300`}>
                  {city.name}
                </h3>
                {/* <p className="text-gray-300 text-sm mt-0.5">
                  {city.grounds} Grounds
                </p> */}
              </div>
            </button>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
