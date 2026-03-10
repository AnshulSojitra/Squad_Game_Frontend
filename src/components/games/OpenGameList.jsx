import { Calendar, Clock3, MapPin, Users, GamepadIcon} from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ShowMore from "../utils/ShowMore";
import { useTheme } from "../../context/ThemeContext";

const formatDate = (date) => {
  if (!date) return "N/A";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return String(date);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (time) => {
  if (!time) return "";
  const [h = "0", m = "00"] = String(time).split(":");
  const hour = Number(h);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
};

export default function OpenGameList({ games = [], onCreateGame, joinedGameIds = [] }) {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const joinedSet = useMemo(
    () => new Set((joinedGameIds || []).map((id) => String(id))),
    [joinedGameIds]
  );

  if (!games.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20"> 
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full flex items-center justify-center mb-4">
          <GamepadIcon className="w-10 h-10 text-indigo-500" />
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>No tournaments available</h2>
        <p className={`mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Host your first Tournament to get started</p>
        <button
          type="button"
          onClick={onCreateGame}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all"
        >
          Create First Tournament
        </button>
      </div>
    );
  }

  return (
    <ShowMore
      items={games}
      initialCount={12}
      increment={12}
      containerClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6"
      renderItem={(game) => {
        const gameId = game.id ?? game._id;
        const gameDisplayName = game?.name || game?.sport || "Game";
        const totalPlayers = Number(game.totalPlayers ?? 0);
        const joinedPlayers = Number(game.joinedPlayersCount ?? 0);
        const spotsLeft = Math.max(totalPlayers - joinedPlayers, 0);
        const status = String(game.status || "open").toLowerCase();
        const isFull = status === "full" || spotsLeft === 0;
        const isAlreadyJoined = joinedSet.has(String(gameId));
        const ground = game.Ground || {};
        const slots = Array.isArray(game.GameSlots) ? game.GameSlots : [];
        const firstSlot = slots[0]?.Slot || null;
        const slotLabel = firstSlot
          ? `${formatTime(firstSlot.startTime)}`
          : "Slots not available";

        return (
          <div
            key={game.id ?? game._id ?? `${game.sport}-${game.date}`}
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/games/${gameId}`, { state: { game } })}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate(`/games/${gameId}`, { state: { game } });
              }
            }}
            className={`rounded-xl p-6 hover:border-indigo-500 transition-all cursor-pointer ${
              isDarkMode
                ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700'
                : 'bg-gradient-to-br from-white to-slate-50 border border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{gameDisplayName}</h3>
              <span
                className={`px-2 py-1 rounded-md text-xs font-semibold border ${
                  isFull
                    ? "bg-red-500/15 text-red-300 border-red-500/30"
                    : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                }`}
              >
                {isFull ? "full" : game.status || "open"}
              </span>
            </div>

            <div className={`space-y-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              <p className="flex items-center gap-2">
                <GamepadIcon className="w-4 h-4 text-indigo-400" />
                 {game.sport}
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                {formatDate(game.date)}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400" />
                {ground.name || "Unknown ground"}
              </p>
              <p className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                {joinedPlayers}/{totalPlayers} joined ({spotsLeft} spots left)
              </p>
              <p className="flex items-start gap-2">
                <Clock3 className="w-4 h-4 text-indigo-400 mt-0.5" />
                <span> Starts At : {slotLabel}</span>
              </p>
            </div>

            <div className={`mt-4 pt-4 flex items-center justify-between ${
              isDarkMode ? 'border-t border-slate-700' : 'border-t border-slate-200'
            }`}>
              <p className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Rs {game.pricePerPlayer} / player</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/games/${gameId}`, { state: { game } });
                }}
                disabled={isAlreadyJoined || isFull}
                className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                  isAlreadyJoined || isFull
                    ? isDarkMode ? "bg-slate-700 text-slate-300 cursor-not-allowed" : "bg-slate-200 text-slate-600 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {isAlreadyJoined ? "You have already joined" : isFull ? "Tournament Full" : "Join"}
              </button>
            </div>
          </div>
        );
      }}
    />
  );
}
