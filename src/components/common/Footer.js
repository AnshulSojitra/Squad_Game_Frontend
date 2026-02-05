import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-950/98 backdrop-blur-xl text-gray-400 mt-auto border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3 tracking-tight">
            BoxArena
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Book sports grounds easily. Play more, worry less.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/" className="hover:text-white transition-colors duration-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/user/bookingslot" className="hover:text-white transition-colors duration-300">
                Grounds
              </Link>
            </li>
            <li>
              <Link to="/user/login" className="hover:text-white transition-colors duration-300">
                Login
              </Link>
            </li>
            <li>
              <Link to="/user/UserRegister" className="hover:text-white transition-colors duration-300">
                Sign Up
              </Link>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <p className="text-sm">📧 support@BoxArena.com</p>
          <p className="text-sm mt-1">📞 +91 90000 00000</p>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-white/5 text-center py-5 text-sm text-gray-500">
        © {new Date().getFullYear()} BoxArena. All rights reserved.
      </div>
    </footer>
  );
}
