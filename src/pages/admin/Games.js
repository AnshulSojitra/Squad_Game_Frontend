import React, { useState, useEffect } from "react";
import { getGames, addGame, deleteGame } from "../../services/api";
import ConfirmModal from "../../components/utils/ConfirmModal";
import Toast from "../../components/utils/Toast";

export const Games = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newGame, setNewGame] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const res = await getGames();
      setGames(res.data);
    } catch (err) {
      showToast("error", "Failed to fetch games");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  const handleAddGame = async (e) => {
    e.preventDefault();
    if (!newGame.trim()) return;

    try {
      await addGame({ name: newGame.trim() });
      setNewGame("");
      fetchGames();
      showToast("success", "Game added successfully");
    } catch (err) {
      showToast("error", "Failed to add game");
    }
  };

  const openDeleteModal = (id) => {
    setSelectedGameId(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteGame(selectedGameId);
      setGames(games.filter(g => g.id !== selectedGameId));
      showToast("success", "Game deleted successfully");
    } catch (err) {
      showToast("error", "Failed to delete game");
    } finally {
      setShowConfirm(false);
      setSelectedGameId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setSelectedGameId(null);
  };

  const gameIcons = ["⚽", "🏀", "🎾", "🏐", "🏈", "🥍", "🏓", "🏸"];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Games Management</h1>
          <p className="text-gray-400">Manage available sports games</p>
        </div>
      </div>

      {/* Add Game Form */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Add New Game</h2>
        <form onSubmit={handleAddGame} className="flex gap-4">
          <input
            type="text"
            value={newGame}
            onChange={(e) => setNewGame(e.target.value)}
            placeholder="Enter game name (e.g., Cricket, Basketball)"
            className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span className="flex items-center gap-2">
              <span>➕</span>
              Add Game
            </span>
          </button>
        </form>
      </div>

      {/* Games Grid */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Available Games</h2>

        {games.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎮</div>
            <p className="text-gray-400 text-lg">No games available</p>
            <p className="text-gray-500 text-sm">Add your first game above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, index) => (
              <div
                key={game.id}
                className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-600"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                      {gameIcons[index % gameIcons.length]}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{game.name}</h3>
                      <p className="text-gray-400 text-sm">Game #{game.id}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => openDeleteModal(game.id)}
                    className="text-red-400 hover:text-red-300 transition-colors duration-200 p-2 hover:bg-red-500/20 rounded-lg"
                  >
                    <span className="text-lg">🗑️</span>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Added: {new Date(game.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1 text-green-400">
                    <span>●</span>
                    <span className="text-sm">Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Delete Game?"
        message="Are you sure you want to delete this game? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};
