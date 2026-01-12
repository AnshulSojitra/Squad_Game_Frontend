import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const slides = [
  {
    title: "Book Premium Sports Grounds",
    subtitle: "Cricket, Football, Badminton & more",
    image:
      "https://plus.unsplash.com/premium_photo-1663951813007-b99d97a8aaaf?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cta: "Explore Grounds",
    link: "/Grounds",
  },
  {
    title: "Play With Your Squad",
    subtitle: "Pick slots that fit your schedule",
    image:
      "https://plus.unsplash.com/premium_photo-1667598736309-1ea3b0fb1afa?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cta: "Book a Slot",
    link: "/user/bookingslot",
  },
  {
    title: "Smart Booking Management",
    subtitle: "Admins manage grounds & bookings easily",
    image:
      "https://plus.unsplash.com/premium_photo-1736900468189-3b4420fc5d28?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cta: "User Login",
    link: "/user/login",
  },
];

export default function SportsSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Slider */}
        <div className="relative h-[420px] md:h-[520px] rounded-3xl overflow-hidden shadow-2xl">

          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === current ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60" />

              {/* Content */}
              <div className="relative z-10 h-full flex items-center">
                <div className="p-10 md:p-16 text-white max-w-xl">
                  <h2 className="text-3xl md:text-4xl font-extrabold">
                    {slide.title}
                  </h2>
                  <p className="mt-4 text-gray-300 text-lg">
                    {slide.subtitle}
                  </p>

                  <Link
                    to={slide.link}
                    className="inline-block mt-6 bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-semibold transition"
                  >
                    {slide.cta}
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-3 h-3 rounded-full ${
                  current === i
                    ? "bg-indigo-500"
                    : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
