import { Routes, Route } from "react-router-dom";
import AdminLogin from "../pages/AdminLogin";
import Dashboard from "../pages/admin/Dashboard";
import { Games } from "../pages/admin/Games";
import Grounds from "../pages/admin/Grounds";
import Bookings from "../pages/admin/Bookings";
import AdminLayout from "../components/layouts/AdminLayout";
import LandingPage from "../pages/Landingpage";
import UserLogin from "../pages/user/UserLogin";
import UserRegister from "../pages/user/UserRegister";
import Home from "../pages/user/Home";
import Mybooking from "../pages/user/Mybooking";
import Bookingslot from "../pages/user/Bookingslot";
import UserLayout from "../components/layouts/UserLayout";
import AdminProtectedRoute from "./AdminProtectedRoute";
import ChangePassword from "../pages/admin/ChangePassword";
import AddGround from "../pages/admin/AddGround";
import { Navigate } from "react-router-dom";
import UserProtectedRoute from "./UserProtectedRoute";
import GroundDetails from "../pages/user/GroundDetails";
import PublicLayout from "../components/layouts/PublicLayout";
import AdminProfile from "../pages/admin/AdminProfile";
import UserProfile from "../pages/user/UserProfile";


/* Super Admin */
import SuperAdminLogin from "../pages/super-admin/SuperAdminLogin";
import SuperAdminDashboard from "../pages/super-admin/SuperAdminDashboard";
import SuperAdminUsers from "../pages/super-admin/SuperAdminUser";
import SuperAdminAdmins from "../pages/super-admin/SuperAdminAdmins";
import SuperAdminGrounds from "../pages/super-admin/SuperAdminGrounds";
import SuperAdminBookings from "../pages/super-admin/SuperAdminBookings";
import SuperAdminLayout from "../components/layouts/SuperAdminLayout";
import SuperAdminProtectedRoute from "./SuperAdminProtectedRoutes";
import SuperAdminUserBook from "../pages/super-admin/SuperAdminUserBook";
import SuperAdminAdminDetails from "../pages/super-admin/SuperAdminAdminDetails";
import SuperAdminGroundsBooking from "../pages/super-admin/SuperAdminGroundBooking";
export const AppRoutes = () => {
  return (

    <Routes>
      
      <Route element={<PublicLayout />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/Grounds" element={<Bookingslot />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/user/UserRegister" element={<UserRegister />} />
    </Route>


        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/UserRegister" element={<UserRegister />} />

        {/* Public Booking View */}
       
        {/* <Route path="/user/book/:groundId" element={<Bookingslot />} />  */}

        {/* Protected User Area */}
        <Route element={<UserProtectedRoute />}>
          <Route path="/user" element={<UserLayout />}>
            <Route path="home" element={<Home />} />
            <Route path="games" element={<Games />} />
            <Route path="bookingslot" element={<Bookingslot />} />
            <Route path="mybooking" element={<Mybooking />} />
            <Route path="profile" element={<UserProfile/>}/>
          </Route>
        </Route>
        
        <Route path="/Grounds" element={<Bookingslot />} />
        
        <Route path="/user/grounds/:groundId" element={<GroundDetails />} />
        
      
       {/* Admin Login without sidebar */}
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
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="addground" element={<AddGround />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Route>


        {/* ================= SUPER ADMIN LOGIN ================= */}
      <Route path="/super-admin/login" element={<SuperAdminLogin />} />

      {/* ================= SUPER ADMIN PANEL ================= */}
      <Route
        path="/super-admin"
        element={
          <SuperAdminProtectedRoute>
            <SuperAdminLayout />
          </SuperAdminProtectedRoute>
        }
      >
        <Route path="dashboard" element={<SuperAdminDashboard />} />
        <Route path="users" element={<SuperAdminUsers />} />
        <Route path="admins" element={<SuperAdminAdmins />} />
        <Route path="grounds" element={<SuperAdminGrounds />} />
        <Route path="bookings" element={<SuperAdminBookings />} />
        <Route path="users/:userId/bookings" element={<SuperAdminUserBook/>}/>
        <Route path="admins/:adminId" element={<SuperAdminAdminDetails />}/>
        <Route path="/super-admin/grounds/:groundId/bookings" element={<SuperAdminGroundsBooking />} />

      </Route>

    </Routes>

  );
};
