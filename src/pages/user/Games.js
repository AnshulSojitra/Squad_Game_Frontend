import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, GamepadIcon } from "lucide-react";
import { getOpenGames } from "../../services/api";
import Loader from "../../components/utils/Loader";
import Toast from "../../components/utils/Toast";
import OpenGameList from "../../components/games/OpenGameList";
import CreateGames from "../../components/games/CreateGames";

export default function Games() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const handleAddGameClick = () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/user/login");
      return;
    }
    setShowCreateModal(true);
  };

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await getOpenGames();
      const data = response?.data;
      const gamesArray = Array.isArray(data) ? data : Array.isArray(data?.games) ? data.games : [];
      setGames(gamesArray);
    } catch (error) {
      console.error("Failed to fetch games", error);
      setToast({
        show: true,
        type: "error",
        message: "Failed to load games",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  if (loading && games.length === 0) {
    return <Loader variant="page" text="Loading games..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6 pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <GamepadIcon className="w-10 h-10 text-indigo-500" />
              Games
            </h1>
            <p className="text-slate-400">Create and manage your sports games</p>
          </div>

          <button
            type="button"
            onClick={handleAddGameClick}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add Game
          </button>
        </div>

        <OpenGameList games={games} onCreateGame={handleAddGameClick} />
      </div>

      <CreateGames
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onGameCreated={fetchGames}
      />

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
}
