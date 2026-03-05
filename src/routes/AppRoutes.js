import { Routes, Route } from "react-router-dom";
import AdminLogin from "../pages/admin/AdminLogin";
import Dashboard from "../pages/admin/Dashboard";

import Grounds from "../pages/admin/Grounds";
import Bookings from "../pages/admin/Bookings";
import AdminLayout from "../components/layouts/AdminLayout";
import LandingPage from "../pages/Landingpage";
import UserLogin from "../pages/user/UserLogin";
import UserRegister from "../pages/user/UserRegister";
import Mybooking from "../pages/user/Mybooking";
import Bookingslot from "../pages/user/Bookingslot";
import AdminProtectedRoute from "./AdminProtectedRoute";
import ChangePassword from "../pages/admin/ChangePassword";
import AddGround from "../pages/admin/AddGround";
import { Navigate } from "react-router-dom";
import UserProtectedRoute from "./UserProtectedRoute";
import GroundDetails from "../pages/user/GroundDetails";
import PublicLayout from "../components/layouts/PublicLayout";
import Profile from "../pages/admin/Profile";
import UserProfile from "../pages/user/UserProfile";
import AdminForgotPassword from "../pages/admin/AdminForgotPassword";
import AdminResetPassword from "../pages/admin/AdminResetPassword";
import Games from "../pages/user/Games";
import GameDetails from "../pages/user/GameDetails";
import { AdminGames }  from "../pages/admin/AdminGames";
import CreateGames from "../components/games/CreateGames";
import MyCreatedGamesList from "../components/games/MyCreatedGamesList";

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
import SuperAdminGames from "../pages/super-admin/SuperAdminGames";
import SuperAdminGameDetails from "../pages/super-admin/SuperAdminGameDetails";
import GroundDetailsAdmin from "../pages/admin/GroundDetailsAdmin";
import UserProfileLayout from "../components/layouts/UserProfileLayout";
import EditProfile from "../pages/user/EditProfile";
import Feedback from "../pages/user/Feedback";
import MyJoinedGamesList from "../components/games/MyJoinedGames";
import MyJoinedGameDetails from "../pages/user/MyJoinedGameDetails";
import MyCreatedGameDetails from "../pages/user/MyCreatedGameDetails";




export const AppRoutes = () => {
  return (

    <Routes>
      
      <Route element={<PublicLayout />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/grounds" element={<Bookingslot />} />
      <Route path="/user/grounds/:groundId" element={<GroundDetails />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/user/UserRegister" element={<UserRegister />} />
      
      {/* <Route path="/games" element={<Games />} /> */}
      <Route path="/user/games" element={<Games />} />
      <Route path="/games/:gameId" element={<GameDetails />} />
      <Route path="/user/games/:gameId" element={<GameDetails />} />
      <Route path="/user/games" element={<CreateGames />} />
      <Route element={<UserProtectedRoute />}>
      <Route path="/user/mybooking" element={<Mybooking />} />
      </Route>
      </Route>

  
<Route element={<UserProtectedRoute />}>
<Route path="/profile" element={<UserProfileLayout />}>
  <Route path="profile" element={<UserProfile />} />
  <Route path="mybooking" element={<Mybooking />} />
  <Route path="edit" element={<EditProfile />} />
  <Route path="feedback" element={<Feedback />} />
  <Route path="mygames" element={<MyCreatedGamesList />} />
  <Route path="mygames/:gameId" element={<MyCreatedGameDetails />} />
  <Route path="joinedgames" element={<MyJoinedGamesList />} />
  <Route path="joinedgames/:gameId" element={<MyJoinedGameDetails />} />
</Route>
</Route>


{/* =================================================================== USER PANEL ==================================================== */}


        {/* Public */}
        {/* <Route path="/" element={<LandingPage />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/UserRegister" element={<UserRegister />} />
        <Route path="user/forgot-password" element={<UserForgotPassword/>}/>
        <Route path="/user/reset-password/:token" element={<UserResetPassword/>}/> */}

        {/* Public Booking View */}
       
        {/* <Route path="/user/book/:groundId" element={<Bookingslot />} />  */}

        {/* Protected User Area */}
        {/* <Route element={<UserProtectedRoute />}>
          <Route path="/user" element={<UserLayout />}>
            <Route path="home" element={<Home />} />
            <Route path="games" element={<AdminGames />} />
            <Route path="bookingslot" element={<Bookingslot />} />
            <Route path="mybooking" element={<Mybooking />} />
            
          </Route>
          <Route path="/user/profile" element={<UserProfile/>}/>
          <Route path="/user/change-password" element={<UserChangePassword/>}/>
        </Route> */}

        <Route path="/grounds" element={<Bookingslot />} />
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
          <Route path="games" element={<AdminGames />} />
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
        <Route path="games" element={<SuperAdminGames />} />
        <Route path="games/:gameId" element={<SuperAdminGameDetails />} />
        <Route path="bookings" element={<SuperAdminBookings />} />
        <Route path="users/:userId/bookings" element={<SuperAdminUserBook/>}/>
        <Route path="admins/:adminId" element={<SuperAdminAdminDetails />}/>
        <Route path="grounds/:groundId/bookings" element={<SuperAdminGroundsBooking />} />
        <Route path="/super-admin/profile" element={<SuperAdminProfile />} />
      </Route>

    </Routes>

  );
};
