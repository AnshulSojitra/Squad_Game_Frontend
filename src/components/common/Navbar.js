import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserProfile } from "../../services/api";
import ThemeToggle from "../utils/ThemeToggle";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  // ✅ TOKEN-BASED AUTH CHECK
  const token = localStorage.getItem("userToken");
  // const user = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(null);

  // expected shape: { name, email }


  useEffect(() => {
  const fetchUserProfile = async () => {
    if (!token) return;

    try {
      const res = await getUserProfile();
      setUser(res.data); // 👈 depends on backend response
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (error) {
      console.error("Failed to fetch user profile", error);

      // token invalid / expired
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
      navigate("/user/login");
    }
  };

  fetchUserProfile();
}, [token, navigate]);


  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    window.location.href = "/"; // back to landing page
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
      isDarkMode
        ? isScrolled
          ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800/50 shadow-2xl'
          : 'bg-gray-900/80 backdrop-blur-sm border-b border-gray-800/30'
        : isScrolled
        ? 'bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-2xl'
        : 'bg-white/80 backdrop-blur-sm border-b border-gray-200/30'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">

          {/* LOGO */}
          <Link
            to="/"
            className={`text-xl sm:text-2xl font-extrabold tracking-wide transition-all duration-300 transform hover:scale-105 ${
              isDarkMode
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent hover:from-indigo-400 hover:to-purple-400'
                : 'text-indigo-600 hover:text-indigo-700'
            }`}
          >
            BoxArena
          </Link>

          {/* LINKS */}
          <div className="hidden md:flex items-center space-x-4">

            <Link
              to="/"
              className={`text-sm font-medium transition-all duration-300 hover:scale-105 relative group ${
                isDarkMode
                  ? 'text-gray-300 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              to="/grounds"
              className={`text-sm font-medium transition-all duration-300 hover:scale-105 relative group ${
                isDarkMode
                  ? 'text-gray-300 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Grounds
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {!token ? (
            // <Link
            //   to="/user/login"
            //   className={`text-sm font-medium transition-all duration-300 hover:scale-105 relative group ${
            //     isDarkMode
            //       ? 'text-gray-300 hover:text-white'
            //       : 'text-gray-600 hover:text-gray-900'
            //   }`}
            // >
            //   My Bookings
            //   <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
            // </Link> 
            null
            ) : (
                    <Link
              to="/user/mybooking"
              className={`text-sm font-medium transition-all duration-300 hover:scale-105 relative group ${
                isDarkMode
                  ? 'text-gray-300 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Bookings
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            )}

            {/* THEME TOGGLE */}
            <ThemeToggle />
            {!token ? (
              /* 🔵 LOGIN BUTTON */
              <Link
                to="/user/login"
                className="ml-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700
                           text-white px-6 py-2.5 rounded-xl
                           text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25"
              >
                Login / Signup
              </Link>
            ) : (
              /* 🟢 USER DROPDOWN */
              <div className="relative ml-2">
                <button
                  onClick={() => setOpen(!open)}
                  className={`flex items-center gap-3 font-medium transition-all duration-300 hover:scale-105 group ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full border-2 border-gradient-to-r from-indigo-500 to-purple-500 p-0.5">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                      className="w-full h-full rounded-full bg-gray-700"
                      alt="user"
                    />
                  </div>
                  <span className="text-sm">{user?.name || "User"}</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {open && (
                  <div className={`absolute right-0 mt-3 w-56 rounded-xl shadow-2xl z-50 border backdrop-blur-sm animate-fade-in ${
                    isDarkMode
                      ? 'bg-gray-800 text-white border-gray-700'
                      : 'bg-white text-gray-900 border-gray-200'
                  }`}>
                    <div className="p-2">
                      <button
                        onClick={() => {
                          navigate("/profile/profile");
                          setOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 group ${
                          isDarkMode
                            ? 'hover:bg-gray-700'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <span className="text-lg group-hover:scale-110 transition-transform duration-200">👤</span>
                        <span className="text-sm font-medium">View Profile</span>
                      </button>

                      <hr className={`my-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} />

                      <button
                        onClick={() => {
                          handleLogout();
                          setOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 group ${
                          isDarkMode
                            ? 'text-red-400 hover:bg-red-900/20'
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <span className="text-lg group-hover:scale-110 transition-transform duration-200">🚪</span>
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDarkMode
                  ? 'text-white hover:bg-white/10'
                  : 'text-gray-900 hover:bg-gray-900/10'
              }`}
            >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className={`md:hidden border-t rounded-b-xl animate-slide-down ${
            isDarkMode
              ? 'border-gray-800/50 bg-gray-900/95 backdrop-blur-md'
              : 'border-gray-200/50 bg-white/95 backdrop-blur-md'
          }`}>
            <div className="px-4 py-4 space-y-3">
              <Link
                to="/"
                className={`block text-sm font-medium py-2 transition-all duration-200 ${
                  isDarkMode
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setOpen(false)}
              >
                Home
              </Link>

              <Link
                to="/Grounds"
                className={`block text-sm font-medium py-2 transition-all duration-200 ${
                  isDarkMode
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setOpen(false)}
              >
                Grounds
              </Link>

              {!token ? (
                <Link
                  to="/user/login"
                  className="block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold text-center mt-4"
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      navigate("/profile/mybooking");
                      setOpen(false);
                    }}
                    className={`w-full text-left text-sm font-medium py-2 transition-all duration-200 ${
                      isDarkMode
                        ? 'text-gray-300 hover:text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    👤 View Profile
                  </button>

                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className={`w-full text-left text-sm font-medium py-2 transition-all duration-200 ${
                      isDarkMode
                        ? 'text-red-400 hover:text-red-300'
                        : 'text-red-600 hover:text-red-700'
                    }`}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    </nav>
  );
}
