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

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
