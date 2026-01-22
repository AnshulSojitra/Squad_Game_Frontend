// import { useEffect, useState } from "react";
// import { useSearchParams , useNavigate , useLocation , useParams } from "react-router-dom";
// import { getPublicGroundById , confirmBooking } from "../../services/api";
// import Toast from "../../components/common/Toast";

// const IMAGE_BASE = process.env.REACT_APP_IMAGE_URL;

// export default function GroundDetails({ groundId: propGroundId }) {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const selectedDate = searchParams.get("date");
//   const { groundId: paramGroundId } = useParams();

//    // 🔑 Decide source of truth
//   const groundId = propGroundId || paramGroundId;


//   const [ground, setGround] = useState(null);
// //   const [selectedSlot, setSelectedSlot] = useState([]);
//   const [selectedSlots, setSelectedSlots] = useState([]);

//   const [loading, setLoading] = useState(true);

//   const token = localStorage.getItem("userToken");
//   const navigate = useNavigate();
//   const location = useLocation();
//   const userToken = localStorage.getItem("userToken");
//   const [toast, setToast] = useState({
//   show: false,
//   type: "success",
//   message: "",
// });

//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

// const images = ground?.images || [];

// const showToast = (type, message) => {
//   setToast({ show: true, type, message });
// };


// const handlePrevImage = () => {
//   setCurrentImageIndex((prev) =>
//     prev === 0 ? images.length - 1 : prev - 1
//   );
// };

// const handleNextImage = () => {
//   setCurrentImageIndex((prev) =>
//     prev === images.length - 1 ? 0 : prev + 1
//   );
// };


//   useEffect(() => {
//     const fetchGround = async () => {
//       try {
//         const res = await getPublicGroundById(groundId);
//         setGround(res.data);
//       } catch {
//         showToast("error", "Failed to load ground details");
//         //alert("Failed to load ground details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGround();
//   }, [groundId]);

//   const formatTime12 = (time) => {
//   if (!time) return "";

//   const [hours, minutes] = time.split(":");
//   const h = parseInt(hours, 10);

//   const period = h >= 12 ? "PM" : "AM";
//   const hour12 = h % 12 || 12;

//   return `${hour12.toString().padStart(2, "0")}:${minutes} ${period}`;
// };


//     const isSlotSelected = (slot) =>
//     selectedSlots.some(
//         (s) => s.startTime === slot.startTime && s.endTime === slot.endTime
//     );

//     const totalPrice =
//   selectedSlots.length * Number(ground?.pricePerSlot || 0);



//   if (loading || !ground) {
//     return <p className="text-center mt-10">Loading ground...</p>;
//   }

//   /* ================= FILTER VALID SLOTS ================= */
//   const today = new Date().toISOString().split("T")[0];
//   const now = new Date();

//   const validSlots = Array.isArray(ground.slots)
//     ? ground.slots.filter((slot) => {
//         if (!selectedDate) return true;

//         const slotStart = new Date(`${selectedDate}T${slot.startTime}`);

//         if (selectedDate === today) {
//           return slotStart > now;
//         }

//         return true;
//       })
//     : [];

//     const handleConfirmBooking = async () => {
//       if (!token) {
//       navigate("/user/login", {
//         state: { from: location.pathname + location.search },
//       });
//       return;
//     }

//     if (!selectedDate || selectedSlots.length === 0) {
//       showToast("error", "selected date and slots");
//       //alert("Select date and slots");
//       return;
//     }

//     try {
//         await confirmBooking({
//         slotIds: selectedSlots.map(slot => slot.id),
//         date: selectedDate,
//         });

//         showToast("success","Booking confirmed 🎉");
//         setSelectedSlots([]);
//     } catch (err) {
//         // alert(err.response?.data?.message || "Booking failed");
//         showToast("error", err.response?.data?.message || "Booking failed");
//     }
//     };


//     const handleSlotSelect = (slot) => {
//   if (!token) {
//     navigate("/user/login", {
//       state: { from: location.pathname + location.search }
//     });
//     return;
//   }

//   setSelectedSlots(prev =>
//     prev.some(s => s.id === slot.id)
//       ? prev.filter(s => s.id !== slot.id)
//       : [...prev, slot]
//   );
// };


//   return (
//     <div className="h-screen overflow-y-auto bg-gray-900 px-6 py-10">

//       <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-y-auto">

//         {/* BACK */}
//         <div className="p-4 border-b">
//           <button
//             onClick={() => navigate("/user/bookingslot")}
//             className="text-indigo-600 font-medium"
//           >
//             ← Back to Grounds
//           </button>
//         </div>

//         {/* IMAGE */}
//         {/* HERO IMAGE */}
//           <div className="relative h-[420px] bg-black overflow-hidden">
//             <img
//               src={`${IMAGE_BASE}${ground.images[currentImageIndex].imageUrl}`}
//               className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
//               alt={ground.name}
//             />

//             {/* Dark overlay */}
//             <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

//             {/* Arrows */}
//             {ground.images.length > 1 && (
//               <>
//                 <button
//                   onClick={handlePrevImage}
//                   className="absolute left-6 top-1/2 -translate-y-1/2
//                             bg-white/20 hover:bg-white/40 text-white
//                             p-3 rounded-full backdrop-blur"
//                 >
//                   ‹
//                 </button>
//                 <button
//                   onClick={handleNextImage}
//                   className="absolute right-6 top-1/2 -translate-y-1/2
//                             bg-white/20 hover:bg-white/40 text-white
//                             p-3 rounded-full backdrop-blur"
//                 >
//                   ›
//                 </button>
//               </>
//             )}

//             {/* IMAGE DOTS */}
//             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
//               {ground.images.map((_, i) => (
//                 <span
//                   key={i}
//                   className={`h-2.5 w-2.5 rounded-full transition
//                     ${i === currentImageIndex ? "bg-white" : "bg-white/40"}
//                   `}
//                 />
//               ))}
//             </div>
//           </div>


        

//         {/* INFO */}

//         {/* FLOATING INFO */}
//         <div className="-mt-24 relative z-10 px-6">
//           <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8">

//             <div className="flex flex-col md:flex-row md:justify-between gap-6">
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-900">
//                   {ground.name}
//                 </h1>

//                 <p className="text-indigo-600 font-medium mt-1">
//                   🎮 {ground.game}
//                 </p>

//                 <p className="text-indigo-600 font-medium mt-1">
//                   📞 {ground.contactNo}
//                 </p>

//                 <p className="text-gray-600 mt-2">
//                   📍 {[ground.area, ground.city, ground.state, ground.country]
//                     .filter(Boolean)
//                     .join(", ")}
//                 </p>

//                 <p className="text-gray-600 mt-1">
//                   ⏰ {ground.openingTime} – {ground.closingTime}
//                 </p>
//               </div>

//               <div className="text-right">
//                 <p className="text-3xl font-bold text-green-600">
//                   ₹{ground.pricePerSlot}
//                 </p>
//                 <p className="text-sm text-gray-500">per slot</p>
//               </div>
//             </div>

//             {/* AMENITIES */}
//             <div className="flex flex-wrap gap-2 mt-5">
//               {ground.amenities?.map((a, i) => (
//                 <span
//                   key={i}
//                   className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
//                 >
//                   {a.name}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>


//         {/* DATE PICKER */}
//         <div className="max-w-5xl mx-auto px-6 mt-10">
//         <label className="block mb-2 font-semibold text-gray-700">
//           Select Date
//         </label>

//         <input
//           type="date"
//           min={today}
//           value={selectedDate || ""}
//           onChange={(e) => setSearchParams({ date: e.target.value })}
//           className="h-12 px-4 rounded-xl border border-gray-300
//                     focus:ring-2 focus:ring-indigo-500"
//         />
//       </div>


//         {/* AVAILABLE SLOTS */}
//         <div className="max-w-5xl mx-auto px-6 mt-8">
//         <h2 className="text-xl font-semibold mb-4">Available Slots</h2>

//         <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
//           {validSlots.map((slot) => {
//             const selected = isSlotSelected(slot);

//             return (
//               <button
//                 key={slot.id}
//                 onClick={() => handleSlotSelect(slot)}
//                 className={`rounded-xl px-4 py-3 text-sm font-medium
//                   transition-all
//                   ${
//                     selected
//                       ? "bg-indigo-600 text-white shadow-lg scale-105"
//                       : "bg-white border hover:border-indigo-500"
//                   }
//                 `}
//               >
//                 {formatTime12(slot.startTime)} – {formatTime12(slot.endTime)}
//               </button>
//             );
//           })}
//         </div>
//       </div>


//         {/* BOOKING SUMMARY */}
//         {/* {selectedSlots.length > 0 && (
//         <div className="p-6 border-t bg-gray-50">
//             <h3 className="font-semibold mb-2">Selected Slots</h3>

//             <ul className="text-sm text-gray-700 mb-3">
//             {selectedSlots.map((slot, i) => (
//                 <li key={i}>
//                 ⏱ {formatTime12(slot.startTime)} – {formatTime12(slot.endTime)}

//                 </li>
//             ))}
//             </ul>

//             <p className="font-semibold text-lg">
//             Total Price:{" "}
//             <span className="text-green-600">₹{totalPrice}</span>
//             </p>
//         </div>
//         )} */}

//         {selectedSlots.length > 0 && (
//           <div className="max-w-5xl mx-auto px-6 mt-10 mb-10">
//             <div className="bg-gray-50 rounded-2xl p-6 shadow-inner">

//               <h3 className="font-semibold mb-3">Selected Slots</h3>

//               <ul className="text-sm text-gray-700 space-y-1">
//                 {selectedSlots.map((s) => (
//                   <li key={s.id}>
//                     ⏱ {formatTime12(s.startTime)} – {formatTime12(s.endTime)}
//                   </li>
//                 ))}
//               </ul>

//               <div className="flex justify-between items-center mt-6">
//                 <p className="text-xl font-bold">
//                   Total: <span className="text-green-600">₹{totalPrice}</span>
//                 </p>

//                 {/* <button
//                   onClick={handleConfirmBooking}
//                   className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700
//                             text-white font-semibold rounded-xl shadow-lg"
//                 >
//                   Confirm Booking
//                 </button> */}
//                 <button
//                         onClick={() => {
//                           if (!userToken) {
//                             navigate("/user/login", {
//                               state: { from: location.pathname },
//                             });
//                           } else {
//                             handleConfirmBooking();
//                           }

//                         }}
//                         disabled={!token || selectedSlots.length === 0}
//                         className={`px-6 py-3 rounded-lg font-semibold
//                           ${token
//                             ? "bg-indigo-600 hover:bg-indigo-700 text-white"
//                             : "bg-gray-300 text-gray-600 cursor-not-allowed"
//                           }
//                         `}
//                         >
//                         {/* Confirm Booking ({selectedSlots.length}) */}
//                         {token ? "Confirm Booking " : "Login to Book"}
//                     </button>
//               </div>
//             </div>
//           </div>
//         )}



//         {/* CONFIRM */}
//         {/* {selectedSlots.length > 0 && (
//         <div className="p-6 border-t flex justify-end">
//             <button
//                 onClick={() => {
//                   if (!userToken) {
//                     navigate("/user/login", {
//                       state: { from: location.pathname },
//                     });
//                   } else {
//                     handleConfirmBooking();
//                   }

//                 }}
//                 disabled={!token || selectedSlots.length === 0}
//                 className={`px-6 py-3 rounded-lg font-semibold
//                   ${token
//                     ? "bg-indigo-600 hover:bg-indigo-700 text-white"
//                     : "bg-gray-300 text-gray-600 cursor-not-allowed"
//                   }
//                 `}
//                 >
//                 Confirm Booking ({selectedSlots.length})
//                 {token ? "Confirm Booking" : "Login to Book"}
//             </button>

//         </div>
//         )} */}

//       </div>
//       <Toast
//                 show={toast.show}
//                 type={toast.type}
//                 message={toast.message}
//                 onClose={() => setToast({ ...toast, show: false })}
//               />
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import {
//   useSearchParams,
//   useNavigate,
//   useLocation,
//   useParams,
// } from "react-router-dom";
// import { getPublicGroundById, confirmBooking } from "../../services/api";
// import Toast from "../../components/common/Toast";

// const IMAGE_BASE = process.env.REACT_APP_IMAGE_URL;

// export default function GroundDetails({ groundId: propGroundId }) {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const selectedDate = searchParams.get("date");
//   const { groundId: paramGroundId } = useParams();
//   const groundId = propGroundId || paramGroundId;

//   const [ground, setGround] = useState(null);
//   const [selectedSlots, setSelectedSlots] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const token = localStorage.getItem("userToken");

//   const [toast, setToast] = useState({
//     show: false,
//     type: "success",
//     message: "",
//   });

//   const showToast = (type, message) =>
//     setToast({ show: true, type, message });

//   /* ================= FETCH GROUND ================= */
//   useEffect(() => {
//     const fetchGround = async () => {
//       try {
//         const res = await getPublicGroundById(groundId);
//         setGround(res.data);
//       } catch {
//         showToast("error", "Failed to load ground details");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchGround();
//   }, [groundId]);

//   if (loading || !ground) {
//     return <p className="text-center mt-20 text-white">Loading...</p>;
//   }

//   const images = ground.images || [];

//   const handlePrevImage = () =>
//     setCurrentImageIndex((p) => (p === 0 ? images.length - 1 : p - 1));

//   const handleNextImage = () =>
//     setCurrentImageIndex((p) => (p === images.length - 1 ? 0 : p + 1));

//   const formatTime12 = (time) => {
//     const [h, m] = time.split(":");
//     const hour = Number(h);
//     return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
//   };

//   const today = new Date().toISOString().split("T")[0];
//   const now = new Date();

//   const validSlots = Array.isArray(ground.slots)
//     ? ground.slots.filter((slot) => {
//         if (!selectedDate) return true;
//         const slotStart = new Date(`${selectedDate}T${slot.startTime}`);
//         return selectedDate !== today || slotStart > now;
//       })
//     : [];

//   const isSlotSelected = (slot) =>
//     selectedSlots.some((s) => s.id === slot.id);

//   const totalPrice =
//     selectedSlots.length * Number(ground.pricePerSlot || 0);

//   const handleSlotSelect = (slot) => {
//     if (!token) {
//       navigate("/user/login", { state: { from: location.pathname } });
//       return;
//     }
//     setSelectedSlots((prev) =>
//       prev.some((s) => s.id === slot.id)
//         ? prev.filter((s) => s.id !== slot.id)
//         : [...prev, slot]
//     );
//   };

//   const handleConfirmBooking = async () => {
//     if (!selectedDate || selectedSlots.length === 0) {
//       showToast("error", "Select date and slots");
//       return;
//     }
//     try {
//       await confirmBooking({
//         slotIds: selectedSlots.map((s) => s.id),
//         date: selectedDate,
//       });
//       showToast("success", "Booking confirmed 🎉");
//       setSelectedSlots([]);
//     } catch (err) {
//       showToast("error", err.response?.data?.message || "Booking failed");
//     }
//   };

//   /* ================= UI ================= */
//   return (
//     <div className="h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 overflow-y-auto">
//       {/* BACK */}
//       <div className="max-w-7xl mx-auto px-6 pt-6">
//         <button
//           onClick={() => navigate(-1)}
//           className="text-indigo-300 hover:text-white font-medium"
//         >
//           ← Back to Grounds
//         </button>
//       </div>

//       {/* HERO IMAGE */}
//       <div className="relative h-[480px] mt-4">
//         <img
//           src={`${IMAGE_BASE}${images[currentImageIndex]?.imageUrl}`}
//           className="absolute inset-0 w-full h-full object-cover"
//           alt={ground.name}
//         />
//         <div className="absolute inset-0 bg-black/50" />

//         {images.length > 1 && (
//           <>
//             <button
//               onClick={handlePrevImage}
//               className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 p-3 rounded-full text-white"
//             >
//               ‹
//             </button>
//             <button
//               onClick={handleNextImage}
//               className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 p-3 rounded-full text-white"
//             >
//               ›
//             </button>
//           </>
//         )}
//       </div>

//       {/* CONTENT */}
//       <div className="-mt-24 relative z-10 max-w-7xl mx-auto px-6 pb-20">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

//           {/* LEFT */}
//           <div className="lg:col-span-2 space-y-6">
//             <div className="bg-white rounded-2xl p-6 shadow-xl">
//               <h1 className="text-3xl font-bold">{ground.name}</h1>
//               <p className="text-indigo-600 mt-1">🎮 {ground.game}</p>
//               <p className="mt-2 text-gray-600">
//                 📍 {[ground.area, ground.city, ground.state].join(", ")}
//               </p>
//               <p className="text-gray-600">
//                 ⏰ {ground.openingTime} – {ground.closingTime}
//               </p>

//               <div className="flex flex-wrap gap-2 mt-4">
//                 {ground.amenities?.map((a, i) => (
//                   <span
//                     key={i}
//                     className="px-3 py-1 text-xs bg-indigo-50 text-indigo-700 rounded-full"
//                   >
//                     {a.name}
//                   </span>
//                 ))}
//               </div>
//             </div>

//             {/* DATE */}
//             <div className="bg-white rounded-2xl p-6 shadow">
//               <label className="font-semibold block mb-2">
//                 Select Date
//               </label>
//               <input
//                 type="date"
//                 min={today}
//                 value={selectedDate || ""}
//                 onChange={(e) =>
//                   setSearchParams({ date: e.target.value })
//                 }
//                 className="h-12 px-4 rounded-xl border w-full"
//               />
//             </div>

//             {/* SLOTS */}
//             <div className="bg-white rounded-2xl p-6 shadow">
//               <h2 className="font-semibold mb-4">Available Slots</h2>
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//                 {validSlots.map((slot) => {
//                   const selected = isSlotSelected(slot);
//                   return (
//                     <button
//                       key={slot.id}
//                       onClick={() => handleSlotSelect(slot)}
//                       className={`rounded-xl px-4 py-3 text-sm font-medium
//                         ${
//                           selected
//                             ? "bg-indigo-600 text-white"
//                             : "border hover:border-indigo-500"
//                         }`}
//                     >
//                       {formatTime12(slot.startTime)} –{" "}
//                       {formatTime12(slot.endTime)}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//           {/* RIGHT – BOOKING CARD */}
//           <div className="bg-white rounded-2xl p-6 shadow-xl h-fit sticky top-24">
//             <p className="text-3xl font-bold text-green-600">
//               ₹{ground.pricePerSlot}
//             </p>
//             <p className="text-sm text-gray-500 mb-4">per slot</p>

//             {selectedSlots.length > 0 && (
//               <div className="mb-4 text-sm">
//                 {selectedSlots.map((s) => (
//                   <p key={s.id}>
//                     ⏱ {formatTime12(s.startTime)} –{" "}
//                     {formatTime12(s.endTime)}
//                   </p>
//                 ))}
//               </div>
//             )}

//             <p className="font-bold text-lg mb-4">
//               Total:{" "}
//               <span className="text-green-600">₹{totalPrice}</span>
//             </p>

//             <button
//               onClick={() =>
//                 token ? handleConfirmBooking() : navigate("/user/login")
//               }
//               className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl"
//             >
//               {token ? "Confirm Booking" : "Login to Book"}
//             </button>
//           </div>
//         </div>
//       </div>

//       <Toast
//         show={toast.show}
//         type={toast.type}
//         message={toast.message}
//         onClose={() => setToast({ ...toast, show: false })}
//       />
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import {
  useSearchParams,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import { getPublicGroundById, confirmBooking } from "../../services/api";
import Toast from "../../components/common/Toast";

const IMAGE_BASE = process.env.REACT_APP_IMAGE_URL;

export default function GroundDetails({ groundId: propGroundId }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedDate = searchParams.get("date");
  const { groundId: paramGroundId } = useParams();
  const groundId = propGroundId || paramGroundId;

  const [ground, setGround] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("userToken");

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const showToast = (type, message) =>
    setToast({ show: true, type, message });

  /* ================= FETCH GROUND ================= */
  useEffect(() => {
    const fetchGround = async () => {
      try {
        const res = await getPublicGroundById(groundId);
        setGround(res.data);
      } catch {
        showToast("error", "Failed to load ground details");
      } finally {
        setLoading(false);
      }
    };
    fetchGround();
  }, [groundId]);

  if (loading || !ground) {
    return <p className="text-center mt-20 text-white">Loading...</p>;
  }

  const images = ground.images || [];

  const handlePrevImage = () =>
    setCurrentImageIndex((p) => (p === 0 ? images.length - 1 : p - 1));

  const handleNextImage = () =>
    setCurrentImageIndex((p) => (p === images.length - 1 ? 0 : p + 1));

  const formatTime12 = (time) => {
    const [h, m] = time.split(":");
    const hour = Number(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };

  const today = new Date().toISOString().split("T")[0];
  const now = new Date();

  const validSlots = Array.isArray(ground.slots)
    ? ground.slots.filter((slot) => {
        if (!selectedDate) return true;
        const slotStart = new Date(`${selectedDate}T${slot.startTime}`);
        return selectedDate !== today || slotStart > now;
      })
    : [];

  const isSlotSelected = (slot) =>
    selectedSlots.some((s) => s.id === slot.id);

  const totalPrice =
    selectedSlots.length * Number(ground.pricePerSlot || 0);

  const handleSlotSelect = (slot) => {
    if (!token) {
      navigate("/user/login", { state: { from: location.pathname } });
      return;
    }
    setSelectedSlots((prev) =>
      prev.some((s) => s.id === slot.id)
        ? prev.filter((s) => s.id !== slot.id)
        : [...prev, slot]
    );
  };

  const handleConfirmBooking = async () => {
    if (!selectedDate || selectedSlots.length === 0) {
      showToast("error", "Select date and slots");
      return;
    }
    try {
      await confirmBooking({
        slotIds: selectedSlots.map((s) => s.id),
        date: selectedDate,
      });
      showToast("success", "Booking confirmed 🎉");
      setSelectedSlots([]);
    } catch (err) {
      showToast("error", err.response?.data?.message || "Booking failed");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="h-screen bg-indigo-950 overflow-y-auto">
      {/* BACK */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-indigo-300 hover:text-white"
        >
          ← Back
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            {/* IMAGE SLIDER */}
            <div className="relative rounded-2xl overflow-hidden h-[420px]">
              <img
                src={`${IMAGE_BASE}${images[currentImageIndex]?.imageUrl}`}
                className="w-full h-full object-cover"
                alt={ground.name}
              />
              <div className="absolute inset-0 bg-black/30" />

              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2
                               bg-white/30 hover:bg-white/50
                               text-white p-3 rounded-full"
                  >
                    ‹
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2
                               bg-white/30 hover:bg-white/50
                               text-white p-3 rounded-full"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* BASIC INFO */}
            <div className="bg-white rounded-2xl p-6 shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">{ground.name}</h1>
                   <p className="text-gray-600 mt-1">
                     ⏰ {ground.openingTime} – {ground.closingTime}
                   </p>
                  <p className="text-indigo-600 font-medium mt-1">
                   🎮 {ground.game}
                 </p>

                 <p className="text-indigo-600 font-medium mt-1">
                   📞 {ground.contactNo}
                 </p>
                  <p className="text-gray-600 mt-2">
                    {ground.area}, {ground.city}, {ground.state}, {ground.country}
                  </p>
                </div>
                <p className="font-semibold">
                  ⭐ 4.6 <span className="text-gray-500">(21)</span>
                </p>
              </div>
            </div>

            {/* AMENITIES */}
            <div className="bg-white rounded-2xl p-6 shadow">
              <h2 className="font-semibold text-lg mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                {ground.amenities?.map((a, i) => (
                  <div key={i} className="flex items-center gap-2">
                    ✔ {a.name}
                  </div>
                ))}
              </div>
            </div>

            {/* ABOUT */}
            <div className="bg-white rounded-2xl p-6 shadow">
              <h2 className="font-semibold text-lg mb-2">About Venue</h2>
              <p className="text-gray-600">
                {ground.description || "No description available"}
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="bg-white rounded-2xl p-6 shadow-xl h-fit sticky top-24">
            {/* <p className="text-center font-semibold mb-4">
              This venue has multiple courts
            </p>

            <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg mb-4">
              Book Now
            </button>

            <label className="font-medium block mb-2">
              Choose Turf / Court
            </label>

            <select className="w-full border rounded-lg p-2 mb-4">
              <option>Box (Artificial Turf)</option>
            </select> */}

            {/* <p className="font-semibold mb-2">Pricing</p>

            <div className="flex justify-between text-sm mb-2">
              <span>06:00 am - 06:00 pm</span>
              <span className="text-green-600">₹800/hr</span>
            </div>

            <div className="flex justify-between text-sm mb-4">
              <span>06:00 pm - 12:00 am</span>
              <span className="text-green-600">₹1000/hr</span>
            </div> */}

              <h4 className="font-semibold mb-2">Price</h4>
           
                   <p className="text-3xl font-bold text-green-600">
                     ₹{ground.pricePerSlot}
                   </p>
                   <p className="text-sm text-gray-500">per slot</p>
                 

            <hr className="my-4" />

            <label className="font-medium block mb-2">
              Select Date
            </label>

            <input
              type="date"
              min={today}
              value={selectedDate || ""}
              onChange={(e) =>
                setSearchParams({ date: e.target.value })
              }
              className="w-full border rounded-lg p-2 mb-4"
            />

            <div className="grid grid-cols-2 gap-3">
              {validSlots.map((slot) => {
                const selected = isSlotSelected(slot);
                return (
                  <button
                    key={slot.id}
                    onClick={() => handleSlotSelect(slot)}
                    className={`py-2 rounded-lg text-sm
                      ${
                        selected
                          ? "bg-indigo-600 text-white"
                          : "border hover:border-indigo-500"
                      }`}
                  >
                    {formatTime12(slot.startTime)} -{" "}
                    {formatTime12(slot.endTime)}
                  </button>
                );
              })}
            </div>

            <p className="font-bold text-lg mt-6">
              Total: <span className="text-green-600">₹{totalPrice}</span>
            </p>

            <button
              onClick={() =>
                token ? handleConfirmBooking() : navigate("/user/login")
              }
              className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
            >
              {token ? "Confirm Booking" : "Login to Book"}
            </button>
          </div>
        </div>
      </div>

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
