import { useEffect, useRef, useState } from "react";

/**
 * ScrollReveal - Animates children when they enter the viewport
 * Uses smooth cubic-bezier easing for elegant, fluid animations
 * @param {string} animation - 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'blur' | 'zoom-in'
 * @param {number} delay - Animation delay in ms
 * @param {number} threshold - Intersection threshold (0-1)
 * @param {string} className - Additional classes
 */
export default function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  threshold = 0.08,
  className = "",
  once = true,
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -80px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const animClasses = {
    "fade-up": "translate-y-16 opacity-0",
    "fade-down": "-translate-y-16 opacity-0",
    "fade-left": "translate-x-16 opacity-0",
    "fade-right": "-translate-x-16 opacity-0",
    scale: "scale-[0.96] opacity-0",
    blur: "opacity-0 blur-lg",
    "zoom-in": "scale-95 opacity-0",
  };

  const animVisibleClasses = {
    "fade-up": "translate-y-0 opacity-100",
    "fade-down": "translate-y-0 opacity-100",
    "fade-left": "translate-x-0 opacity-100",
    "fade-right": "translate-x-0 opacity-100",
    scale: "scale-100 opacity-100",
    blur: "opacity-100 blur-0",
    "zoom-in": "scale-100 opacity-100",
  };

  const baseClass = animClasses[animation] || animClasses["fade-up"];
  const visibleClass = animVisibleClasses[animation] || animVisibleClasses["fade-up"];

  return (
    <div
      ref={ref}
      className={`transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? visibleClass : baseClass} ${className}`}
      style={{
        transitionDelay: isVisible ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}
