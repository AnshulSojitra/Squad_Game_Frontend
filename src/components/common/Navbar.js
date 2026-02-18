import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserProfile } from "../../services/api";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

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
      isScrolled
        ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800/50 shadow-2xl'
        : 'bg-gray-900/80 backdrop-blur-sm border-b border-gray-800/30'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">

          {/* LOGO */}
          <Link
            to="/"
            className="text-xl sm:text-2xl font-extrabold tracking-wide bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent hover:from-indigo-400 hover:to-purple-400 transition-all duration-300 transform hover:scale-105"
          >
            BoxArena
          </Link>

          {/* LINKS */}
          <div className="hidden md:flex items-center space-x-8">

            <Link
              to="/"
              className="text-gray-300 hover:text-white text-sm font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              to="/Grounds"
              className="text-gray-300 hover:text-white text-sm font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              Grounds
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              to="/user/mybooking"
              className="text-gray-300 hover:text-white text-sm font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              My Bookings
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* AUTH SECTION */}
            {!token ? (
              /* 🔵 LOGIN BUTTON */
              <Link
                to="/user/login"
                className="ml-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700
                           text-white px-6 py-2.5 rounded-xl
                           text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25"
              >
                Login / Signup
              </Link>
            ) : (
              /* 🟢 USER DROPDOWN */
              <div className="relative ml-4">
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-3 text-white font-medium transition-all duration-300 hover:scale-105 group"
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
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl z-50 text-black border border-gray-200/50 backdrop-blur-sm animate-fade-in">
                    <div className="p-2">
                      <button
                        onClick={() => {
                          navigate("/profile/profile");
                          setOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center gap-3 group"
                      >
                        <span className="text-lg group-hover:scale-110 transition-transform duration-200">👤</span>
                        <span className="text-sm font-medium">View Profile</span>
                      </button>

                      <hr className="my-2 border-gray-200" />

                      <button
                        onClick={() => {
                          handleLogout();
                          setOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center gap-3 group"
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
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="md:hidden border-t border-gray-800/50 bg-gray-900/95 backdrop-blur-md rounded-b-xl animate-slide-down">
            <div className="px-4 py-4 space-y-3">
              <Link
                to="/"
                className="block text-gray-300 hover:text-white text-sm font-medium py-2 transition-all duration-200"
                onClick={() => setOpen(false)}
              >
                Home
              </Link>

              <Link
                to="/Grounds"
                className="block text-gray-300 hover:text-white text-sm font-medium py-2 transition-all duration-200"
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
                    className="w-full text-left text-gray-300 hover:text-white text-sm font-medium py-2 transition-all duration-200"
                  >
                    👤 View Profile
                  </button>

                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="w-full text-left text-red-400 hover:text-red-300 text-sm font-medium py-2 transition-all duration-200"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
