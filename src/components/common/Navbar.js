import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold">
            SquadGame
          </Link>

          {/* Links */}
          <div className="hidden md:flex space-x-6">
            <Link to="/AdminLogin" className="nav-link">
              Home
            </Link>
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>

            <Link to="/contact" className="nav-link">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
