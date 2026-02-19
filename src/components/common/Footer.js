import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

export default function Footer() {
  const { isDarkMode } = useTheme();
  return (
    <footer className={`mt-auto transition-colors duration-300 ${isDarkMode ? 'bg-[#0b1120] text-gray-400 border-t border-white/5' : 'bg-gradient-to-b from-white via-slate-50/50 to-gray-50 text-gray-700 border-t border-gray-200'}`}>
      
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        
        {/* BRAND */}
        <div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} tracking-tight mb-4`}>
            BoxArena
          </h2>
          <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Book sports grounds easily. Discover venues, manage bookings,
            and enjoy seamless play experiences.
          </p>
          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mt-6`}>
            © {new Date().getFullYear()} BoxArena Pvt. Ltd.
            <br />
            All Rights Reserved.
          </p>
        </div>

        {/* COMPANY */}
        <div>
          <h3 className={`font-semibold mb-6 tracking-wide ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Company
          </h3>
          <ul className="space-y-3 text-sm">
            <li><Link to="/about" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-indigo-600'} transition-colors duration-200`}>About Us</Link></li>
            <li><Link to="/blogs" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-indigo-600'} transition-colors duration-200`}>Blogs</Link></li>
            <li><Link to="/contact" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-indigo-600'} transition-colors duration-200`}>Contact</Link></li>
            <li><Link to="/careers" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-indigo-600'} transition-colors duration-200`}>Careers</Link></li>
          </ul>
        </div>

        {/* EXPLORE */}
        <div>
          <h3 className={`font-semibold mb-6 tracking-wide ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Explore
          </h3>
          <ul className="space-y-3 text-sm">
            <li><Link to="/" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-indigo-600'} transition-colors duration-200`}>Home</Link></li>
            <li><Link to="/grounds" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-indigo-600'} transition-colors duration-200`}>Grounds</Link></li>
            <li><Link to="/user/login" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-indigo-600'} transition-colors duration-200`}>Login</Link></li>
            <li><Link to="/faq" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-indigo-600'} transition-colors duration-200`}>FAQs</Link></li>
          </ul>
        </div>

        {/* LEGAL */}
        <div>
          <h3 className={`font-semibold mb-6 tracking-wide ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Privacy & Terms
          </h3>
          <ul className="space-y-3 text-sm">
            <li><Link to="/privacy-policy" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-indigo-600'} transition-colors duration-200`}>Privacy Policy</Link></li>
            <li><Link to="/terms" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-indigo-600'} transition-colors duration-200`}>Terms of Service</Link></li>
            <li><Link to="/cancellation-policy" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-indigo-600'} transition-colors duration-200`}>Cancellation Policy</Link></li>
          </ul>

          <div className={`mt-6 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>📧 support@boxarena.com</p>
            <p className="mt-1">📞 +91 90000 00000</p>
          </div>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className={`border-t py-6 text-center text-xs transition-colors duration-300 ${isDarkMode ? 'border-white/5 text-gray-500' : 'border-gray-200 text-gray-500'}`}>
        Designed & Developed with ❤️ by BoxArena Team
      </div>

    </footer>
  );
}
