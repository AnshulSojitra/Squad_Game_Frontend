import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

export default function Home() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const games = [
    { name: "Cricket", route: "/user/games" },
    { name: "Football", route: "/user/games" },
    { name: "Badminton", route: "/user/games" },
    { name: "Basketball", route: "/user/games" },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-white via-blue-50/30 to-slate-100 text-gray-900'} px-6 py-8`}>
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-3xl font-bold mb-2">
          Welcome to Game Squad 👋
        </h1>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Book game slots, join squads, and play your favorite games.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 mb-12">
        <div
          onClick={() => navigate("/user/games")}
          className={`${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-white hover:bg-blue-50 text-gray-900 border border-gray-200'} p-6 rounded-xl cursor-pointer transition duration-300 shadow-md hover:shadow-lg`}
        >
          <h3 className="text-xl font-semibold mb-2">🎮 View Games</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Explore available games and book slots.
          </p>
        </div>

        <div
          onClick={() => navigate("/user/mybooking")}
          className={`${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-white hover:bg-blue-50 text-gray-900 border border-gray-200'} p-6 rounded-xl cursor-pointer transition duration-300 shadow-md hover:shadow-lg`}
        >
          <h3 className="text-xl font-semibold mb-2">📅 My Bookings</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Check your upcoming and past bookings.
          </p>
        </div>

        <div
          onClick={() => {
            localStorage.removeItem("userToken");
            navigate("/");
          }}
          className={`${isDarkMode ? 'bg-gray-800 hover:bg-red-600 text-white' : 'bg-white hover:bg-red-50 text-gray-900 border border-gray-200'} p-6 rounded-xl cursor-pointer transition duration-300 shadow-md hover:shadow-lg`}
        >
          <h3 className="text-xl font-semibold mb-2">🚪 Logout</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Sign out from your account.
          </p>
        </div>
      </div>

      {/* Available Games */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">
          Available Games
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {games.map((game) => (
            <div
              key={game.name}
              onClick={() => navigate(game.route)}
              className={`${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-white hover:bg-blue-50 text-gray-900 border border-gray-200'} p-6 rounded-xl text-center cursor-pointer transition duration-300 shadow-md hover:shadow-lg`}
            >
              <h3 className="text-lg font-semibold">{game.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
