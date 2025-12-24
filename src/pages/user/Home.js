import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const games = [
    { name: "Cricket", route: "/user/games" },
    { name: "Football", route: "/user/games" },
    { name: "Badminton", route: "/user/games" },
    { name: "Basketball", route: "/user/games" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-3xl font-bold mb-2">
          Welcome to Game Squad 👋
        </h1>
        <p className="text-gray-400">
          Book game slots, join squads, and play your favorite games.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 mb-12">
        <div
          onClick={() => navigate("/user/games")}
          className="bg-gray-800 p-6 rounded-xl cursor-pointer hover:bg-gray-700 transition"
        >
          <h3 className="text-xl font-semibold mb-2">🎮 View Games</h3>
          <p className="text-gray-400 text-sm">
            Explore available games and book slots.
          </p>
        </div>

        <div
          onClick={() => navigate("/user/mybooking")}
          className="bg-gray-800 p-6 rounded-xl cursor-pointer hover:bg-gray-700 transition"
        >
          <h3 className="text-xl font-semibold mb-2">📅 My Bookings</h3>
          <p className="text-gray-400 text-sm">
            Check your upcoming and past bookings.
          </p>
        </div>

        <div
          onClick={() => {
            localStorage.removeItem("userToken");
            navigate("/user/login");
          }}
          className="bg-gray-800 p-6 rounded-xl cursor-pointer hover:bg-red-600 transition"
        >
          <h3 className="text-xl font-semibold mb-2">🚪 Logout</h3>
          <p className="text-gray-400 text-sm">
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
              className="bg-gray-800 p-6 rounded-xl text-center cursor-pointer hover:bg-gray-700 transition"
            >
              <h3 className="text-lg font-semibold">{game.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
