import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, GamepadIcon } from "lucide-react";
import Loader from "../../components/utils/Loader";
import Toast from "../../components/utils/Toast";
import OpenGameList from "../../components/games/OpenGameList";
import CreateGames from "../../components/games/CreateGames";
import StickySearch from "../../components/common/StickySearch";
import Footer from "../../components/common/Footer";
import { useBoxArena } from "../../context/BoxArenaContext";
import { useTheme } from "../../context/ThemeContext";

export default function Games() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const {
    auth,
    openGames: games,
    myJoinedGames,
    loading,
    refreshOpenGames,
    refreshMyJoinedGames,
    refreshMyCreatedGames,
  } = useBoxArena();
  const [showCreateModal, setShowCreateModal] = useState(false);
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
  const getGameName = (item) => item?.name ?? "";

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
        `${getGameName(item)} ${item?.sport} ${ground?.name} ${getCity(item)} ${getState(item)} ${ground?.area}`
      );

      return (
        text.includes(query) &&
        (!city || getCity(item) === city) &&
        (!state || getState(item) === state) &&
        (!selectedGame ||
          normalize(getSport(item)) === selectedGame ||
          normalize(getGameName(item)) === selectedGame)
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
    if (!auth.isUserAuthenticated) {
      navigate("/user/login");
      return;
    }
    setShowCreateModal(true);
  };

  useEffect(() => {
    refreshOpenGames();
    if (auth.isUserAuthenticated) {
      refreshMyJoinedGames();
    }
  }, [auth.isUserAuthenticated]);

  const joinedGameIds = useMemo(
    () =>
      myJoinedGames
        .map((item) => item?.id ?? item?._id)
        .filter(Boolean)
        .map((id) => String(id)),
    [myJoinedGames]
  );

  if (loading.openGames && games.length === 0) {
    return <Loader variant="page" text="Loading tournaments..." />;
  }

  return (
    <>
    <div className={`min-h-screen px-4 sm:px-6 lg:px-8 py-6 pt-20 ${
      isDarkMode
        ? 'bg-gradient-to-br from-slate-950 to-slate-900'
        : 'bg-gradient-to-br from-white to-slate-50'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-10">
          <div>
            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 flex items-center gap-3 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              <GamepadIcon className="w-7 h-7 sm:w-9 sm:h-9 text-indigo-500" />
              Explore Tournaments
            </h1>
            <p className={`text-sm sm:text-base ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Create and manage your sports tournaments
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddGameClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all"
          >
            <Plus className="w-5 h-5" />
            Host Tournament
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
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>No matching tournaments found</h3>
            <p className={`mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Try changing search text or filters to find your sport.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-semibold"
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

      
      <CreateGames
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onGameCreated={async () => {
          await Promise.all([
            refreshOpenGames(),
            refreshMyCreatedGames(),
            refreshMyJoinedGames(),
          ]);
        }}
      />

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </div>
    <Footer />

    </>
  );
}
