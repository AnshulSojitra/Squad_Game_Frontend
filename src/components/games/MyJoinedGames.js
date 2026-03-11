import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock3, MapPin, Users, Trophy, GamepadIcon, User, Phone } from "lucide-react";
import { leaveGameApi } from "../../services/api";
import ConfirmModal from "../utils/ConfirmModal";
import Toast from "../utils/Toast";
import ShowMore from "../utils/ShowMore";
import { useBoxArena } from "../../context/BoxArenaContext";
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

export default function MyJoinedGamesList({
  refreshKey = 0,
  onLogin,
  isLoggedIn,
}) {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const {
    auth,
    userProfile,
    myJoinedGames,
    loading,
    refreshMyJoinedGames,
    setMyJoinedGames,
  } = useBoxArena();
  const [leavingGameId, setLeavingGameId] = useState(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [toast, setToast] = useState({ show: false, type: "info", message: "" });
  const loggedIn = typeof isLoggedIn === "boolean" ? isLoggedIn : auth.isUserAuthenticated;

  const resolveUserId = (user) =>
    user?.id ?? user?._id ?? user?.userId ?? user?.user?.id ?? user?.user?._id ?? null;

  const getGameOwnerId = (game) => game?.createdBy ?? null;
  const getGameId = (game) => game?.id ?? game?._id ?? null;

  useEffect(() => {
    if (!loggedIn) {
      setMyJoinedGames([]);
      return;
    }

    refreshMyJoinedGames();
  }, [loggedIn, refreshKey]);

  const games = useMemo(() => {
    const currentUserId = resolveUserId(userProfile);
    return myJoinedGames.filter((game) => {
      if (currentUserId == null) return true;
      const ownerId = getGameOwnerId(game);
      if (ownerId == null) return true;
      return String(ownerId) !== String(currentUserId);
    });
  }, [myJoinedGames, userProfile]);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  const openLeaveConfirm = (game) => {
    const gameId = getGameId(game);
    if (!gameId) return;
    setSelectedGameId(String(gameId));
    setShowLeaveConfirm(true);
  };

  const openGameDetails = (game) => {
    const gameId = getGameId(game);
    if (!gameId) {
      showToast("error", "Tournament details are not available");
      return;
    }
    navigate(`/profile/joinedgames/${gameId}`);
  };

  const handleConfirmLeave = async () => {
    if (!selectedGameId) return;

    try {
      setLeavingGameId(String(selectedGameId));
      const response = await leaveGameApi(selectedGameId);
      setMyJoinedGames((prev) =>
        prev.filter((item) => String(getGameId(item)) !== String(selectedGameId))
      );
      showToast("success", response?.data?.message || "Left tournament successfully");
    } catch (error) {
      console.error("Failed to leave tournament", error);
      showToast("error", error?.response?.data?.message || "Failed to leave tournament. Please try again.");
    } finally {
      setLeavingGameId(null);
      setShowLeaveConfirm(false);
      setSelectedGameId(null);
    }
  };

  let content = null;

  if (loading.myJoinedGames) {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className={`rounded-xl border p-6 animate-pulse ${
              isDarkMode
                ? "border-slate-700 bg-slate-900/60"
                : "border-slate-200 bg-slate-100/60"
            }`}
          >
            <div className={`h-6 w-36 rounded mb-4 ${isDarkMode ? "bg-slate-700" : "bg-slate-300"}`} />
            <div className="space-y-3">
              <div className={`h-4 w-40 rounded ${isDarkMode ? "bg-slate-700" : "bg-slate-300"}`} />
              <div className={`h-4 w-44 rounded ${isDarkMode ? "bg-slate-700" : "bg-slate-300"}`} />
              <div className={`h-4 w-52 rounded ${isDarkMode ? "bg-slate-700" : "bg-slate-300"}`} />
            </div>
            <div className={`h-8 w-24 rounded mt-5 ${isDarkMode ? "bg-slate-700" : "bg-slate-300"}`} />
          </div>
        ))}
      </div>
    );
  }

  if (!loading.myJoinedGames && !games.length) {
    content = (
      <div className={`flex flex-col items-center justify-center py-14 rounded-xl border ${
        isDarkMode
          ? "border-slate-800 bg-slate-900/40"
          : "border-slate-200 bg-slate-50/40"
      }`}>
        <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-3">
          <GamepadIcon className="w-8 h-8 text-indigo-400" />
        </div>
        <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>No Joined Tournaments</h3>
        <p className={`text-center max-w-md ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
          {loggedIn
            ? "You have not joined any tournaments created by other users yet."
            : "Login to view tournaments you joined."}
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

  if (!loading.myJoinedGames && games.length) {
    content = (
      <ShowMore
        items={games}
        initialCount={6}
        increment={6}
        containerClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        renderItem={(game) => {
          const totalPlayers = Number(game.totalPlayers ?? 0);
          const joinedPlayers = Number(game.joinedPlayersCount ?? 0);
          const totalTeams = Number(game.totalTeams ?? 0);
          const spotsLeft = Math.max(totalPlayers - joinedPlayers, 0);
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
              onClick={() => openGameDetails(game)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openGameDetails(game);
                }
              }}
              className={`bg-gradient-to-br rounded-xl p-6 cursor-pointer hover:border-indigo-500 transition-all ${
                isDarkMode
                  ? "from-slate-800 to-slate-900 border border-slate-700"
                  : "from-white to-slate-50 border border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{game.name || "Tournament"}</h3>
                </div>
                <span className="px-2 py-1 rounded-md text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  {game.status || "Open"}
                </span>
              </div>

              <div className={`space-y-2 text-sm ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                <p className="flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-400" />
                  {game.Creator?.name || "Unknown creator"}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-indigo-400" />
                  {game.Creator?.phoneNumber || "Unknown number"}
                </p>
                <p className="flex items-center gap-2">
                  <GamepadIcon className="w-4 h-4 text-indigo-400" />
                  {game.sport || "Unknown sport"}
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
                <p className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-indigo-400" />
                  Teams: {totalTeams}
                </p>
                <p className="flex items-start gap-2">
                  <Clock3 className="w-4 h-4 text-indigo-400 mt-0.5" />
                  <span>{slotLabel}</span>
                </p>
              </div>

              <div className={`mt-4 pt-4 flex items-center justify-between gap-3 ${
                isDarkMode ? "border-t border-slate-700" : "border-t border-slate-200"
              }`}>
                <p className={`font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>Rs {game.pricePerPlayer} / player</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openLeaveConfirm(game);
                  }}
                  disabled={leavingGameId === String(getGameId(game))}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-rose-600 hover:bg-rose-700 disabled:opacity-60 disabled:cursor-not-allowed text-white transition-all"
                >
                  {leavingGameId === String(getGameId(game)) ? "Leaving..." : "Leave Tournament"}
                </button>
              </div>
            </div>
          );
        }}
      />
    );
  }

  return (
    <>
      {content}
      <ConfirmModal
        isOpen={showLeaveConfirm}
        title="Leave Tournament"
        message="Are you sure you want to leave this tournament?"
        onConfirm={handleConfirmLeave}
        onCancel={() => {
          setShowLeaveConfirm(false);
          setSelectedGameId(null);
        }}
      />
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </>
  );
}
