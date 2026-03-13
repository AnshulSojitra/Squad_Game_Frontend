import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Gamepad2, Search, Users } from "lucide-react";
import ConfirmModal from "../../components/utils/ConfirmModal";
import Pagination from "../../components/utils/Pagination";
import Loader from "../../components/utils/Loader";
import { deleteGameBySuperAdmin } from "../../services/api";
import { useBoxArena } from "../../context/AppDataContext";

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

const getStatusConfig = (status) => {
  const normalizedStatus = String(status || "").toLowerCase();

  if (normalizedStatus === "full") {
    return {
      label: "Full",
      badgeClass: "bg-red-500/20 text-red-300 border border-red-500/30",
    };
  }

  if (normalizedStatus === "completed") {
    return {
      label: "Completed",
      badgeClass: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
    };
  }

  return {
    label: status || "Open",
    badgeClass: "bg-green-500/20 text-green-300 border border-green-500/30",
  };
};

export default function SuperAdminGames() {
  const navigate = useNavigate();
  const {
    superAdminGames: games,
    loading,
    refreshSuperAdminGames,
    setSuperAdminGames,
  } = useBoxArena();
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingGameId, setLoadingGameId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const ITEMS_PER_PAGE = 10;
  const [page, setPage] = useState(1);

  const gamesList = useMemo(() => {
    if (Array.isArray(games)) return games;
    if (Array.isArray(games?.games)) return games.games;
    if (Array.isArray(games?.data)) return games.data;
    return [];
  }, [games]);

  useEffect(() => {
    refreshSuperAdminGames();
  }, []);

  const filteredGames = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return gamesList;

    return gamesList.filter((game) => {
      const text = [
        game?.sport,
        game?.status,
        game?.date,
        game?.name,
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
  }, [gamesList, searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filteredGames.length / ITEMS_PER_PAGE));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [filteredGames.length, page]);

  const totalPages = Math.max(1, Math.ceil(filteredGames.length / ITEMS_PER_PAGE));
  const paginatedGames = filteredGames.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const stats = useMemo(() => {
    const total = gamesList.length;
    const open = gamesList.filter(
      (g) => String(g?.status || "").toLowerCase() === "open"
    ).length;
    const full = gamesList.filter(
      (g) => String(g?.status || "").toLowerCase() === "full"
    ).length;
    const participants = gamesList.reduce(
      (sum, g) => sum + Number(g?.joinedPlayersCount ?? 0),
      0
    );
    return { total, open, full, participants };
  }, [gamesList]);

  const handleConfirmDeleteGame = async () => {
    if (!deleteTarget?.gameId) return;

    try {
      setLoadingGameId(deleteTarget.gameId);
      await deleteGameBySuperAdmin(deleteTarget.gameId);
      setSuperAdminGames((prev) => {
        if (Array.isArray(prev)) {
          return prev.filter((g) => g.id !== deleteTarget.gameId);
        }

        if (Array.isArray(prev?.games)) {
          return {
            ...prev,
            games: prev.games.filter((g) => g.id !== deleteTarget.gameId),
          };
        }

        if (Array.isArray(prev?.data)) {
          return {
            ...prev,
            data: prev.data.filter((g) => g.id !== deleteTarget.gameId),
          };
        }

        return prev;
      });
    } catch (error) {
      console.error("Failed to delete tournament", error);
      alert(error?.response?.data?.message || "Failed to delete tournament");
    } finally {
      setLoadingGameId(null);
      setDeleteTarget(null);
    }
  };

  if (loading.superAdminGames) {
    return <Loader variant="simple" text="Loading tournaments..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-white">
          Tournaments Management
        </h1>
        <p className="text-gray-400">
          Monitor and manage all tournaments created on the platform
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-500/20 p-3">
              <Gamepad2 className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Tournaments</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-600/10 p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-green-500/20 p-3">
              <Calendar className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Open Tournaments</p>
              <p className="text-2xl font-bold text-white">{stats.open}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-red-500/20 bg-gradient-to-br from-red-500/10 to-red-600/10 p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-red-500/20 p-3">
              <Users className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Full Tournaments</p>
              <p className="text-2xl font-bold text-white">{stats.full}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-600/10 p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-purple-500/20 p-3">
              <Users className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Joined Players</p>
              <p className="text-2xl font-bold text-white">{stats.participants}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800/50">
        <div className="flex flex-col gap-3 border-b border-slate-700 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
          <h2 className="text-lg font-semibold text-white">All Tournaments</h2>
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by sport, creator, ground, status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full min-w-0 rounded-lg border border-slate-600 bg-slate-700 py-2 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-80"
            />
          </div>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-300">
                  No
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-300">
                  Tournament
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-300">
                  Creator
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-300">
                  Ground
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-300">
                  Players
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-300">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {paginatedGames.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <Gamepad2 className="mx-auto mb-3 h-10 w-10 text-gray-500" />
                    <p className="text-gray-300">No tournaments found</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Try changing the search term.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedGames.map((game, index) => {
                  const slots = Array.isArray(game.GameSlots) ? game.GameSlots : [];
                  const firstSlot = slots[0]?.Slot || {};
                  const timeRange = firstSlot?.startTime
                    ? `${formatTime(firstSlot.startTime)} - ${formatTime(
                        firstSlot.endTime
                      )}`
                    : "N/A";
                  const statusConfig = getStatusConfig(game.status);

                  return (
                    <tr
                      key={game.id}
                      className="cursor-pointer hover:bg-slate-700/20"
                      onClick={() => navigate(`/super-admin/games/${game.id}`)}
                    >
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {(page - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-white">
                          {game.name || "Game"}
                        </p>
                        <p className="text-xs font-medium text-gray-300">
                          {game.sport}
                        </p>
                        <p className="mt-1 text-sm text-gray-400">
                          {formatDate(game.date)} | {timeRange}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white">{game.Creator?.name || "N/A"}</p>
                        <p className="text-sm text-gray-400">
                          {game.Creator?.email || "N/A"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white">{game.Ground?.name || "N/A"}</p>
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
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.badgeClass}`}
                        >
                          {statusConfig.label}
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
                            className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-300 hover:bg-blue-500/20"
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
                            className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/20 disabled:opacity-60"
                          >
                            {loadingGameId === game.id
                              ? "Deleting..."
                              : "Delete Tournament"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-slate-700 md:hidden">
          {paginatedGames.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Gamepad2 className="mx-auto mb-3 h-10 w-10 text-gray-500" />
              <p className="text-gray-300">No tournaments found</p>
              <p className="mt-1 text-sm text-gray-500">
                Try changing the search term.
              </p>
            </div>
          ) : (
            paginatedGames.map((game, index) => {
              const slots = Array.isArray(game.GameSlots) ? game.GameSlots : [];
              const firstSlot = slots[0]?.Slot || {};
              const timeRange = firstSlot?.startTime
                ? `${formatTime(firstSlot.startTime)} - ${formatTime(
                    firstSlot.endTime
                  )}`
                : "N/A";
              const statusConfig = getStatusConfig(game.status);
              const itemNumber = (page - 1) * ITEMS_PER_PAGE + index + 1;
              const creatorInitials = (game.Creator?.name || game.name || "G")
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0]?.toUpperCase())
                .join("");

              return (
                <div
                  key={game.id}
                  className="space-y-4 px-4 py-5"
                  onClick={() => navigate(`/super-admin/games/${game.id}`)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-sm font-semibold text-cyan-300">
                        {creatorInitials || "G"}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-white">
                          {game.name || "Game"}
                        </p>
                        <p className="truncate text-sm text-gray-400">
                          {game.sport || "Tournament"}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-sm text-gray-500">
                      #{itemNumber}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm text-gray-300">
                    <p>{formatDate(game.date)}</p>
                    <p>{timeRange}</p>
                    <p className="text-white">{game.Ground?.name || "N/A"}</p>
                    <p className="break-all text-xs text-gray-500">
                      By {game.Creator?.name || "N/A"}
                      {game.Creator?.email ? ` | ${game.Creator.email}` : ""}
                    </p>
                  </div>

                  <div className="space-y-1 rounded-xl border border-slate-700 bg-slate-900/30 px-3 py-3 text-sm">
                    <p className="text-white">
                      {game.joinedPlayersCount}/{game.totalPlayers} players
                    </p>
                    <p className="text-gray-400">
                      Teams: {game.totalTeams || 0}, Players/team:{" "}
                      {game.playersPerTeam || 0}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusConfig.badgeClass}`}
                    >
                      {statusConfig.label}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/super-admin/games/${game.id}`);
                        }}
                        className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-xs font-medium text-blue-300 hover:bg-blue-500/20"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget({ gameId: game.id, sport: game.sport });
                        }}
                        disabled={loadingGameId === game.id}
                        className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300 hover:bg-red-500/20 disabled:opacity-60"
                      >
                        {loadingGameId === game.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {paginatedGames.length > 0 && (
          <div className="border-t border-slate-700 bg-slate-800/30 px-6 py-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Tournament"
        message={`Are you sure you want to delete ${
          deleteTarget?.sport || "this tournament"
        }?`}
        onConfirm={handleConfirmDeleteGame}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
