import { useEffect, useState } from "react";

export default function ScrollToTopButton({ onScrollToTop, visible: visibleProp }) {
  const [visibleState, setVisibleState] = useState(false);
  const visible = visibleProp !== undefined ? visibleProp : visibleState;

  useEffect(() => {
    if (visibleProp !== undefined) return;
    const onScroll = () => setVisibleState(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [visibleProp]);

  const scrollToTop = () => {
    if (onScrollToTop) {
      onScrollToTop();
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Go to top"
      className={`
        fixed bottom-6 right-6 z-50
        h-12 w-12 rounded-full
        bg-gradient-to-tr from-indigo-600 to-purple-600
        text-white
        shadow-xl shadow-indigo-500/30
        flex items-center justify-center
        transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:scale-110 hover:shadow-2xl hover:shadow-indigo-500/40
        active:scale-95
        backdrop-blur-sm border border-white/10
        ${visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-4 pointer-events-none"}
      `}
    >
      {/* Arrow Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 15l7-7 7 7"
        />
      </svg>
    </button>
  );
}
