import SearchInput from "../utils/SearchInput";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

export default function StickySearch({
  search,
  setSearch,
  state,
  setState,
  city,
  setCity,
  game,
  setGame,
  cities = [],
  games = [],
  states = [],
  
  onClear,
  overlay = true,
}) {
  const [openAdvanced, setOpenAdvanced] = useState(false);

  const outerClass = overlay
    ? "w-full max-w-4xl mx-auto transform -translate-y-12 relative z-30"
    : "w-full max-w-4xl mx-auto relative z-10 mt-2";
  const { isDarkMode } = useTheme();

  return (
    <div className={outerClass}>
      <div className={`${isDarkMode ? 'bg-white/[0.04] backdrop-blur-xl border border-white/10 ' : 'bg-white/80 backdrop-blur-lg shadow-lg border border-blue-100/40'} rounded-2xl p-4 flex gap-3 items-center transition-all duration-500 ${isDarkMode ? 'hover:border-white/20' : 'hover:shadow-xl'}`}>
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search for grounds or cities"
            delay={300}
            className={`${isDarkMode ? 'bg-gray-800 text-white placeholder-gray-300 focus:ring-indigo-500/30' : 'bg-white text-gray-900 placeholder-gray-500 focus:ring-blue-300'} w-full rounded-lg border border-gray-700/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-200/50 transition-all duration-300`}
          />
        </div>

        <div className="hidden sm:flex gap-3 items-center">
          <select
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={`${isDarkMode ? 'border border-white/10 bg-gray-800 text-white placeholder-gray-400' : 'border border-blue-200/60 bg-white/90 text-gray-900 placeholder-gray-500 focus:border-blue-400'} px-3 py-2 rounded-lg transition-all duration-300`}
          >
            <option value="">All cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className={`${isDarkMode ? 'border border-white/10 bg-gray-800 text-white placeholder-gray-400' : 'border border-blue-200/60 bg-white/90 text-gray-900 placeholder-gray-500 focus:border-blue-400'} px-3 py-2 rounded-lg transition-all duration-300`}
          >
            <option value="">All State</option>
            {states.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={game}
            onChange={(e) => setGame(e.target.value)}
            className={`${isDarkMode ? 'border border-white/10 bg-gray-800 text-white placeholder-gray-400' : 'border border-blue-200/60 bg-white/90 text-gray-900 placeholder-gray-500 focus:border-blue-400'} px-3 py-2 rounded-lg transition-all duration-300`}
          >
            <option value="">All games</option>
            {games.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <button
            onClick={onClear}
            className={`${isDarkMode ? 'text-sm text-gray-300 hover:text-white' : 'text-sm text-gray-600 hover:text-gray-800'}`}
          >
            Clear
          </button>
        </div>

        <div className="sm:hidden">
          <button
            onClick={() => setOpenAdvanced((s) => !s)}
            className="bg-indigo-600 px-3 py-2 rounded-lg text-white font-semibold"
          >
            Filters
          </button>
        </div>
      </div>

      {/* Mobile advanced panel */}
      {openAdvanced && (
        <div className="mt-3 bg-white/5 p-3 rounded-xl border border-white/10">
          <div className="flex gap-2 mb-3">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="bg-transparent border border-white/10 text-white px-3 py-2 rounded-lg w-1/2"
            >
              <option value="">All cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={game}
              onChange={(e) => setGame(e.target.value)}
              className="bg-transparent border border-white/10 text-white px-3 py-2 rounded-lg w-1/2"
            >
              <option value="">All games</option>
              {games.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <button onClick={() => setOpenAdvanced(false)} className="px-4 py-2 rounded-lg bg-indigo-600 font-semibold text-white">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
