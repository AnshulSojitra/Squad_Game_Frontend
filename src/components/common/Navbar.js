// import { Link } from "react-router-dom";

// export default function Navbar() {
//   return (
//     <nav className="bg-gray-900 border-b border-gray-800">
//   <div className="max-w-7xl mx-auto px-6">
//     <div className="flex justify-between items-center h-16">

//       {/* Logo */}
//       <Link
//         to="/"
//         className="text-2xl font-extrabold tracking-wide text-indigo-500 hover:text-indigo-400 transition"
//       >
//       BoxArena
//       </Link>

//       {/* Links */}
//       <div className="hidden md:flex items-center space-x-8">
//         <Link
//           to="/"
//           className="text-gray-300 hover:text-white text-sm font-medium transition"
//         >
//           Home
//         </Link>

//         <Link
//           to="/Grounds"
//           className="text-gray-300 hover:text-white text-sm font-medium transition"
//         >
//           Grounds
//         </Link>

//         <Link
//           to="/user/Mybooking"
//           className="text-gray-300 hover:text-white text-sm font-medium transition"
//         >
//           Mybooking
//         </Link>

//         {/* CTA Button */}
//         <Link
//           to="/user/login"
//           className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
//         >
//           Login
//         </Link>
//         {/* <Link
//         to="/user/UserRegister"
//         className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
//           Sign Up
//         </Link> */}
//       </div>
//     </div>
//   </div>
// </nav>

//   );
// }
// import { Link, useNavigate } from "react-router-dom";
// import { useEffect, useState, useRef } from "react";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const dropdownRef = useRef(null);

//   const [user, setUser] = useState(null);
//   const [open, setOpen] = useState(false);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("userInfo");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handler = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("userToken");
//     localStorage.removeItem("userInfo");
//     setUser(null);
//     navigate("/");
//   };

//   return (
//     <nav className="bg-gray-900 border-b border-gray-800">
//       <div className="max-w-7xl mx-auto px-6">
//         <div className="flex justify-between items-center h-16">

//           {/* Logo */}
//           <Link
//             to="/"
//             className="text-2xl font-extrabold tracking-wide text-indigo-500 hover:text-indigo-400 transition"
//           >
//             BoxArena
//           </Link>

//           {/* Links */}
//           <div className="hidden md:flex items-center space-x-8">
//             <Link to="/" className="text-gray-300 hover:text-white text-sm font-medium">
//               Home
//             </Link>

//             <Link to="/grounds" className="text-gray-300 hover:text-white text-sm font-medium">
//               Grounds
//             </Link>

//             {user && (
//               <Link
//                 to="/user/mybooking"
//                 className="text-gray-300 hover:text-white text-sm font-medium"
//               >
//                 My Booking
//               </Link>
//             )}

//             {/* RIGHT SIDE */}
//             {!user ? (
//               /* Login Button */
//               <Link
//                 to="/user/login"
//                 className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
//               >
//                 Login
//               </Link>
//             ) : (
//               /* User Dropdown */
//               <div className="relative" ref={dropdownRef}>
//                 <button
//                   onClick={() => setOpen(!open)}
//                   className="flex items-center gap-2 text-gray-200 hover:text-white font-medium"
//                 >
//                   <img
//                     src="/avatar.png"
//                     alt="avatar"
//                     className="h-8 w-8 rounded-full border"
//                   />
//                   {user.name}
//                 </button>

//                 {open && (
//                   <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50">
//                     <Link
//                       to="/user/profile"
//                       className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
//                       onClick={() => setOpen(false)}
//                     >
//                       👤 View Profile
//                     </Link>

//                     <Link
//                       to="/user/mybooking"
//                       className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
//                       onClick={() => setOpen(false)}
//                     >
//                       📅 My Bookings
//                     </Link>

//                     <Link
//                       to="/user/change-password"
//                       className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
//                       onClick={() => setOpen(false)}
//                     >
//                       🔒 Change Password
//                     </Link>

//                     <button
//                       onClick={handleLogout}
//                       className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                     >
//                       🚪 Logout
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }
// import { Link } from "react-router-dom";
// import { useState } from "react";

// export default function Navbar() {
//   const [open, setOpen] = useState(false);

//   // ✅ Read user from localStorage
//   const user = JSON.parse(localStorage.getItem("user")); 
//   // Example stored object:
//   // { id, name, email }

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("userToken");
//     window.location.href = "/"; // ✅ no useNavigate
//   };

//   return (
//     <nav className="bg-gray-900 border-b border-gray-800">
//       <div className="max-w-7xl mx-auto px-6">
//         <div className="flex justify-between items-center h-16">

//           {/* Logo */}
//           <Link
//             to="/"
//             className="text-2xl font-extrabold tracking-wide text-indigo-500 hover:text-indigo-400 transition"
//           >
//             BoxArena
//           </Link>

//           {/* Links */}
//           <div className="hidden md:flex items-center space-x-8">

//             <Link
//               to="/"
//               className="text-gray-300 hover:text-white text-sm font-medium"
//             >
//               Home
//             </Link>

//             <Link
//               to="/Grounds"
//               className="text-gray-300 hover:text-white text-sm font-medium"
//             >
//               Grounds
//             </Link>

//             {user && (
//               <Link
//                 to="/user/Mybooking"
//                 className="text-gray-300 hover:text-white text-sm font-medium"
//               >
//                 My Booking
//               </Link>
//             )}

//             {/* 🔵 AUTH SECTION */}
//             {!user ? (
//               /* LOGIN BUTTON */
//               <Link
//                 to="/user/login"
//                 className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
//               >
//                 Login
//               </Link>
//             ) : (
//               /* USER DROPDOWN */
//               <div className="relative ml-4">
//                 <button
//                   onClick={() => setOpen(!open)}
//                   className="flex items-center gap-2 text-white font-medium"
//                 >
//                   {/* <img
//                     src="https://i.pravatar.cc/32"
//                     alt="avatar"
//                     className="w-8 h-8 rounded-full"
//                   /> */}
//                    <img
//             src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
//             className="w-9 h-9 rounded-full border"
//             alt="user"
//           />
//                   {user.name}
//                 </button>

//                 {open && (
//                   <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg overflow-hidden z-50">
//                     <Link
//                       to="/user/profile"
//                       className="block px-4 py-2 text-sm hover:bg-gray-100"
//                       onClick={() => setOpen(false)}
//                     >
//                       View Profile
//                     </Link>

//                     <Link
//                       to="/user/Mybooking"
//                       className="block px-4 py-2 text-sm hover:bg-gray-100"
//                       onClick={() => setOpen(false)}
//                     >
//                       My Bookings
//                     </Link>

//                     <Link
//                       to="/user/change-password"
//                       className="block px-4 py-2 text-sm hover:bg-gray-100"
//                       onClick={() => setOpen(false)}
//                     >
//                       Change Password
//                     </Link>

//                     <button
//                       onClick={handleLogout}
//                       className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }
import { Link , useNavigate} from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ TOKEN-BASED AUTH CHECK
  const token = localStorage.getItem("userToken");
  const user = JSON.parse(localStorage.getItem("user")); 
  // expected shape: { name, email }

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    window.location.href = "/"; // back to landing page
  };

 const handleScrollToGrounds = () => {
  // If already on landing page
  if (window.location.pathname === "/") {
    const section = document.getElementById("available-grounds");
    section?.scrollIntoView({ behavior: "smooth" });
  } else {
    // If not on landing page, go there first
    window.location.href = "/#available-grounds";
  }
};


  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-wide text-indigo-500 hover:text-indigo-400 transition"
          >
            BoxArena
          </Link>

          {/* LINKS */}
          <div className="hidden md:flex items-center space-x-8">

            <Link
              to="/"
              className="text-gray-300 hover:text-white text-sm font-medium"
            >
              Home
            </Link>

            <Link
              // to="/Grounds"
              onClick={handleScrollToGrounds}
              className="text-gray-300 hover:text-white text-sm font-medium"
            >
              Grounds
            </Link>

            {/* Only visible if logged in */}
            {token && (
              <Link
                to="/user/Mybooking"
                className="text-gray-300 hover:text-white text-sm font-medium"
              >
                My Booking
              </Link>
            )}

            {/* AUTH SECTION */}
            {!token ? (
              /* 🔵 LOGIN BUTTON */
              <Link
                to="/user/login"
                className="ml-4 bg-indigo-600 hover:bg-indigo-700
                           text-white px-4 py-2 rounded-lg
                           text-sm font-semibold transition"
              >
                Login
              </Link>
            ) : (
              /* 🟢 USER DROPDOWN */
              <div className="relative ml-4">
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-2 text-white font-medium"
                >
                  {/* <img
                    src="https://i.pravatar.cc/32"
                    alt="User"
                    className="w-8 h-8 rounded-full"
                  /> */}
                  <img
                 src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                 className="w-9 h-9 rounded-full border"
                 alt="user"
                />
                  {user?.name || "User"}
                </button>

                {/* {open && (
                  <div
                    className="absolute right-0 mt-3 w-48 bg-white
                               rounded-xl shadow-lg overflow-hidden z-50"
                  >
                    <Link
                      to="/user/profile"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setOpen(false)}
                    >
                      View Profile
                    </Link>

                    <Link
                      to="/user/Mybooking"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setOpen(false)}
                    >
                      My Bookings
                    </Link>

                    <Link
                      to="/user/change-password"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setOpen(false)}
                    >
                      Change Password
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2
                                 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )} */}
                {open && (
          <div className="absolute right-0 mt-3 w-48 bg-white rounded-md shadow-lg z-50 text-black">
            <button
              onClick={() => navigate("/user/profile")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              👤 View Profile
            </button>

            <button
              onClick={() => navigate("/user/mybooking")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              📅 My Bookings
            </button>

          <button
              onClick={() => navigate("/user/change-password")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              🔒 Change Password
            </button>

            <hr />

            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
            >
              🚪 Logout
            </button>
          </div>
        )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
