import SearchInput from "./SearchInput";
import { useState } from "react";

export default function StickySearch({
  search,
  setSearch,
  city,
  setCity,
  game,
  setGame,
  cities = [],
  games = [],
  onClear,
  overlay = true,
}) {
  const [openAdvanced, setOpenAdvanced] = useState(false);

  const outerClass = overlay
    ? "w-full max-w-4xl mx-auto transform -translate-y-12 relative z-30"
    : "w-full max-w-4xl mx-auto relative z-10 mt-2";

  return (
    <div className={outerClass}>
      <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl flex gap-3 items-center transition-all duration-500 hover:border-white/20">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search for grounds, areas or cities"
            delay={300}
          />
        </div>

        <div className="hidden sm:flex gap-3 items-center text-black">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border border-white/10 text-black px-3 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 transition-all duration-300"
          >
            <option value="">All cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={game}
            onChange={(e) => setGame(e.target.value)}
            className="border border-white/10 text-black px-3 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 transition-all duration-300"
          >
            <option value="">All games</option>
            {games.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <button
            onClick={onClear}
            className="text-sm text-gray-300 hover:text-white"
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
