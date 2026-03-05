import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, GamepadIcon } from "lucide-react";
import { getMyJoinedGames, getOpenGames } from "../../services/api";
import Loader from "../../components/utils/Loader";
import Toast from "../../components/utils/Toast";
import OpenGameList from "../../components/games/OpenGameList";
import CreateGames from "../../components/games/CreateGames";
import StickySearch from "../../components/common/StickySearch";
import Footer from "../../components/common/Footer";
import { useTheme } from "../../context/ThemeContext";

export default function Games() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [joinedGameIds, setJoinedGameIds] = useState([]);
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [game, setGame] = useState("");
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const normalize = (value) => String(value ?? "").trim().toLowerCase();
  const getGround = (item) => item?.Ground || {};
  const getCity = (item) => getGround(item)?.City?.name ?? getGround(item)?.city ?? "";
  const getState = (item) => getGround(item)?.State?.name ?? getGround(item)?.state ?? "";
  const getSport = (item) => item?.sport ?? "";

  const cities = useMemo(
    () => [...new Set(games.map((item) => getCity(item)).filter(Boolean))],
    [games]
  );
  const states = useMemo(
    () => [...new Set(games.map((item) => getState(item)).filter(Boolean))],
    [games]
  );
  const gameOptions = useMemo(
    () => [...new Set(games.map((item) => getSport(item)).filter(Boolean))],
    [games]
  );

  const filteredGames = useMemo(() => {
    const query = normalize(search);
    const selectedGame = normalize(game);

    return games.filter((item) => {
      const ground = getGround(item);
      const text = normalize(
        `${item?.sport} ${ground?.name} ${getCity(item)} ${getState(item)} ${ground?.area}`
      );

      return (
        text.includes(query) &&
        (!city || getCity(item) === city) &&
        (!state || getState(item) === state) &&
        (!selectedGame || normalize(getSport(item)) === selectedGame)
      );
    });
  }, [games, search, city, state, game]);

  const clearFilters = () => {
    setSearch("");
    setCity("");
    setState("");
    setGame("");
  };

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
      const token = localStorage.getItem("userToken");
      const [openGamesResponse, joinedGamesResponse] = await Promise.all([
        getOpenGames(),
        token ? getMyJoinedGames() : Promise.resolve(null),
      ]);

      const data = openGamesResponse?.data;
      const gamesArray = Array.isArray(data)
        ? data
        : Array.isArray(data?.games)
          ? data.games
          : [];
      setGames(gamesArray);

      if (joinedGamesResponse) {
        const joinedData = joinedGamesResponse?.data;
        const joinedArray = Array.isArray(joinedData)
          ? joinedData
          : Array.isArray(joinedData?.games)
            ? joinedData.games
            : [];
        const ids = joinedArray
          .map((item) => item?.id ?? item?._id)
          .filter(Boolean)
          .map((id) => String(id));
        setJoinedGameIds(ids);
      } else {
        setJoinedGameIds([]);
      }
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
    <div className={`min-h-screen p-6 pt-20 ${
      isDarkMode
        ? 'bg-gradient-to-br from-slate-950 to-slate-900'
        : 'bg-gradient-to-br from-white to-slate-50'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className={`text-4xl font-bold mb-2 flex items-center gap-3 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              <GamepadIcon className="w-10 h-10 text-indigo-500" />
              Games
            </h1>
            <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Create and manage your sports games</p>
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

        <div className="mb-8">
          <StickySearch
            search={search}
            setSearch={setSearch}
            state={state}
            setState={setState}
            city={city}
            setCity={setCity}
            game={game}
            setGame={setGame}
            cities={cities}
            games={gameOptions}
            states={states}
            onClear={clearFilters}
            overlay={false}
          />
        </div>

        {games.length > 0 && filteredGames.length === 0 ? (
          <div className={`text-center py-16 border rounded-2xl ${
            isDarkMode
              ? 'text-slate-300 border-slate-800 bg-slate-900/40'
              : 'text-slate-600 border-slate-200 bg-slate-50/40'
          }`}>
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>No matching games found</h3>
            <p className={`mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Try changing search text or filters to find your game.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <OpenGameList
            games={filteredGames}
            onCreateGame={handleAddGameClick}
            joinedGameIds={joinedGameIds}
          />
        )}
      </div>

      <Footer />

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
