// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/common/Navbar";
// import Footer from "../components/common/Footer";


// export default function LandingPage() {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-gray-900 text-white flex flex-col">
//       {/* Navbar */}
//       <Navbar />

//       {/* Hero Section */}
//       <section className="flex flex-col items-center justify-center text-center px-6 py-20">
//         <h1 className="text-4xl md:text-5xl font-bold mb-4">
//           Book Your Game. Build Your Squad.
//         </h1>
//         <p className="text-gray-300 max-w-2xl mb-8">
//           Game Squad lets players book game slots easily and helps admins manage
//           games, grounds, and bookings — all in one platform.
//         </p>

//         <div className="flex gap-4 flex-wrap justify-center">
//           <button
//             onClick={() => navigate("/user/login")}
//             className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-semibold transition"
//           >
//             Login as Player
//           </button>

//           <button
//             onClick={() => navigate("/login")}
//             className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition"
//           >
//             Login as Admin
//           </button>
//         </div>
//       </section>

//       {/* Who is this for */}
//       <section className="px-6 py-16 bg-gray-800">
//         <h2 className="text-3xl font-bold text-center mb-10">
//           Who Is Game Squad For?
//         </h2>
//           {/* Player Card */}
//           <div className="bg-gray-900 p-6 rounded-xl shadow-md mb-8 max-w-md mx-auto">
//             <h3 className="text-xl font-semibold mb-3">👤 Players</h3>
//             <ul className="text-gray-300 space-y-2">
//               <li>• Book game slots easily</li>
//               <li>• Choose games & grounds</li>
//               <li>• Manage your bookings</li>
//             </ul>
//           </div>
//       </section>

//       {/* Games Preview */}
//       <section className="px-6 py-16">
//         <h2 className="text-3xl font-bold text-center mb-10">
//           Available Games
//         </h2>

//         <div className="flex flex-wrap justify-center gap-6">
//           {["Cricket", "Football", "Badminton", "Basketball"].map((game) => (
//             <div
//               key={game}
//               className="bg-gray-800 px-6 py-4 rounded-lg shadow-md"
//             >
//               {game}
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Call to Action */}
//       <section className="px-6 py-16 bg-indigo-600 text-center">
//         <h2 className="text-3xl font-bold mb-4">
//           Ready to Play 
//         </h2>
//         {/* or Manage Games? */}
//         <p className="mb-6">
//           Join Game Squad and make game booking effortless.
//         </p>
//         <button
//           onClick={() => navigate("/user/UserRegister")}
//           className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
//         >
//           Get Started
//         </button>
//       </section>

//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { getPublicGround } from "../services/api";
import { useRef } from "react";


const IMAGE_BASE = process.env.REACT_APP_IMAGE_URL;

export default function LandingPage() {
  const navigate = useNavigate();

  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");


  /* ---------------- FETCH GROUNDS ---------------- */
  useEffect(() => {
    const fetchGrounds = async () => {
      try {
        const res = await getPublicGround();
        setGrounds(res.data || []);
      } catch (err) {
        console.error("Failed to fetch grounds", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrounds();
  }, []);

  /* ---------------- FILTER BY DATE ---------------- */
  const filteredGrounds = grounds.filter((ground) => {
    if (!selectedDate) return true;

    return ground.slots?.some(
      (slot) => slot.date === selectedDate && slot.isAvailable !== false
    );
  });

 
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -350,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 350,
      behavior: "smooth",
    });
  };


  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* ---------------- HERO SECTION ---------------- */}

 <section className="px-6 py-12 relative">

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

      <h2 className="text-2xl font-bold text-center mb-8">
        Available Grounds
      </h2>

      {/* LEFT ARROW */}
      <button
        onClick={scrollLeft}
        className="hidden md:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 z-10 
                   bg-black/60 hover:bg-black text-white w-10 h-10 rounded-full"
      >
        ◀
      </button>

      {/* RIGHT ARROW */}
      <button
        onClick={scrollRight}
        className="hidden md:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 z-10 
                   bg-black/60 hover:bg-black text-white w-10 h-10 rounded-full"
      >
        ▶
      </button>

      {/* SCROLL CONTAINER */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-hidden scroll-smooth"
      >
        {grounds.map((ground) => (
          <div
            key={ground.id}
            className="min-w-[320px] max-w-[320px] bg-gray-800 rounded-xl 
                       shadow-md hover:scale-[1.04] transition-transform duration-300 overflow-hidden"
          >
            {/* IMAGE */}
            <div className="h-40 w-full bg-gray-700">
              <img
                src={
                  ground.images?.[0]
                    ? `${process.env.REACT_APP_IMAGE_URL}${ground.images[0].imageUrl}`
                    : "/placeholder.png"
                }
                alt={ground.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* CONTENT */}
            <div className="p-4 space-y-2 text-white">
              <h3 className="text-lg font-semibold">{ground.name}</h3>

              <p className="text-sm text-gray-400">
                {[ground.area, ground.city, ground.state, ground.country]
                  .filter(Boolean)
                  .join(", ")}
              </p>

              <div className="flex gap-2 text-sm">
                <span className="px-2 py-1 bg-indigo-600 rounded">
                  {ground.game}
                </span>
                <span className="px-2 py-1 bg-green-600 rounded">
                  ₹{ground.pricePerSlot}/Slot
                </span>
              </div>

              <p className="text-sm text-gray-400">
                ⏰ {ground.openingTime} – {ground.closingTime}
              </p>
            </div>
            {/* AMENITIES */}
              {ground.amenities?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {ground.amenities.slice(0, 5).map((amenity, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-700 text-gray-200 rounded-full"
                    >
                      {typeof amenity === "string" ? amenity : amenity.name}
                    </span>
                  ))}

                  {ground.amenities.length > 5 && (
                    <span className="px-2 py-1 text-xs bg-gray-600 text-gray-300 rounded-full mb-2">
                      +{ground.amenities.length - 5} more
                    </span>
                  )}
                </div>
              )}
          </div>
        ))}
      </div>
    </section>


      {/* ---------------- WHO IS THIS FOR ---------------- */}
      <section className="px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">
          Who Is Game Squad For?
        </h2>

        <div className="bg-gray-800 p-6 rounded-xl shadow-md max-w-md mx-auto">
          <h3 className="text-xl font-semibold mb-3">👤 Players</h3>
          <ul className="text-gray-300 space-y-2">
            <li>• Book game slots easily</li>
            <li>• Choose games & grounds</li>
            <li>• Manage your bookings</li>
          </ul>
        </div>
      </section>

      {/* ---------------- AVAILABLE GAMES ---------------- */}
      <section className="px-6 py-16 bg-gray-800">
        <h2 className="text-3xl font-bold text-center mb-10">
          Available Games
        </h2>

        <div className="flex flex-wrap justify-center gap-6">
          {["Cricket", "Football", "Badminton", "Basketball"].map((game) => (
            <div
              key={game}
              className="bg-gray-900 px-6 py-4 rounded-lg shadow-md"
            >
              {game}
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="px-6 py-16 bg-indigo-600 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Play?
        </h2>

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
