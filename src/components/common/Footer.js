import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* BRAND */}
        <div>
          <h2 className="text-xl font-bold text-white mb-2">
            BoxArena
          </h2>
          <p className="text-sm">
            Book sports grounds easily. Play more, worry less.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-white transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/user/bookingslot" className="hover:text-white transition">
                Grounds
              </Link>
            </li>
            <li>
              <Link to="/user/login" className="hover:text-white transition">
                Login
              </Link>
            </li>
            <li>
              <Link to="/user/UserRegister" className="hover:text-white transition">
                Sign Up
              </Link>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contact</h3>
          <p className="text-sm">📧 support@BoxArena.com</p>
          <p className="text-sm">📞 +91 90000 00000</p>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-gray-800 text-center py-4 text-sm">
        © {new Date().getFullYear()} BoxArena. All rights reserved.
      </div>
    </footer>
  );
}
