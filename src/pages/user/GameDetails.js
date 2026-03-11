import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Calendar, Clock3, MapPin, Users, ArrowLeft ,GamepadIcon} from "lucide-react";
import { getMyJoinedGames, getOpenGames, getUserProfile, joinGameApi } from "../../services/api";
import Loader from "../../components/utils/Loader";
import Toast from "../../components/utils/Toast";
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

export default function GameDetails() {
  const { gameId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [game, setGame] = useState(location.state?.game || null);
  const [loading, setLoading] = useState(!location.state?.game);
  const [joining, setJoining] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [joinedGameIds, setJoinedGameIds] = useState([]);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const resolveUserId = (user) =>
    user?.id ?? user?._id ?? user?.userId ?? user?.user?.id ?? user?.user?._id ?? null;

  const fetchGameById = async () => {
    try {
      setLoading(true);
      const response = await getOpenGames();
      const data = response?.data;
      const gamesArray = Array.isArray(data) ? data : Array.isArray(data?.games) ? data.games : [];
      const found = gamesArray.find((item) => String(item.id ?? item._id) === String(gameId));

      if (!found) {
        setToast({
          show: true,
          type: "error",
          message: "tournament not found",
        });
        return;
      }

      setGame(found);
    } catch (error) {
      console.error("Failed to load tournament details", error);
      setToast({
        show: true,
        type: "error",
        message: "Failed to load tournament details",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameById();
  }, [gameId]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!localStorage.getItem("userToken")) return;
      try {
        const response = await getUserProfile();
        setCurrentUserId(resolveUserId(response?.data));
      } catch (error) {
        console.error("Failed to fetch current user", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchJoinedGames = async () => {
      if (!localStorage.getItem("userToken")) {
        setJoinedGameIds([]);
        return;
      }

      try {
        const response = await getMyJoinedGames();
        const data = response?.data;
        const joinedArray = Array.isArray(data)
          ? data
          : Array.isArray(data?.games)
            ? data.games
            : [];
        const ids = joinedArray
          .map((item) => item?.id ?? item?._id)
          .filter(Boolean)
          .map((id) => String(id));
        setJoinedGameIds(ids);
      } catch (error) {
        console.error("Failed to fetch joined tournaments", error);
      }
    };

    fetchJoinedGames();
  }, [gameId]);

  const ground = game?.Ground || {};
  const slots = useMemo(
    () => (Array.isArray(game?.GameSlots) ? game.GameSlots : []),
    [game]
  );

  const totalPlayers = Number(game?.totalPlayers ?? 0);
  const joinedPlayers = Number(game?.joinedPlayersCount ?? 0);
  const spotsLeft = Math.max(totalPlayers - joinedPlayers, 0);
  const currentGameId = String(game?.id ?? game?._id ?? gameId);
  const isAlreadyJoined = joinedGameIds.includes(currentGameId);
  const gameOwnerId = game?.createdBy ?? game?.createdById ?? game?.ownerId ?? game?.UserId ?? null;
  const isOwner = currentUserId != null && String(currentUserId) === String(gameOwnerId);
  const isGameFull = spotsLeft <= 0;

  const handleJoinGame = async () => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      setToast({
        show: true,
        type: "error",
        message: "Please login to join this tournament",
      });
      navigate("/user/login");
      return;
    }

    if (isOwner) {
      setToast({
        show: true,
        type: "error",
        message: "You cannot join your own tournament",
      });
      return;
    }

    if (isAlreadyJoined) {
      setToast({
        show: true,
        type: "info",
        message: "You have already joined",
      });
      return;
    }

    if (isGameFull) {
      setToast({
        show: true,
        type: "error",
        message: "This tournament is already full",
      });
      return;
    }

    try {
      setJoining(true);
      await joinGameApi(game.id ?? game._id ?? gameId);
      setToast({
        show: true,
        type: "success",
        message: "Joined tournament successfully",
      });
      setJoinedGameIds((prev) => (prev.includes(currentGameId) ? prev : [...prev, currentGameId]));
      await fetchGameById();
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to join tournament";
      setToast({
        show: true,
        type: "error",
        message,
      });
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return <Loader variant="page" text="Loading tournament details..." />;
  }

  if (!game) {
    return (
      <div className={`min-h-screen px-4 sm:px-6 lg:px-8 py-6 ${
        isDarkMode
          ? 'bg-gradient-to-br from-slate-950 to-slate-900'
          : 'bg-gradient-to-br from-white to-slate-50'
      }`}>
        <div className="max-w-5xl mx-auto">
          <button
            type="button"
            onClick={() => navigate("/games")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
              isDarkMode
                ? 'text-white bg-slate-800 hover:bg-slate-700'
                : 'text-slate-900 bg-slate-200 hover:bg-slate-300'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tournaments
          </button>
        </div>
        <Toast
          show={toast.show}
          type={toast.type}
          message={toast.message}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-4 sm:px-6 lg:px-8 py-6 ${
      isDarkMode
        ? 'bg-gradient-to-br from-slate-950 to-slate-900'
        : 'bg-gradient-to-br from-white to-slate-50'
    }`}>
      <div className="max-w-5xl mx-auto space-y-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
            isDarkMode
              ? 'text-white bg-slate-800 hover:bg-slate-700'
              : 'text-slate-900 bg-slate-200 hover:bg-slate-300'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className={`bg-gradient-to-br border rounded-2xl p-6 md:p-8 ${
          isDarkMode
            ? 'from-slate-900 to-slate-800 border-slate-700'
            : 'from-white to-slate-50 border-slate-200'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <h1 className={`text-2xl sm:text-3xl font-bold break-words ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{game.name}</h1>
            </div>
            <span className="px-3 py-1 rounded-md text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              {game.status || "Open"}
            </span>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 ${
            isDarkMode ? 'text-slate-200' : 'text-slate-700'
          }`}>
            <div className="space-y-3">
               <p className="flex items-center gap-2">
                <GamepadIcon className="w-4 h-4 text-indigo-400" />
                Sport: {game.sport}
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                Date: {formatDate(game.date)}
              </p>
              <p className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                Players: {joinedPlayers}/{totalPlayers} joined ({spotsLeft} spots left)
              </p>
              <p className={`text-lg sm:text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Rs {game.pricePerPlayer} / player
              </p>
              <button
                type="button"
                onClick={handleJoinGame}
                disabled={joining || isAlreadyJoined || isOwner || isGameFull}
                className={`mt-2 w-full sm:w-auto px-4 py-2 rounded-xl font-semibold transition-all ${
                  joining || isAlreadyJoined || isOwner || isGameFull
                    ? isDarkMode ? "bg-slate-700 text-slate-300 cursor-not-allowed" : "bg-slate-200 text-slate-600 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {isAlreadyJoined
                  ? "You have already joined"
                  : isOwner
                    ? "Owner cannot join"
                    : isGameFull
                      ? "Tournament Full"
                      : joining
                        ? "Joining..."
                        : "Join Tournament"}
              </button>
            </div>

            <div className="space-y-3">
              <p className="font-semibold text-white">Ground Details</p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span className="break-words">{ground.name || "Unknown ground"} Ground</span>
              </p>
              <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                {[ground.area, ground.City?.name, ground.State?.name, ground.Country?.name, ground.city, ground.state, ground.country]
                  .filter(Boolean)
                  .join(", ") || "Location not available"}
              </p>
              {ground.locationUrl ? (
                <a
                  href={ground.locationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-block font-medium rounded-md px-3 py-1 text-sm transition-colors ${
                    isDarkMode
                      ? 'text-white bg-indigo-500/15 border border-indigo-400 hover:text-indigo-300 hover:border-indigo-300'
                      : 'text-indigo-700 bg-indigo-100 border border-indigo-300 hover:text-indigo-900 hover:border-indigo-500'
                  }`}
                >
                   Location 
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <div className={`border rounded-2xl p-6 ${
          isDarkMode
            ? 'bg-slate-900 border-slate-700'
            : 'bg-white border-slate-200'
        }`}>
          <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Tournament Slots</h2>
          {slots.length === 0 ? (
            <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>No slot details available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {slots.map((slotItem) => {
                const slot = slotItem.Slot || {};
                return (
                  <div
                    key={slotItem.id ?? slot.id}
                    className={`border rounded-lg p-4 ${
                      isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-slate-200'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <p className="flex items-center gap-2 font-medium">
                      <Clock3 className="w-4 h-4 text-indigo-400" />
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
}
