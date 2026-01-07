import { Routes, Route } from "react-router-dom";
import AdminLogin from "../pages/AdminLogin";
import Dashboard from "../pages/admin/Dashboard";
import { Games } from "../pages/admin/Games";
import Grounds from "../pages/admin/Grounds";
import Bookings from "../pages/admin/Bookings";
import AdminLayout from "../components/AdminLayout";
import LandingPage from "../pages/Landingpage";
import UserLogin from "../pages/user/UserLogin";
import UserRegister from "../pages/user/UserRegister";
import Home from "../pages/user/Home";
import Mybooking from "../pages/user/Mybooking";
import Bookingslot from "../pages/user/Bookingslot";
import UserLayout from "../components/UserLayout";
import AdminProtectedRoute from "./AdminProtectedRoute";
import Profile from "../pages/admin/Profile";
import ChangePassword from "../pages/admin/ChangePassword";
import AddGround from "../pages/admin/AddGround";
import { Navigate } from "react-router-dom";








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
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/user/UserRegister" element={<UserRegister />} />

      {/* User (WITH SIDEBAR) */}
    
      <Route path="/user" element={<UserLayout />}>
        <Route path="home" element={<Home />} />
        <Route path="games" element={<Games />} />
        <Route path="mybooking" element={<Mybooking />} />
        <Route path="bookingslot" element={<Bookingslot />} />
        <Route path="/user/book/:groundId" element={<Bookingslot />} />
      </Route>
      // Admin Login without sidebar
       <Route path="/login" element={<AdminLogin />} />
       

      {/* Admin
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="games" element={<Games />} />
        <Route path="grounds" element={<Grounds />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="addground" element={<AddGround />} />
      </Route> */}

      {/* Admin Protected */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="games" element={<Games />} />
          <Route path="grounds" element={<Grounds />} />
          <Route path="profile" element={<Profile />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="addground" element={<AddGround />} />
        </Route>
      </Route>
    </Routes>

  );
};
