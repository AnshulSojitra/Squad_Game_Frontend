// import { Calendar, MapPin, Users, Clock3 } from "lucide-react";

// const formatDate = (date) => {
//   if (!date) return "N/A";
//   const d = new Date(date);
//   if (Number.isNaN(d.getTime())) return String(date);
//   return d.toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const formatTime = (time) => {
//   if (!time) return "";
//   const [h = "0", m = "00"] = String(time).split(":");
//   const hour = Number(h);
//   return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
// };

// export default function OpenGamesList({ games = [] }) {
//   if (!games.length) {
//     return null;
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {games.map((game) => {
//         const totalPlayers = Number(game.totalPlayers ?? 0);
//         const joinedPlayers = Number(game.joinedPlayersCount ?? 0);
//         const spotsLeft = Math.max(totalPlayers - joinedPlayers, 0);
//         const ground = game.Ground || {};
//         const slots = Array.isArray(game.GameSlots) ? game.GameSlots : [];
//         const slotLabel =
//           slots.length > 0
//             ? slots
//                 .map((item) => {
//                   const slot = item.Slot || {};
//                   return `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`;
//                 })
//                 .join(", ")
//             : "Slots not available";

//         return (
//           <div
//             key={game.id ?? game._id ?? `${game.sport}-${game.date}`}
//             className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 hover:border-indigo-500 transition-all"
//           >
//             <div className="flex items-center justify-between mb-3">
//               <h3 className="text-xl font-bold text-white">{game.sport || "Game"}</h3>
//               <span className="px-2 py-1 rounded-md text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
//                 {game.status || "Open"}
//               </span>
//             </div>

//             <div className="space-y-2 text-sm text-slate-300">
//               <p className="flex items-center gap-2">
//                 <Calendar className="w-4 h-4 text-indigo-400" />
//                 {formatDate(game.date)}
//               </p>
//               <p className="flex items-center gap-2">
//                 <MapPin className="w-4 h-4 text-indigo-400" />
//                 {ground.name || "Unknown ground"}
//               </p>
//               <p className="flex items-center gap-2">
//                 <Users className="w-4 h-4 text-indigo-400" />
//                 {joinedPlayers}/{totalPlayers} joined ({spotsLeft} spots left)
//               </p>
//               <p className="flex items-start gap-2">
//                 <Clock3 className="w-4 h-4 text-indigo-400 mt-0.5" />
//                 <span>{slotLabel}</span>
//               </p>
//             </div>

//             <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
//               <p className="text-slate-200 font-semibold">Rs {game.pricePerPlayer} / player</p>
//               <button
//                 type="button"
//                 className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all text-sm"
//               >
//                 Join
//               </button>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }
