import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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
      {/* SLIDES */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={slide.image}
            alt="Hero"
            className="w-full h-full object-cover"
          />

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-black/60" />
        </div>
      ))}

      {/* CONTENT */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white">
          {slides[index].title}{" "}
          <span className="text-indigo-400">{slides[index].highlight}</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-200">
          {slides[index].subtitle}
        </p>

        <div className="mt-8 flex gap-4">
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
        </div>

        {/* STATS */}
        <div className="mt-14 grid grid-cols-3 gap-12 text-white">
          <div>
            <h3 className="text-3xl font-bold text-indigo-400">100+</h3>
            <p className="text-sm text-gray-300">Games Booked</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-indigo-400">50+</h3>
            <p className="text-sm text-gray-300">Active Grounds</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-indigo-400">24/7</h3>
            <p className="text-sm text-gray-300">Instant Booking</p>
          </div>
        </div>
      </div>

      {/* ARROWS */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full"
      >
        <ChevronLeft size={28} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full"
      >
        <ChevronRight size={28} />
      </button>
    </section>
  );
}
