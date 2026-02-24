import React from "react";

/**
 * Reusable Loader Component
 * 
 * @param {string} variant - "button" | "page" | "dashboard" | "simple" (default: "button")
 * @param {string} text - Custom loading text
 * @param {boolean} fullScreen - Whether to take full screen height (for page loaders)
 */
const Loader = ({ variant = "button", text = "Loading", fullScreen = true }) => {
  // Button loader variant
  if (variant === "button") {
    return (
      <span className="flex items-center justify-center gap-2">
        <span className="animate-spin">⏳</span>
        {text}
      </span>
    );
  }

  // Simple spinner variant (minimal)
  if (variant === "simple") {
    return (
      <div className={`flex items-center justify-center ${fullScreen ? "min-h-screen" : ""}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  // Dashboard variant (with description and background effects)
  if (variant === "dashboard") {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/40 p-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />
          <div className="absolute -bottom-36 -left-40 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="relative flex items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-400" />
          <div>
            <p className="text-white font-semibold">{text}</p>
            <p className="text-sm text-slate-400">Fetching latest data…</p>
          </div>
        </div>
      </div>
    );
  }

  // Page loader variant (centered with description)
  if (variant === "page") {
    return (
      <div className={`flex items-center justify-center ${fullScreen ? "min-h-screen" : "py-12"}`}>
        <div className="text-center">
          <div className="inline-block">
            <svg
              className="w-12 h-12 animate-spin text-indigo-600"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
          </div>
          <p className="mt-4 text-slate-700 dark:text-slate-300 font-semibold">
            {text}
          </p>
        </div>
      </div>
    );
  }

  // Fallback to button variant
  return (
    <span className="flex items-center justify-center gap-2">
      <span className="animate-spin">⏳</span>
      {text}
    </span>
  );
};

export default Loader;
