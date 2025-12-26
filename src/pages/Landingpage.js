import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";


export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Book Your Game. Build Your Squad.
        </h1>
        <p className="text-gray-300 max-w-2xl mb-8">
          Game Squad lets players book game slots easily and helps admins manage
          games, grounds, and bookings — all in one platform.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={() => navigate("/user/login")}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-semibold transition"
          >
            Login as Player
          </button>

          <button
            onClick={() => navigate("/login")}
            className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition"
          >
            Login as Admin
          </button>
        </div>
      </section>

      {/* Who is this for */}
      <section className="px-6 py-16 bg-gray-800">
        <h2 className="text-3xl font-bold text-center mb-10">
          Who Is Game Squad For?
        </h2>

        {/* <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"> */}
          {/* Player Card */}
          <div className="bg-gray-900 p-6 rounded-xl shadow-md mb-8 max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-3">👤 Players</h3>
            <ul className="text-gray-300 space-y-2">
              <li>• Book game slots easily</li>
              <li>• Choose games & grounds</li>
              <li>• Manage your bookings</li>
            </ul>
          </div>

          {/* Admin Card
          <div className="bg-gray-900 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-3">🛠 Admins</h3>
            <ul className="text-gray-300 space-y-2">
              <li>• Manage games & grounds</li>
              <li>• Control time slots</li>
              <li>• View & manage bookings</li>
            </ul>
          </div> */}
        {/* </div> */}
      </section>

      {/* Games Preview */}
      <section className="px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">
          Available Games
        </h2>

        <div className="flex flex-wrap justify-center gap-6">
          {["Cricket", "Football", "Badminton", "Basketball"].map((game) => (
            <div
              key={game}
              className="bg-gray-800 px-6 py-4 rounded-lg shadow-md"
            >
              {game}
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-6 py-16 bg-indigo-600 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Play 
        </h2>
        {/* or Manage Games? */}
        <p className="mb-6">
          Join Game Squad and make game booking effortless.
        </p>
        <button
          onClick={() => navigate("/user/UserRegister")}
          className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Get Started
        </button>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
