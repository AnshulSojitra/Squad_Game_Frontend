import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Gamepad2,
  Search,
  Users,
} from "lucide-react";
import ConfirmModal from "../../components/utils/ConfirmModal";
import Pagination from "../../components/utils/Pagination";
import Loader from "../../components/utils/Loader";
import {
  deleteGameBySuperAdmin,
  getAllGamesBySuperAdmin,
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

export default function SuperAdminGames() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingGameId, setLoadingGameId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const ITEMS_PER_PAGE = 10;
  const [page, setPage] = useState(1);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const res = await getAllGamesBySuperAdmin();
      const payload = res?.data;
      const gamesArray = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.games)
          ? payload.games
          : [];
      setGames(gamesArray);
    } catch (error) {
      console.error("Failed to fetch super admin tournaments", error);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const filteredGames = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return games;

    return games.filter((game) => {
      const text = [
        game?.sport,
        game?.status,
        game?.date,
        game?.Creator?.name,
        game?.Creator?.email,
        game?.Ground?.name,
        game?.Ground?.area,
        game?.Ground?.city,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(q);
    });
  }, [games, searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredGames.length / ITEMS_PER_PAGE));
  const paginatedGames = filteredGames.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const stats = useMemo(() => {
    const total = games.length;
    const open = games.filter((g) => String(g?.status || "").toLowerCase() === "open").length;
    const full = games.filter((g) => String(g?.status || "").toLowerCase() === "full").length;
    const participants = games.reduce(
      (sum, g) => sum + Number(g?.joinedPlayersCount ?? 0),
      0
    );

    return { total, open, full, participants };
  }, [games]);

  const handleConfirmDeleteGame = async () => {
    if (!deleteTarget?.gameId) return;
    try {
      setLoadingGameId(deleteTarget.gameId);
      await deleteGameBySuperAdmin(deleteTarget.gameId);
      setGames((prev) => prev.filter((g) => g.id !== deleteTarget.gameId));
    } catch (error) {
      console.error("Failed to delete tournament", error);
      alert(error?.response?.data?.message || "Failed to delete tournament");
    } finally {
      setLoadingGameId(null);
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return <Loader variant="simple" text="Loading tournaments..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Tournaments Management</h1>
        <p className="text-gray-400">Monitor and manage all tournaments created on the platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Gamepad2 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Tournaments</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Calendar className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Open Tournaments</p>
              <p className="text-2xl font-bold text-white">{stats.open}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <Users className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Full Tournaments</p>
              <p className="text-2xl font-bold text-white">{stats.full}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Joined Players</p>
              <p className="text-2xl font-bold text-white">{stats.participants}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <h2 className="text-lg font-semibold text-white">All Tournaments</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by sport, creator, ground, status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">No</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Tournament</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Creator</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Ground</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Players</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {paginatedGames.map((game, index) => {
                const slots = Array.isArray(game.GameSlots) ? game.GameSlots : [];
                const firstSlot = slots[0]?.Slot || {};
                const timeRange = firstSlot?.startTime
                  ? `${formatTime(firstSlot.startTime)} - ${formatTime(firstSlot.endTime)}`
                  : "N/A";

                return (
                  <tr
                    key={game.id}
                    className="hover:bg-slate-700/20 cursor-pointer"
                    onClick={() => navigate(`/super-admin/games/${game.id}`)}
                  >
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {(page - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-white">{game.name || "Tournament"}</p>
                        {game.name && <p className="text-xs text-gray-300 font-medium">{game.sport}</p>}
                        <p className="text-sm text-gray-400 mt-1">
                          {formatDate(game.date)} | {timeRange}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Rs {game.pricePerPlayer} / player</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white">{game.Creator?.name || "N/A"}</p>
                        <p className="text-sm text-gray-400">{game.Creator?.email || "N/A"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white">{game.Ground?.name || "N/A"}</p>
                        <p className="text-sm text-gray-400">
                          {[
                            game.Ground?.area,
                            game.Ground?.City?.name,
                            game.Ground?.State?.name,
                            game.Ground?.Country?.name,
                          ]
                            .filter(Boolean)
                            .join(", ") || "N/A"}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <p className="text-white">
                          {game.joinedPlayersCount}/{game.totalPlayers}
                        </p>
                        <p className="text-gray-400">
                          Teams: {game.totalTeams}, Players/team: {game.playersPerTeam}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            String(game.status).toLowerCase() === "full"
                              ? "bg-red-500/20 text-red-300 border border-red-500/30"
                              : "bg-green-500/20 text-green-300 border border-green-500/30"
                          }`}
                        >
                          {game.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/super-admin/games/${game.id}`);
                            }}
                            className="px-3 py-1.5 text-xs font-medium text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20"
                          >
                            View Details
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTarget({ gameId: game.id, sport: game.sport });
                            }}
                            disabled={loadingGameId === game.id}
                            className="px-3 py-1.5 text-xs font-medium text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 disabled:opacity-60"
                          >
                            {loadingGameId === game.id ? "Deleting..." : "Delete Tournament"}
                          </button>
                        </div>
                      </td>
                    </tr>
                );
              })}

              {paginatedGames.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    {searchTerm ? "No tournaments found matching your search." : "No tournaments found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {paginatedGames.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-700 bg-slate-800/30">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Tournament"
        message={`Are you sure you want to delete ${deleteTarget?.sport || "this tournament"}?`}
        onConfirm={handleConfirmDeleteGame}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
