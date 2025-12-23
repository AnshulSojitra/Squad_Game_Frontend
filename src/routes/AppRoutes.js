import { Routes, Route } from "react-router-dom";
import AdminLogin from "../pages/AdminLogin";
import Dashboard from "../pages/Dashboard";
import { Games } from "../pages/Games";
import { Grounds } from "../pages/Grounds";
import { Bookings } from "../pages/Bookings";
import { AdminLayout } from "../components/AdminLayout";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/" element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/games" element={<Games />} />
        <Route path="/admin/grounds" element={<Grounds />} />
        <Route path="/admin/bookings" element={<Bookings />} />
      </Route>
    </Routes>
  );
};
