import { Routes, Route } from "react-router-dom";
import AdminLogin from "../pages/AdminLogin";
import { Dashboard } from "../pages/Dashboard";
import { Games } from "../pages/Games";
import { Grounds } from "../pages/Grounds";
import { Bookings } from "../pages/Bookings";
import { AdminLayout } from "../components/AdminLayout";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/adminlogin" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="games" element={<Games />} />
        <Route path="grounds" element={<Grounds />} />
        <Route path="bookings" element={<Bookings />} />
      </Route>
    </Routes>
  );
};
