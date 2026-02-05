import { Routes, Route } from "react-router-dom";
import AdminLogin from "../pages/admin/AdminLogin";
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
import Profile from "../pages/admin/Profile";
import UserProfile from "../pages/user/UserProfile";
import UserChangePassword from "../pages/user/UserChangePassword";
import UserForgotPassword from "../pages/user/UserForgotPassword";
import UserResetPassword from "../pages/user/UserResetPassword";
import AdminForgotPassword from "../pages/admin/AdminForgotPassword";
import AdminResetPassword from "../pages/admin/AdminResetPassword";


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
import SuperAdminCreateAdmin from "../pages/super-admin/SuperAdminCreateAdmin";
import SuperAdminProfile from "../pages/super-admin/SuperAdminProfile";
import GroundDetailsAdmin from "../pages/admin/GroundDetailsAdmin";
import UserProfileLayout from "../components/layouts/UserProfileLayout";
import EditProfile from "../pages/user/EditProfile";
import Feedback from "../pages/user/Feedback";



export const AppRoutes = () => {
  return (

    <Routes>
      
      <Route element={<PublicLayout />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/Grounds" element={<Bookingslot />} />
      <Route path="/user/grounds/:groundId" element={<GroundDetails />} />
      <Route path="/user/mybooking" element={<Mybooking />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/user/UserRegister" element={<UserRegister />} />
      </Route>

  

<Route path="/profile" element={<UserProfileLayout />}>
  <Route path="profile" element={<UserProfile />} />
  <Route path="mybooking" element={<Mybooking />} />
  <Route path="edit" element={<EditProfile />} />
  <Route path="feedback" element={<Feedback />} />
</Route>


{/* =================================================================== USER PANEL ==================================================== */}


        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/UserRegister" element={<UserRegister />} />
        <Route path="user/forgot-password" element={<UserForgotPassword/>}/>
        <Route path="/user/reset-password/:token" element={<UserResetPassword/>}/>

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
          <Route path="/user/profile" element={<UserProfile/>}/>
          <Route path="/user/change-password" element={<UserChangePassword/>}/>
        </Route>
        
        <Route path="/Grounds" element={<Bookingslot />} />
        <Route path="/user/grounds/:groundId" element={<GroundDetails />} />
        
{/* =================================================================== ADMIN PANEL ==================================================== */}      
       {/* Admin Login without sidebar */}
       <Route path="/login" element={<AdminLogin />} />
       <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
       <Route path="/admin/reset-password" element={<AdminResetPassword />} />


      {/* Admin Protected */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="games" element={<Games />} />
          <Route path="grounds" element={<Grounds />} />
          <Route path="/admin/grounds/:id" element={<GroundDetailsAdmin />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="addground" element={<AddGround />} />
          
        </Route>
        <Route path="/admin/profile" element={<Profile />} />
      </Route>


{/* =================================================================== SUPER ADMIN LOGIN ==================================================== */}
      <Route path="/super-admin/login" element={<SuperAdminLogin />} />

{/* =================================================================== SUPER ADMIN PANEL ==================================================== */}
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
        <Route path="/super-admin/admins/create" element={<SuperAdminCreateAdmin />} />
        <Route path="grounds" element={<SuperAdminGrounds />} />
        <Route path="bookings" element={<SuperAdminBookings />} />
        <Route path="users/:userId/bookings" element={<SuperAdminUserBook/>}/>
        <Route path="admins/:adminId" element={<SuperAdminAdminDetails />}/>
        <Route path="grounds/:groundId/bookings" element={<SuperAdminGroundsBooking />} />
        <Route path="/super-admin/profile" element={<SuperAdminProfile />} />
      </Route>

    </Routes>

  );
};
