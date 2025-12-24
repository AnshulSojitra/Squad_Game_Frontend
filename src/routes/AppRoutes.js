import { Routes, Route } from "react-router-dom";
import AdminLogin from "../pages/admin/AdminLogin";
import Dashboard from "../pages/admin/Dashboard";
import { Games } from "../pages/admin/Games";
import { Grounds } from "../pages/admin/Grounds";
import { Bookings } from "../pages/admin/Bookings";
import { AdminLayout } from "../components/AdminLayout";
import LandingPage from "../pages/Landingpage";

export const AppRoutes = () => {
  return (
    // <Routes>
    //   <Route path="/" element={<LandingPage />} />
    //   <Route path="/admin/login" element={<AdminLayout />}>
    //     <Route path="/admin/dashboard" element={<Dashboard />} />
    //     <Route path="/admin/games" element={<Games />} />
    //     <Route path="/admin/grounds" element={<Grounds />} />
    //     <Route path="/admin/bookings" element={<Bookings />} />
    //   </Route>
    // </Routes>

    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="games" element={<Games />} />
        <Route path="grounds" element={<Grounds />} />
        <Route path="bookings" element={<Bookings />} />
      </Route>
    </Routes>

  );
};
