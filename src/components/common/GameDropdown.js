import { useState } from "react";
import gamesList from "../constants/gamesList";

export default function GameDropdown({ value, onChange }) {
  const [search, setSearch] = useState("");

  const filteredGames = gamesList.filter((game) =>
    game.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* <input
        type="text"
        placeholder="Search game..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      /> */}

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="">Select Game</option>

        {filteredGames.map((game, index) => (
          <option key={index} value={game}>
            {game}
          </option>
        ))}
      </select>
    </div>
  );
}
