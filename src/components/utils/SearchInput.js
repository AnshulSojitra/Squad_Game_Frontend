import { useEffect, useState } from "react";

export default function SearchInput({
  value = "",
  onChange,
  placeholder = "Search...",
  delay = 0, // debounce delay (ms). 0 = no debounce
  className = "",
}) {
  const [localValue, setLocalValue] = useState(value);

  // Sync external value → local state
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Handle debounce logic
  useEffect(() => {
    if (!onChange) return;

    if (delay === 0) {
      onChange(localValue);
      return;
    }

    const timer = setTimeout(() => {
      onChange(localValue);
    }, delay);

    return () => clearTimeout(timer);
  }, [localValue, delay, onChange]);

  return (
    <input
      type="text"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      placeholder={placeholder}
      className={`w-80 px-4 py-2 border rounded-lg 
        focus:outline-none focus:ring-2 focus:ring-indigo-500
       bg-gray-800 text-white placeholder-gray-400 transition-all duration-300 ${className}`}
    />
  );
}
