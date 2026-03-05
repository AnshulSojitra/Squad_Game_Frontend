import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  UserMinus,
  Users,
} from "lucide-react";
import Loader from "../../components/utils/Loader";
import ConfirmModal from "../../components/utils/ConfirmModal";
import {
  getAllGamesBySuperAdmin,
  removeParticipantFromGameBySuperAdmin,
} from "../../services/api";

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

const getGamesArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.games)) return payload.games;
  return [];
};

export default function SuperAdminGameDetails() {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingParticipantKey, setLoadingParticipantKey] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);

  const fetchGameDetails = async () => {
    try {
      setLoading(true);
      const res = await getAllGamesBySuperAdmin();
      const games = getGamesArray(res?.data);
      const found = games.find((g) => String(g?.id) === String(gameId)) || null;
      setGame(found);
    } catch (error) {
      console.error("Failed to fetch game details", error);
      setGame(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameDetails();
  }, [gameId]);

  const participants = useMemo(
    () => (Array.isArray(game?.GameParticipants) ? game.GameParticipants : []),
    [game]
  );

  const teams = useMemo(() => {
    return participants.reduce((acc, participant) => {
      const teamNumber = participant?.GameTeam?.teamNumber;
      const key =
        teamNumber === null || teamNumber === undefined
          ? "Unassigned"
          : `Team ${teamNumber}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(participant);
      return acc;
    }, {});
  }, [participants]);

  const handleConfirmRemoveParticipant = async () => {
    if (!removeTarget?.userId || !game?.id) return;

    const requestKey = `${game.id}-${removeTarget.userId}`;
    try {
      setLoadingParticipantKey(requestKey);
      await removeParticipantFromGameBySuperAdmin(game.id, removeTarget.userId);

      setGame((prev) => {
        if (!prev) return prev;

        const currentParticipants = Array.isArray(prev.GameParticipants)
          ? prev.GameParticipants
          : [];
        const updatedParticipants = currentParticipants.filter(
          (p) => String(p?.userId ?? p?.User?.id) !== String(removeTarget.userId)
        );
        const updatedJoinedCount = Math.max(
          Number(prev.joinedPlayersCount ?? 0) - 1,
          0
        );

        return {
          ...prev,
          GameParticipants: updatedParticipants,
          joinedPlayersCount: updatedJoinedCount,
          status:
            updatedJoinedCount < Number(prev.totalPlayers ?? 0) &&
            String(prev.status).toLowerCase() === "full"
              ? "open"
              : prev.status,
        };
      });
    } catch (error) {
      console.error("Failed to remove participant", error);
      alert(error?.response?.data?.message || "Failed to remove participant");
    } finally {
      setLoadingParticipantKey(null);
      setRemoveTarget(null);
    }
  };

  if (loading) {
    return <Loader variant="simple" text="Loading game details..." />;
  }

  if (!game) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => navigate("/super-admin/games")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Games
        </button>
        <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-8 text-center">
          <p className="text-white font-medium">Game not found.</p>
          <p className="text-sm text-gray-400 mt-2">
            It may have been deleted or the URL is incorrect.
          </p>
        </div>
      </div>
    );
  }

  const firstSlot = Array.isArray(game.GameSlots) ? game.GameSlots[0]?.Slot : null;
  const timeRange = firstSlot?.startTime
    ? `${formatTime(firstSlot.startTime)} - ${formatTime(firstSlot.endTime)}`
    : "N/A";
  const locationText =
    [
      game?.Ground?.area,
      game?.Ground?.City?.name,
      game?.Ground?.State?.name,
      game?.Ground?.Country?.name,
    ]
      .filter(Boolean)
      .join(", ") || "N/A";

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate("/super-admin/games")}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Games
      </button>

      <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {game.sport || "Game"} Details
            </h1>
            <p className="text-sm text-gray-400 mt-1">Game ID: {game.id}</p>
          </div>
          <span
            className={`inline-flex w-fit px-3 py-1 rounded-full text-xs font-semibold ${
              String(game.status).toLowerCase() === "full"
                ? "bg-red-500/20 text-red-300 border border-red-500/30"
                : "bg-green-500/20 text-green-300 border border-green-500/30"
            }`}
          >
            {game.status}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="rounded-lg border border-slate-700 bg-slate-900/30 p-4">
            <p className="text-xs text-gray-400">Date</p>
            <p className="text-white mt-1 inline-flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              {formatDate(game.date)}
            </p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-900/30 p-4">
            <p className="text-xs text-gray-400">Time</p>
            <p className="text-white mt-1 inline-flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              {timeRange}
            </p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-900/30 p-4">
            <p className="text-xs text-gray-400">Players</p>
            <p className="text-white mt-1 inline-flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              {game.joinedPlayersCount}/{game.totalPlayers}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Teams: {game.totalTeams} | Players/team: {game.playersPerTeam}
            </p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-900/30 p-4">
            <p className="text-xs text-gray-400">Price</p>
            <p className="text-white mt-1">Rs {game.pricePerPlayer} / player</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-slate-700 bg-slate-900/30 p-4">
            <p className="text-xs text-gray-400">Creator</p>
            <p className="text-white mt-1">{game?.Creator?.name || "N/A"}</p>
            <p className="text-sm text-gray-400">{game?.Creator?.email || "N/A"}</p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-900/30 p-4">
            <p className="text-xs text-gray-400">Ground</p>
            <p className="text-white mt-1">{game?.Ground?.name || "N/A"}</p>
            <p className="text-sm text-gray-400 inline-flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 text-blue-400" />
              <span>{locationText}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
        <h2 className="text-xl font-semibold text-white">Teams and Participants</h2>
        <p className="text-sm text-gray-400 mt-1">
          Remove participants directly from their team list.
        </p>

        {participants.length === 0 ? (
          <div className="mt-4 rounded-lg border border-slate-700 bg-slate-900/30 p-4">
            <p className="text-sm text-gray-400">No participants found for this game.</p>
          </div>
        ) : (
          <div className="mt-5 space-y-5">
            {Object.entries(teams).map(([teamLabel, teamParticipants]) => (
              <div
                key={teamLabel}
                className="rounded-lg border border-slate-700 bg-slate-900/30 p-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-white">{teamLabel}</h3>
                  <p className="text-xs text-gray-400">
                    {teamParticipants.length} participant
                    {teamParticipants.length === 1 ? "" : "s"}
                  </p>
                </div>

                <div className="mt-3 space-y-2">
                  {teamParticipants.map((participant) => {
                    const participantUserId =
                      participant?.userId ?? participant?.User?.id;
                    const requestKey = `${game.id}-${participantUserId}`;

                    return (
                      <div
                        key={participant.id ?? requestKey}
                        className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3"
                      >
                        <div>
                          <p className="text-white text-sm font-medium">
                            {participant?.User?.name || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-400">
                            Phone: {participant?.User?.phoneNumber || "N/A"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setRemoveTarget({
                              userId: participantUserId,
                              participantName:
                                participant?.User?.name || "Participant",
                            })
                          }
                          disabled={loadingParticipantKey === requestKey}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg hover:bg-rose-500/20 disabled:opacity-60"
                        >
                          <UserMinus className="w-3.5 h-3.5" />
                          {loadingParticipantKey === requestKey
                            ? "Removing..."
                            : "Remove"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(removeTarget)}
        title="Remove Participant"
        message={`Remove ${removeTarget?.participantName || "this participant"} from this game?`}
        onConfirm={handleConfirmRemoveParticipant}
        onCancel={() => setRemoveTarget(null)}
      />
    </div>
  );
}
