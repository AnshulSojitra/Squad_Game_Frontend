import { useNavigate } from "react-router-dom";

const cities = [
  {
    name: "Ahmedabad",
    grounds: 125,
    image: "/assets/cities/ahmedabad.jpg",
  },
  {
    name: "Surat",
    grounds: 89,
    image: "/assets/cities/surat.jpg",
  },
  {
    name: "Vadodara",
    grounds: 67,
    image: "/assets/cities/vadodara.jpg",
  },
  {
    name: "Rajkot",
    grounds: 45,
    image: "/assets/cities/rajkot.jpg",
  },
  {
    name: "Gandhinagar",
    grounds: 38,
    image: "/assets/cities/gandhinagar.jpg",
  },
  {
    name: "Bharuch",
    grounds: 22,
    image: "/assets/cities/bharuch.jpg",
  },
];

export default function ExploreByCity() {
  const navigate = useNavigate();

  const handleCityClick = (city) => {
    navigate(`/Grounds?city=${encodeURIComponent(city)}`);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gray-100 text-sm font-medium text-gray-700 mb-4">
            📍 Explore by Location
          </span>

          <h2 className="text-3xl font-bold text-gray-900">
            Find Grounds in Your City
          </h2>

          <p className="text-gray-500 mt-2">
            Browse sports grounds across major cities. We’re expanding fast!
          </p>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {cities.map((city) => (
            <button
              key={city.name}
              onClick={() => handleCityClick(city.name)}
              className="relative rounded-xl overflow-hidden group shadow-md hover:shadow-xl transition"
            >
              <img
                src={city.image}
                alt={city.name}
                className="h-36 w-full object-cover group-hover:scale-110 transition duration-500"
              />

              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

              <div className="absolute bottom-3 left-3 text-left">
                <h3 className="text-white font-semibold">
                  {city.name}
                </h3>
                <p className="text-gray-200 text-sm">
                  {city.grounds} Grounds
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
