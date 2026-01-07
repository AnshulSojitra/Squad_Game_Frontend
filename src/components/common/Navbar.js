import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 border-b border-gray-800">
  <div className="max-w-7xl mx-auto px-6">
    <div className="flex justify-between items-center h-16">

      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-extrabold tracking-wide text-indigo-500 hover:text-indigo-400 transition"
      >
      BoxArena
      </Link>

      {/* Links */}
      <div className="hidden md:flex items-center space-x-8">
        <Link
          to="/"
          className="text-gray-300 hover:text-white text-sm font-medium transition"
        >
          Home
        </Link>

        <Link
          to="/user/bookingslot"
          className="text-gray-300 hover:text-white text-sm font-medium transition"
        >
          Grounds
        </Link>

        <Link
          to="/user/Mybooking"
          className="text-gray-300 hover:text-white text-sm font-medium transition"
        >
          Mybooking
        </Link>

        {/* CTA Button */}
        <Link
          to="/user/login"
          className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
        >
          Login
        </Link>
        <Link
        to="/user/UserRegister"
        className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
          Sign Up
        </Link>
      </div>
    </div>
  </div>
</nav>

  );
}
