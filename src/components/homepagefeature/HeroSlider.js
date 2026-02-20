import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const slides = [
  {
    image: "/images/hero1.jpg",
    title: "Book Your Game.",
    highlight: "Build Your Team.",
    subtitle:
      "Book sports grounds instantly and manage games with ease on BoxArena.",
  },
  {
    image: "/images/hero2.jpg",
    title: "Play More.",
    highlight: "Stress Less.",
    subtitle:
      "Find verified grounds and flexible slots near you in seconds.",
  },
  {
    image: "/images/hero3.jpg",
    title: "Multiple Games.",
    highlight: "Multiple Grounds.",
    subtitle:
      "Your Ground , Your Game ",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const { isDarkMode } = useTheme();

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative h-[90vh] overflow-hidden">
      {/* SLIDES - Smooth crossfade with subtle Ken Burns effect */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            i === index ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105"
          }`}
        >
          <img
            src={slide.image}
            alt="Hero"
            className={`w-full h-full object-cover transition-transform duration-[7000ms] ease-out ${
              i === index ? "scale-105" : "scale-110"
            }`}
          />

          {/* Elegant gradient overlay */}
          {/* <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-b from-black/75 via-black/45 to-black/80' : 'bg-gradient-to-b from-white/60 via-white/30 to-white/40'}`} />
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-r from-indigo-900/10 via-transparent to-purple-900/10' : 'bg-gradient-to-r from-indigo-50/10 via-transparent to-purple-50/10'}`} /> */}
        </div>
      ))}

      {/* CONTENT */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
        <h1 key={`title-${index}`} 
            className="text-white text-4xl md:text-6xl lg:text-7xl font-extrabold drop-shadow-2xl animate-slide-up-reveal-smooth tracking-tight">
          {slides[index].title}{" "}
          <span className={`${isDarkMode ? 'bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent' : 'bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent'}`}>
            {slides[index].highlight}
          </span>
        </h1>

        <p key={`sub-${index}`} className={`mt-6 max-w-2xl text-lg md:text-xl ${isDarkMode ? 'text-gray-200/95' : 'text-gray-700'} animate-slide-up-reveal-smooth`} style={{ animationDelay: "0.12s", animationFillMode: "both" }}>
          {slides[index].subtitle}
        </p>

        {/* <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate("/user/login")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Login as Player
          </button>

          <button
            onClick={() => navigate("/admin/login")}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold border border-white/30 transition"
          >
            Login as Admin
          </button>
        </div> */}

        {/* STATS */}
        <div className="mt-16 grid grid-cols-3 gap-12 md:gap-16 text-white">
          {[
            { value: "100+", label: "Games Booked" },
            { value: "50+", label: "Active Grounds" },
            { value: "24/7", label: "Instant Booking" },
          ].map((stat, i) => (
            <div key={i} className="animate-float" style={{ animationDelay: `${i * 0.15}s` }}>
              <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-b from-indigo-300 to-indigo-500 bg-clip-text text-transparent drop-shadow-lg">{stat.value}</h3>
              <p className="text-sm text-gray-300/90 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ARROWS - Elegant hover */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] backdrop-blur-md border border-white/20 hover:scale-110"
      >
        <ChevronLeft size={28} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] backdrop-blur-md border border-white/20 hover:scale-110"
      >
        <ChevronRight size={28} />
      </button>
    </section>
  );
}
