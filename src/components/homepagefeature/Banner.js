import { Link } from "react-router-dom";

export default function Banner() {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-950 overflow-hidden">
      
      {/* Decorative Glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600 opacity-20 blur-3xl rounded-full" />
      <div className="absolute top-1/3 -right-24 w-96 h-96 bg-purple-600 opacity-20 blur-3xl rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6 py-28 text-center">

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
          Book Your Game.
          <br />
          <span className="text-indigo-400">Build Your Squad.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
          BoxArena lets players book sports grounds in seconds while giving
          admins full control over games, grounds, and bookings — all in one
          powerful platform.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/user/login"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition shadow-lg"
          >
            Login as Player
          </Link>

          <Link
            to="/admin/login"
            className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition border border-gray-700"
          >
            Login as Admin
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-white">
          <div>
            <p className="text-3xl font-bold text-indigo-400">100+</p>
            <p className="text-gray-400 mt-1">Games Booked</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-indigo-400">50+</p>
            <p className="text-gray-400 mt-1">Active Grounds</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-indigo-400">24/7</p>
            <p className="text-gray-400 mt-1">Instant Booking</p>
          </div>
        </div>

      </div>
    </section>
  );
}
