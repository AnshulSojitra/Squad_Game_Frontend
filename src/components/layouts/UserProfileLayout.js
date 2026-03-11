import { Outlet } from "react-router-dom";
import UserProfileSidebar from "../../components/sidebar/UserProfileSidebar";
import Navbar from "../../components/common/Navbar";
import { useTheme } from "../../context/ThemeContext";
import { useEffect, useRef, useState } from "react";

export default function UserProfileLayout() {
  const { isDarkMode } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarPanelRef = useRef(null);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsSidebarOpen(false);
    };
    const onPointerDown = (e) => {
      if (
        isSidebarOpen &&
        sidebarPanelRef.current &&
        !sidebarPanelRef.current.contains(e.target)
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown, { passive: true });
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [isSidebarOpen]);

  return (
    <>
      <Navbar />
      <div
        className={`min-h-screen pt-16 ${
          isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
        }`}
      >
        {/* Body */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          {/* Mobile: open profile menu */}
          <div className="md:hidden mb-4">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className={`w-full inline-flex items-center justify-between px-4 py-3 rounded-xl border shadow-sm ${
                isDarkMode
                  ? "bg-gray-900 border-white/10 text-white"
                  : "bg-white border-gray-200 text-gray-900"
              }`}
            >
              <span className="font-semibold">Profile menu</span>
              <span className={isDarkMode ? "text-gray-300" : "text-gray-500"}>
                Open
              </span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Desktop sidebar */}
            <div className="hidden md:block shrink-0">
              <UserProfileSidebar />
            </div>

            {/* Main Content */}
            <div
              className={`flex-1 min-w-0 rounded-xl shadow-lg p-4 sm:p-6 ${
                isDarkMode
                  ? "bg-gray-800 text-gray-100"
                  : "bg-white text-gray-900 border border-gray-200"
              }`}
            >
              <Outlet />
            </div>
          </div>
        </div>

        {/* Mobile sidebar drawer */}
        <div
          className={`md:hidden fixed inset-0 z-[70] transition ${
            isSidebarOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
          aria-hidden={!isSidebarOpen}
        >
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              isSidebarOpen
                ? isDarkMode
                  ? "opacity-100 bg-black/60"
                  : "opacity-100 bg-black/40"
                : "opacity-0 bg-black/0"
            }`}
            aria-hidden="true"
            onClick={() => setIsSidebarOpen(false)}
          />

          <div
            ref={sidebarPanelRef}
            className={`absolute left-0 top-0 h-dvh w-[88vw] max-w-[420px] shadow-2xl overflow-y-auto transform transition-transform duration-300 ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } ${
              isDarkMode
                ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-900 text-white border-r border-white/10"
                : "bg-white text-gray-900 border-r border-gray-200"
            } rounded-r-2xl`}
            role="dialog"
            aria-modal="true"
          >
            <div
              className={`px-5 pt-5 pb-4 flex items-center justify-between ${
                isDarkMode ? "border-b border-white/10" : "border-b border-gray-200"
              }`}
            >
              <span className="text-sm font-semibold tracking-wide">
                Profile
              </span>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className={`p-2 rounded-xl transition-colors ${
                  isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-900/10"
                }`}
                aria-label="Close profile menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-4" onClick={() => setIsSidebarOpen(false)}>
              <UserProfileSidebar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
