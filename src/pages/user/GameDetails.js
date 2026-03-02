import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Calendar, Clock3, MapPin, Users, ArrowLeft } from "lucide-react";
import { getOpenGames, getUserProfile, joinGameApi } from "../../services/api";
import Loader from "../../components/utils/Loader";
import Toast from "../../components/utils/Toast";

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

  const [game, setGame] = useState(location.state?.game || null);
  const [loading, setLoading] = useState(!location.state?.game);
  const [joining, setJoining] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
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
          message: "Game not found",
        });
        return;
      }

      setGame(found);
    } catch (error) {
      console.error("Failed to load game details", error);
      setToast({
        show: true,
        type: "error",
        message: "Failed to load game details",
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

  const ground = game?.Ground || {};
  const slots = useMemo(
    () => (Array.isArray(game?.GameSlots) ? game.GameSlots : []),
    [game]
  );

  const totalPlayers = Number(game?.totalPlayers ?? 0);
  const joinedPlayers = Number(game?.joinedPlayersCount ?? 0);
  const spotsLeft = Math.max(totalPlayers - joinedPlayers, 0);
  const gameOwnerId = game?.createdBy ?? game?.createdById ?? game?.ownerId ?? game?.UserId ?? null;
  const isOwner = currentUserId != null && String(currentUserId) === String(gameOwnerId);
  const isGameFull = spotsLeft <= 0;

  const handleJoinGame = async () => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      setToast({
        show: true,
        type: "error",
        message: "Please login to join this game",
      });
      navigate("/user/login");
      return;
    }

    if (isOwner) {
      setToast({
        show: true,
        type: "error",
        message: "You cannot join your own game",
      });
      return;
    }

    if (isGameFull) {
      setToast({
        show: true,
        type: "error",
        message: "This game is already full",
      });
      return;
    }

    try {
      setJoining(true);
      await joinGameApi(game.id ?? game._id ?? gameId);
      setToast({
        show: true,
        type: "success",
        message: "Joined game successfully",
      });
      await fetchGameById();
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to join game";
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
    return <Loader variant="page" text="Loading game details..." />;
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6 mt-8">
        <div className="max-w-5xl mx-auto">
          <button
            type="button"
            onClick={() => navigate("/games")}
            className="inline-flex items-center gap-2 text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Games
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6 pt-20">
      <div className="max-w-5xl mx-auto space-y-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <h1 className="text-3xl font-bold text-white">{game.sport}</h1>
            <span className="px-3 py-1 rounded-md text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              {game.status || "Open"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-slate-200">
            <div className="space-y-3">
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                Date: {formatDate(game.date)}
              </p>
              <p className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                Players: {joinedPlayers}/{totalPlayers} joined ({spotsLeft} spots left)
              </p>
              <p className="text-xl font-bold text-white">Rs {game.pricePerPlayer} / player</p>
              <button
                type="button"
                onClick={handleJoinGame}
                disabled={joining || isOwner || isGameFull}
                className={`mt-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  joining || isOwner || isGameFull
                    ? "bg-slate-700 text-slate-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {isOwner ? "Owner cannot join" : isGameFull ? "Game Full" : joining ? "Joining..." : "Join Game"}
              </button>
            </div>

            <div className="space-y-3">
              <p className="font-semibold text-white">Ground Details</p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400" />
                {ground.name || "Unknown ground"} Ground
              </p>
              <p className="text-slate-300">
                {[ground.area, ground.City?.name, ground.State?.name, ground.Country?.name, ground.city, ground.state, ground.country]
                  .filter(Boolean)
                  .join(", ") || "Location not available"}
              </p>
              {ground.locationUrl ? (
                <a
                  href={ground.locationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className=" bg-indigo-500/15 inline-block text-white font-medium hover:text-indigo-300 border border-indigo-400 hover:border-indigo-300 rounded-md px-3 py-1 text-sm transition-colors"
                >
                   Location 
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Game Slots</h2>
          {slots.length === 0 ? (
            <p className="text-slate-400">No slot details available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {slots.map((slotItem) => {
                const slot = slotItem.Slot || {};
                return (
                  <div
                    key={slotItem.id ?? slot.id}
                    className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-200"
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
