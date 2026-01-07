// import { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import { getPublicGround, getPublicGroundById } from "../../services/api";


// const IMAGE_BASE = process.env.REACT_APP_IMAGE_URL;

// export default function Bookingslot() {
//   const [searchParams,setSearchParams] = useSearchParams();
//   const selectedDate = searchParams.get("date");

//   const [grounds, setGrounds] = useState([]);
//   const [selectedGround, setSelectedGround] = useState(null);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [groundDetails, setGroundDetails] = useState(null);
//   const [detailsLoading, setDetailsLoading] = useState(false);
 

//   const now = new Date();


//   console.log("selectedGround 👉", selectedGround);


//   /* ---------------- FETCH ALL GROUNDS ---------------- */
//   useEffect(() => {
//     const fetchGrounds = async () => {
//       try {
//         const res = await getPublicGround();
//         setGrounds(res.data);
//       } catch (err) {
//         console.error("Failed to load grounds", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGrounds();
//   }, []);


//   const selectedDateObj = selectedDate
//     ? new Date(selectedDate)
//     : null;

// const validSlots = Array.isArray(selectedGround?.slots)
//   ? selectedGround.slots.filter((slot) => {
//       // If no date selected, show all slots
//       if (!selectedDate) return true;

//       const today = new Date().toISOString().split("T")[0];

//       // Build datetime from date + slot startTime
//       const slotStart = new Date(
//         `${selectedDate}T${slot.startTime}`
//       );

//       // If booking for today → hide past slots
//       if (selectedDate === today) {
//         return slotStart > new Date();
//       }

//       // Future dates → show all slots
//       return true;
//     })
//   : [];





//  const handleSelectGround = async (id) => {
//   try {
//     setDetailsLoading(true);
//     const res = await getPublicGroundById(id);
//     setSelectedGround(res.data);
//   } catch (err) {
//     console.error("Failed to load ground details");
//     alert("Unable to load ground details");
//   } finally {
//     setDetailsLoading(false);
//   }
// };



//   if (loading) {
//     return <p className="text-center mt-10">Loading grounds...</p>;
//   }

//   /* ========================================================= */
//   /* ================= GROUNDS LIST VIEW ===================== */
//   /* ========================================================= */

//   if (!selectedGround) {
//     return (
//       <div className="min-h-screen bg-gray-900 px-6 py-10 ">
//         <h1 className="text-2xl font-bold mb-6 text-center text-white">
//           Select a Ground
//         </h1>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {grounds.map((ground) => (
//             <div
//                 key={ground.id}
//                 onClick={() => handleSelectGround(ground.id)}
//                 className="bg-white rounded-xl shadow-md hover:shadow-lg cursor-pointer overflow-hidden"
//               >
//               {/* IMAGE */}
//               <div className="h-40 bg-gray-200">
//                 <img
//                   src={
//                     ground.images?.[0]
//                       ? `${IMAGE_BASE}${ground.images[0].imageUrl}`
//                       : "/placeholder.png"
//                   }
//                   alt={ground.name}
//                   className="w-full h-full object-cover"
//                 />
//               </div>

//               {/* INFO */}
//               <div className="p-4 space-y-2">
//                 <h3 className="text-lg font-semibold">{ground.name}</h3>

//                 <p className="text-sm text-gray-500">
//                   {[ground.area, ground.city, ground.state, ground.country]
//                       .filter(Boolean)
//                       .join(", ")}
//                 </p>

//                 <p className="text-sm">
//                   ⏰ {ground.openingTime} – {ground.closingTime}
//                 </p>

//                 <p className="text-green-600 font-semibold">
//                   ₹{ground.pricePerSlot} / slot
//                 </p>
//                 <div>
//                   {/* AMENITIES */}
//                   {ground.amenities?.length > 0 && (
//                     <div className="flex flex-wrap gap-2 mt-2">
//                       {ground.amenities.map((amenity, index) => (
//                         <span
//                           key={index}
//                           className="px-2 py-1 text-xs bg-gray-700 text-gray-200 rounded-full"
//                         >
//                           {typeof amenity === "string" ? amenity : amenity.name}
//                         </span>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   /* ========================================================= */
//   /* ================= GROUND DETAILS VIEW =================== */
//   /* ========================================================= */

//   console.log("selectedGround:", selectedGround);


//   return (
//     <div className="min-h-screen bg-gray-100 px-6 py-10">
//       <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">

//         {/* BACK */}
//         <div className="p-4 border-b">
//         <button
//           onClick={() => {
//             setSelectedSlot(null);
//             setSelectedGround(null);
//           }}
//           className="text-indigo-600 font-medium"
//         >
//           ← Back to Grounds
//         </button>

//         </div>

//         {/* IMAGE */}
//         <div className="h-64 bg-gray-200">
//           <img
//             src={
//               selectedGround.images?.[0]
//                 ? `${IMAGE_BASE}${selectedGround.images[0].imageUrl}`
//                 : "/placeholder.png"
//             }
//             alt={selectedGround.name}
//             className="w-full h-full object-cover"
//           />
//         </div>

//         {/* INFO */}
//         <div className="p-6 space-y-3">
//           <h1 className="text-2xl font-bold">{selectedGround.name}</h1>

//           {/* GAME */}
//           {selectedGround.game && (
//             <p className="text-sm text-indigo-600 font-medium">
//               🎮 {selectedGround.game}
//             </p>
//           )}

//           {/* LOCATION */}
//           <p className="text-gray-600">
//             📍 {[selectedGround.area, selectedGround.city, selectedGround.state, selectedGround.country]
//               .filter(Boolean)
//               .join(", ")}
//           </p>

//           <p className="text-gray-600">
//             ⏰ {selectedGround.openingTime} – {selectedGround.closingTime}
//           </p>

//           <p className="text-green-600 text-lg font-semibold">
//             ₹{selectedGround.pricePerSlot} / slot
//           </p>
//           {/* AMENITIES */}
//                   {selectedGround.amenities?.length > 0 && (
//                     <div className="flex flex-wrap gap-2 mt-2">
//                       {selectedGround.amenities.map((amenity, index) => (
//                         <span
//                           key={index}
//                           className="px-2 py-1 text-xs bg-gray-700 text-gray-200 rounded-full"
//                         >
//                           {typeof amenity === "string" ? amenity : amenity.name}
//                         </span>
//                       ))}
//                     </div>
//                   )}
          
//         </div>


//       {/* DATE PICKER */}
//         <div className="p-6 border-t">
//           <label className="block mb-2 font-medium text-gray-700">
//             Select Date
//           </label>

//           <input
//             type="date"
//             min={new Date().toISOString().split("T")[0]}
//             value={selectedDate || ""}
//             onChange={(e) =>
//               setSearchParams({ date: e.target.value })
//             }
//             className="border rounded-lg px-4 py-2 w-60"
//           />
//         </div>


//       {/* AVAILABLE SLOTS */}
//       <div className="p-6 border-t">
//         <h2 className="text-xl font-semibold mb-4">Available Slots</h2>

//         {detailsLoading && (
//           <p className="text-gray-500">Loading available slots...</p>
//         )}

//         {!detailsLoading && validSlots.length === 0 && (
//           <p className="text-gray-500">No slots available</p>
//         )}

//           {validSlots.length > 0 ? (
//             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//               {validSlots.map((slot, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setSelectedSlot(slot)}
//                   className={`px-4 py-3 rounded-lg border text-sm font-medium transition
//                     ${
//                       selectedSlot === slot
//                         ? "bg-indigo-600 text-white"
//                         : "bg-white hover:bg-indigo-100"
//                     }`}
//                 >
//                   {slot.startTime} – {slot.endTime}
//                 </button>
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-500">
//               No slots available for selected date
//             </p>
//           )}

//       </div>

//         {/* CONFIRM */}
//         {selectedSlot && (
//           <div className="p-6 border-t flex justify-end">
//             <button
//               onClick={() => {
//                 console.log("BOOK SLOT", {
//                   groundId: selectedGround.id,
//                   date: selectedDate,
//                   slot: selectedSlot,
//                 });
//                 alert("Slot booked (API pending)");
//               }}
//               className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold"
//             >
//               Confirm Booking
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { getPublicGround } from "../../services/api";
import GroundDetails from "./GroundDetails";

const IMAGE_BASE = process.env.REACT_APP_IMAGE_URL;

export default function Bookingslot() {
  const [grounds, setGrounds] = useState([]);
  const [selectedGroundId, setSelectedGroundId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrounds = async () => {
      try {
        const res = await getPublicGround();
        setGrounds(res.data);
      } catch (err) {
        console.error("Failed to load grounds");
      } finally {
        setLoading(false);
      }
    };

    fetchGrounds();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading grounds...</p>;
  }

  /* ================= SHOW DETAILS ================= */
  if (selectedGroundId) {
    return (
      <GroundDetails
        groundId={selectedGroundId}
        onBack={() => setSelectedGroundId(null)}
      />
    );
  }

  /* ================= GROUNDS LIST ================= */
  return (
    <div className="min-h-screen bg-gray-900 px-6 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-white">
        Select a Ground
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {grounds.map((ground) => (
          <div
            key={ground.id}
            onClick={() => setSelectedGroundId(ground.id)}
            className="bg-white rounded-xl shadow-md hover:shadow-lg cursor-pointer overflow-hidden"
          >
            {/* IMAGE */}
            <div className="h-40 bg-gray-200">
              <img
                src={
                  ground.images?.[0]
                    ? `${IMAGE_BASE}${ground.images[0].imageUrl}`
                    : "/placeholder.png"
                }
                alt={ground.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* INFO */}
            <div className="p-4 space-y-2">
              <h3 className="text-lg font-semibold">{ground.name}</h3>

              <p className="text-sm text-gray-500">
                {[ground.area, ground.city, ground.state, ground.country]
                  .filter(Boolean)
                  .join(", ")}
              </p>

              <p className="text-sm">
                ⏰ {ground.openingTime} – {ground.closingTime}
              </p>

              <p className="text-green-600 font-semibold">
                ₹{ground.pricePerSlot} / slot
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
