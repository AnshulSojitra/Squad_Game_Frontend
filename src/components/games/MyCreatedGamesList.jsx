import { useEffect, useState } from "react";
import { Calendar, Clock3, MapPin, Users, Trophy, GamepadIcon } from "lucide-react";
import { getMyGames } from "../../services/api";
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

export default function MyCreatedGamesList({
  refreshKey = 0,
  onLogin,
  isLoggedIn,
}) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("userToken");
  const loggedIn = typeof isLoggedIn === "boolean" ? isLoggedIn : Boolean(token);

  useEffect(() => {
    const fetchMyGames = async () => {
      if (!loggedIn) {
        setGames([]);
        return;
      }

      try {
        setLoading(true);
        const response = await getMyGames();
        const data = response?.data;
        const gamesArray = Array.isArray(data) ? data : Array.isArray(data?.games) ? data.games : [];
        setGames(gamesArray);
      } catch (error) {
        console.error("Failed to fetch my games", error);
        setGames([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyGames();
  }, [loggedIn, refreshKey]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-700 bg-slate-900/60 p-6 animate-pulse"
          >
            <div className="h-6 w-36 bg-slate-700 rounded mb-4" />
            <div className="space-y-3">
              <div className="h-4 w-40 bg-slate-700 rounded" />
              <div className="h-4 w-44 bg-slate-700 rounded" />
              <div className="h-4 w-52 bg-slate-700 rounded" />
            </div>
            <div className="h-8 w-24 bg-slate-700 rounded mt-5" />
          </div>
        ))}
      </div>
    );
  }

  if (!games.length) {
    return (
      <div className="flex flex-col items-center justify-center py-14 rounded-xl border border-slate-800 bg-slate-900/40">
        <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-3">
          <GamepadIcon className="w-8 h-8 text-indigo-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No Created Games</h3>
        <p className="text-slate-400 text-center max-w-md">
          {loggedIn
            ? "You have not created any games yet."
            : "Login to view games created by you."}
        </p>
        {!loggedIn && (
          <button
            type="button"
            onClick={onLogin}
            className="mt-5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all"
          >
            Login
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map((game) => {
        const totalPlayers = Number(game.totalPlayers ?? 0);
        const joinedPlayers = Number(game.joinedPlayersCount ?? 0);
        const totalTeams = Number(game.totalTeams ?? 0);
        const spotsLeft = Math.max(totalPlayers - joinedPlayers, 0);
        const ground = game.Ground || {};
        const slots = Array.isArray(game.GameSlots) ? game.GameSlots : [];
        const firstSlot = slots[0]?.Slot || null;
        const slotLabel = firstSlot
          ? `${formatTime(firstSlot.startTime)} - ${formatTime(firstSlot.endTime)}`
          : "Slots not available";

        return (
          <div
            key={game.id ?? game._id ?? `${game.sport}-${game.date}`}
            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold text-white">{game.sport || "Game"}</h3>
              <span className="px-2 py-1 rounded-md text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                {game.status || "Open"}
              </span>
            </div>

            <div className="space-y-2 text-sm text-slate-300">
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
              <p className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-indigo-400" />
                Teams: {totalTeams}
              </p>
              <p className="flex items-start gap-2">
                <Clock3 className="w-4 h-4 text-indigo-400 mt-0.5" />
                <span>{slotLabel}</span>
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700">
              <p className="text-slate-200 font-semibold">Rs {game.pricePerPlayer} / player</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
