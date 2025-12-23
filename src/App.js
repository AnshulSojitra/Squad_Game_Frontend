// import { BrowserRouter } from "react-router-dom";
// import "./App.css";
// import Navbar from "./components/common/Navbar";
// import { AppRoutes } from "./routes/AppRoutes";
// import AdminSidebar from "./components/AdminSidebar";

// function App() {
//   return (
//     <div>
//       <BrowserRouter>
//         {/* <Navbar /> */}
//         <AdminSidebar />
//         <AppRoutes />
//       </BrowserRouter>
//     </div>
//   );
// }

// export default App;

import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { AppRoutes } from "./routes/AppRoutes";
import AdminSidebar from "./components/AdminSidebar";

function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 min-h-screen bg-gray-100">
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
