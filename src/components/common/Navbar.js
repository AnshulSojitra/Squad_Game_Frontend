import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useBoxArena } from "../../context/BoxArenaContext";
import ThemeToggle from "../utils/ThemeToggle";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const { auth, userProfile: user, logoutUser } = useBoxArena();
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    const onPointerDown = (e) => {
      if (
        isUserMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target)
      ) {
        setIsUserMenuOpen(false);
      }

      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown, { passive: true });

    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.body.style.overflow = "";
    };
  }, [isUserMenuOpen, isMobileMenuOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e) => {
      if (e.matches) setIsMobileMenuOpen(false);
    };
    onChange(mq);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const isActivePath = (to) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  };

  const mobileItemClasses = (to) => {
    const active = isActivePath(to);
    const base =
      "group flex items-center justify-between w-full px-4 py-3 rounded-xl text-[15px] font-medium transition-colors";

    if (active) {
      return `${base} ${
        isDarkMode
          ? "bg-white/10 text-white"
          : "bg-indigo-50 text-indigo-700"
      }`;
    }

    return `${base} ${
      isDarkMode
        ? "text-gray-200 hover:bg-white/10"
        : "text-gray-700 hover:bg-gray-900/5"
    }`;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
      isDarkMode
        ? isScrolled
          ? "bg-gray-900/95 backdrop-blur-md border-b border-gray-800/50 shadow-2xl border-b-2 border-b-gray-500/30"
          : "bg-gray-900/80 backdrop-blur-sm border-b border-gray-800/30 border-b-2 border-b-gray-500/30"
        : isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-2xl border-b-3 border-b-indigo-500/30"
          : "bg-white/80 backdrop-blur-sm border-b border-gray-200/30 shadow-md"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link
            to="/"
            className={`text-xl sm:text-2xl font-extrabold tracking-wide transition-all duration-300 transform hover:scale-105 ${
              isDarkMode
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent hover:from-indigo-400 hover:to-purple-400"
                : "text-indigo-600 hover:text-indigo-700"
            }`}
          >
            BoxArena
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className={`text-sm font-medium transition-all duration-300 hover:scale-105 relative group ${
                isDarkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              to="/grounds"
              className={`text-sm font-medium transition-all duration-300 hover:scale-105 relative group ${
                isDarkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Grounds
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              to="/user/games"
              className={`text-sm font-medium transition-all duration-300 hover:scale-105 relative group ${
                isDarkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Tournaments
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {auth.isUserAuthenticated && (
              <Link
                to="/user/mybooking"
                className={`text-sm font-medium transition-all duration-300 hover:scale-105 relative group ${
                  isDarkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                My Bookings
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}

            <ThemeToggle />

            {!auth.isUserAuthenticated ? (
              <Link
                to="/user/login"
                className="ml-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25"
              >
                Login / Signup
              </Link>
            ) : (
              <div className="relative ml-2" ref={userMenuRef}>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsUserMenuOpen((v) => !v);
                  }}
                  className={`flex items-center gap-3 font-medium transition-all duration-300 hover:scale-105 group ${
                    isDarkMode ? "text-white" : "text-gray-900"
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
                    className={`w-4 h-4 transition-transform duration-300 ${isUserMenuOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isUserMenuOpen && (
                  <div className={`absolute right-0 mt-3 w-56 rounded-xl shadow-2xl z-50 border backdrop-blur-sm animate-fade-in ${
                    isDarkMode
                      ? "bg-gray-800 text-white border-gray-700"
                      : "bg-white text-gray-900 border-gray-200"
                  }`}>
                    <div className="p-2">
                      <button
                        onClick={() => {
                          navigate("/profile/profile");
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 group ${
                          isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                        }`}
                      >
                        <span className="text-sm font-medium">View Profile</span>
                      </button>

                      <hr className={`my-2 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`} />

                      <button
                        onClick={() => {
                          handleLogout();
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 group ${
                          isDarkMode
                            ? "text-red-400 hover:bg-red-900/20"
                            : "text-red-600 hover:bg-red-50"
                        }`}
                      >
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => {
                setIsUserMenuOpen(false);
                setIsMobileMenuOpen((v) => !v);
              }}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDarkMode
                  ? "text-white hover:bg-white/10"
                  : "text-gray-900 hover:bg-gray-900/10"
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div
            className={`md:hidden fixed inset-0 z-[60] transition ${
              isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
            }`}
            aria-hidden={!isMobileMenuOpen}
          >
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${
                isMobileMenuOpen
                  ? isDarkMode
                    ? "opacity-100 bg-black/60"
                    : "opacity-100 bg-black/40"
                  : "opacity-0 bg-black/0"
              }`}
              aria-hidden="true"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <div
              ref={mobileMenuRef}
              className={`absolute right-0 top-0 h-dvh w-[88vw] max-w-[420px] shadow-2xl overflow-y-auto transform transition-transform duration-300 ${
                isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
              } ${
                isDarkMode
                  ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-900 text-white border-l border-white/10"
                  : "bg-white text-gray-900 border-l border-gray-200"
              } rounded-l-2xl`}
              role="dialog"
              aria-modal="true"
            >
              <div
                className={`px-5 pt-5 pb-4 flex items-start justify-between ${
                  isDarkMode ? "border-b border-white/10" : "border-b border-gray-200"
                }`}
              >
                <div className="min-w-0">
                  <Link
                    to="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`inline-flex items-center text-xl font-extrabold tracking-wide ${
                      isDarkMode
                        ? "bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
                        : "text-indigo-700"
                    }`}
                  >
                    BoxArena
                  </Link>

                  {auth.isUserAuthenticated && (
                    <div className="mt-2 min-w-0">
                      <div className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Signed in as
                      </div>
                      <div className="text-sm font-semibold truncate">
                        {user?.name || "User"}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  className={`p-2 rounded-xl transition-colors ${
                    isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-900/10"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="px-4 py-4">
                <nav className="space-y-2">
                  <Link to="/" className={mobileItemClasses("/")} onClick={() => setIsMobileMenuOpen(false)}>
                    <span>Home</span>
                    <span className="text-xs text-gray-400 group-hover:translate-x-0.5 transition-transform">Go</span>
                  </Link>

                  <Link to="/grounds" className={mobileItemClasses("/grounds")} onClick={() => setIsMobileMenuOpen(false)}>
                    <span>Grounds</span>
                    <span className="text-xs text-gray-400 group-hover:translate-x-0.5 transition-transform">Go</span>
                  </Link>

                  <Link to="/user/games" className={mobileItemClasses("/user/games")} onClick={() => setIsMobileMenuOpen(false)}>
                    <span>Tournaments</span>
                    <span className="text-xs text-gray-400 group-hover:translate-x-0.5 transition-transform">Go</span>
                  </Link>

                  {auth.isUserAuthenticated && (
                    <Link
                      to="/user/mybooking"
                      className={mobileItemClasses("/user/mybooking")}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>My Bookings</span>
                      <span className="text-xs text-gray-400 group-hover:translate-x-0.5 transition-transform">Go</span>
                    </Link>
                  )}

                  <div className={`pt-4 mt-4 border-t ${isDarkMode ? "border-white/10" : "border-gray-200"} space-y-2`}>
                    {!auth.isUserAuthenticated ? (
                      <Link
                        to="/user/login"
                        className="block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-3 rounded-xl text-sm font-semibold text-center shadow-lg shadow-indigo-500/20"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Login / Signup
                      </Link>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            navigate("/profile/profile");
                            setIsMobileMenuOpen(false);
                          }}
                          className={mobileItemClasses("/profile/profile")}
                        >
                          <span>View Profile</span>
                          <span className="text-xs text-gray-400 group-hover:translate-x-0.5 transition-transform">Go</span>
                        </button>

                        <button
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                          className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-[15px] font-medium transition-colors ${
                            isDarkMode
                              ? "text-red-300 hover:bg-red-900/20"
                              : "text-red-700 hover:bg-red-50"
                          }`}
                        >
                          <span>Logout</span>
                          <span className="text-xs">Now</span>
                        </button>
                      </>
                    )}
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
