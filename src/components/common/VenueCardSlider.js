import { useRef, useState, useEffect, useMemo } from "react";
import VenueCard from "./VenueCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function VenueCardSlider({ grounds, loading }) {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const CARD_WIDTH = 320;
  const GAP = 24;

  // Limit grounds to 12
  const limitedGrounds = useMemo(() => grounds?.slice(0, 12) || [], [grounds]);

  useEffect(() => {
    const updateCardsPerView = () => {
      const w = window.innerWidth;
      if (w < 640) setCardsPerView(1);
      else if (w < 1024) setCardsPerView(2);
      else if (w < 1280) setCardsPerView(3);
      else setCardsPerView(4);
    };
    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  const totalSlides = Math.ceil(limitedGrounds.length / cardsPerView);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !limitedGrounds.length) return;
    const check = () => {
      setCanScrollLeft(el.scrollLeft > 10);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    };
    check();
    el.addEventListener("scroll", check);
    const t = setTimeout(check, 100);
    return () => {
      el.removeEventListener("scroll", check);
      clearTimeout(t);
    };
  }, [limitedGrounds, cardsPerView]);

  const scrollTo = (index) => {
    const el = scrollRef.current;
    if (!el) return;
    const target = index * cardsPerView * (CARD_WIDTH + GAP);
    el.scrollTo({ left: target, behavior: "smooth" });
    setCurrentIndex(index);
  };

  const scrollPrev = () => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = CARD_WIDTH + GAP;
    el.scrollBy({ left: -cardsPerView * cardWidth, behavior: "smooth" });
  };

  const scrollNext = () => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = CARD_WIDTH + GAP;
    el.scrollBy({ left: cardsPerView * cardWidth, behavior: "smooth" });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !limitedGrounds.length) return;
    const handleScroll = () => {
      const idx = Math.round(el.scrollLeft / (CARD_WIDTH + GAP) / cardsPerView);
      setCurrentIndex(Math.min(idx, totalSlides - 1));
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [limitedGrounds, cardsPerView, totalSlides]);

  if (loading) {
    return (
      <div className="flex gap-6 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[300px] h-72 bg-gray-800/50 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!limitedGrounds.length) {
    return null;
  }

  return (
    <div className="relative">
      {/* Slider container */}
      <div className="relative -mx-4 sm:mx-0">
        {/* Left arrow */}
        <button
          onClick={scrollPrev}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-300 -translate-x-2 sm:translate-x-0 sm:-left-4 ${
            !canScrollLeft ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          aria-label="Previous"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Right arrow */}
        <button
          onClick={scrollNext}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-300 translate-x-2 sm:translate-x-0 sm:-right-4 ${
            !canScrollRight ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          aria-label="Next"
        >
          <ChevronRight size={24} />
        </button>

        {/* Scrollable cards */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto overflow-y-hidden pb-4 hide-scrollbar scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {limitedGrounds.map((ground) => (
            <div
              key={ground.id}
              className="flex-shrink-0 w-[300px] sm:w-[320px]"
            >
              <VenueCard ground={ground} />
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      {totalSlides > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "bg-indigo-500 w-6"
                  : "bg-gray-600 hover:bg-gray-500"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
