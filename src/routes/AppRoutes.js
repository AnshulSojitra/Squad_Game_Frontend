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
import ChangePassword from "../pages/admin/ChangePassword";
import AddGround from "../pages/admin/AddGround";
import { Navigate } from "react-router-dom";
import UserProtectedRoute from "./UserProtectedRoute";
import GroundDetails from "../pages/user/GroundDetails";
import PublicLayout from "../components/PublicLayout";
import AdminProfile from "../pages/admin/AdminProfile";





export const AppRoutes = () => {
  return (

    <Routes>
      {/* Public */}
      {/* <Route path="/" element={<LandingPage />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/user/UserRegister" element={<UserRegister />} /> */}

      {/* User (WITH SIDEBAR) */}
    
      {/* <Route path="/user" element={<UserLayout />}>
        <Route path="home" element={<Home />} />
        <Route path="games" element={<Games />} />
        <Route path="mybooking" element={<Mybooking />} />
        <Route path="bookingslot" element={<Bookingslot />} />
        <Route path="/user/book/:groundId" element={<Bookingslot />} />
      </Route> */}

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
          </Route>
        </Route>
        
        <Route path="/Grounds" element={<Bookingslot />} />
        
        <Route path="/user/grounds/:groundId" element={<GroundDetails />} />
        
      
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
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="addground" element={<AddGround />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Route>
    </Routes>

  );
};
