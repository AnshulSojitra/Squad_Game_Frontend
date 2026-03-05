import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock3, MapPin, Phone, Trophy, User, Users } from "lucide-react";
import { getMyJoinedGames } from "../../services/api";
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

const extractParticipantNames = (game) => {
  const list = Array.isArray(game?.GameParticipants) ? game.GameParticipants : [];
  return list
    .map((item) => item?.User?.name ?? "")
    .map((name) => String(name).trim())
    .filter(Boolean);
};

export default function MyJoinedGameDetails() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  useEffect(() => {
    const fetchJoinedGameDetails = async () => {
      try {
        setLoading(true);
        const response = await getMyJoinedGames();
        const data = response?.data;
        const gamesArray = Array.isArray(data) ? data : Array.isArray(data?.games) ? data.games : [];
        const foundGame = gamesArray.find((item) => String(item?.id ?? item?._id) === String(gameId));

        if (!foundGame) {
          setToast({
            show: true,
            type: "error",
            message: "Joined game details not found",
          });
          return;
        }

        setGame(foundGame);
      } catch (error) {
        console.error("Failed to fetch joined game details", error);
        setToast({
          show: true,
          type: "error",
          message: "Failed to load joined game details",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJoinedGameDetails();
  }, [gameId]);

  const ground = game?.Ground || {};
  const slots = useMemo(() => (Array.isArray(game?.GameSlots) ? game.GameSlots : []), [game]);
  const participantNames = useMemo(() => extractParticipantNames(game), [game]);
  const totalPlayers = Number(game?.totalPlayers ?? 0);
  const joinedPlayers = Number(game?.joinedPlayersCount ?? 0);
  const spotsLeft = Math.max(totalPlayers - joinedPlayers, 0);

  if (loading) {
    return <Loader variant="page" text="Loading joined game details..." />;
  }

  if (!game) {
    return (
      <div className={`min-h-screen p-6 pt-20 ${
        isDarkMode
          ? 'bg-gradient-to-br from-slate-950 to-slate-900'
          : 'bg-gradient-to-br from-white to-slate-50'
      }`}>
        <div className="max-w-5xl mx-auto">
          <button
            type="button"
            onClick={() => navigate("/profile/joinedgames")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
              isDarkMode
                ? 'text-white bg-slate-800 hover:bg-slate-700'
                : 'text-slate-900 bg-slate-200 hover:bg-slate-300'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Joined Games
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
    <div className={`min-h-screen p-6 pt-20 ${
      isDarkMode
        ? 'bg-gradient-to-br from-slate-950 to-slate-900'
        : 'bg-gradient-to-br from-white to-slate-50'
    }`}>
      <div className="max-w-5xl mx-auto space-y-6">
        <button
          type="button"
          onClick={() => navigate("/profile/joinedgames")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
            isDarkMode
              ? 'text-white bg-slate-800 hover:bg-slate-700'
              : 'text-slate-900 bg-slate-200 hover:bg-slate-300'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Joined Games
        </button>

        <div className={`bg-gradient-to-br border rounded-2xl p-6 md:p-8 ${
          isDarkMode
            ? 'from-slate-900 to-slate-800 border-slate-700'
            : 'from-white to-slate-50 border-slate-200'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{game?.sport || "Game"}</h1>
            <span className="px-3 py-1 rounded-md text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              {game?.status || "Open"}
            </span>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 ${
            isDarkMode ? 'text-slate-200' : 'text-slate-700'
          }`}>
            <div className="space-y-3">
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                Date: {formatDate(game?.date)}
              </p>
              <p className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                Players: {joinedPlayers}/{totalPlayers} joined ({spotsLeft} spots left)
              </p>
              <p className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-indigo-400" />
                Teams: {game?.totalTeams ?? 0}, Players per team: {game?.playersPerTeam ?? 0}
              </p>
              <p className="text-xl font-bold text-white">Rs {game?.pricePerPlayer} / player</p>
            </div>

            <div className="space-y-3">
              <p className="font-semibold text-white">Ground Details</p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400" />
                {ground?.name || "Unknown ground"}
              </p>
              <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                {[ground?.area, ground?.City?.name, ground?.State?.name, ground?.Country?.name]
                  .filter(Boolean)
                  .join(", ") || "Location not available"}
              </p>
              {ground?.locationUrl ? (
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
          <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Creator Details</h2>
          <div className={`space-y-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
            <p className="flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" />
              {game?.Creator?.name || "Unknown creator"}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-indigo-400" />
              {game?.Creator?.phoneNumber || "Unknown number"}
            </p>
          </div>
        </div>

        <div className={`border rounded-2xl p-6 ${
          isDarkMode
            ? 'bg-slate-900 border-slate-700'
            : 'bg-white border-slate-200'
        }`}>
          <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Game Slots</h2>
          {slots.length === 0 ? (
            <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>No slot details available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {slots.map((slotItem) => {
                const slot = slotItem?.Slot || {};
                return (
                  <div
                    key={slotItem?.id ?? slot?.id}
                    className={`border rounded-lg p-4 ${
                      isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-slate-200'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <p className="flex items-center gap-2 font-medium">
                      <Clock3 className="w-4 h-4 text-indigo-400" />
                      {formatTime(slot?.startTime)} - {formatTime(slot?.endTime)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={`border rounded-2xl p-6 ${
          isDarkMode
            ? 'bg-slate-900 border-slate-700'
            : 'bg-white border-slate-200'
        }`}>
          <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Participants</h2>
          {participantNames.length === 0 ? (
            <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>No participant details available.</p>
          ) : (
            <ul className={`list-disc pl-5 space-y-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
              {participantNames.map((name, index) => (
                <li key={`participant-${index}`}>{name}</li>
              ))}
            </ul>
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
