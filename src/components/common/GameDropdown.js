import { useState } from "react";
import gamesList from "../constants/gamesList";

export default function GameDropdown({ value, onChange }) {
  const [search, setSearch] = useState("");

  const getGameName = (game) => {
    if (typeof game === "string") return game;
    if (game && typeof game === "object") return String(game.name ?? "");
    return "";
  };

  const filteredGames = gamesList.filter((game) =>
    getGameName(game).toLowerCase().includes(search.toLowerCase())
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

        {filteredGames.map((game, index) => {
          const gameName = getGameName(game);
          const optionKey =
            game && typeof game === "object" && game.id != null
              ? game.id
              : index;

          return (
          <option key={optionKey} value={gameName}>
            {gameName}
          </option>
          );
        })}
      </select>
    </div>
  );
}
