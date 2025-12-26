import { Navigate, Outlet } from "react-router-dom";

export default function AdminProtectedRoute() {
  const adminToken = localStorage.getItem("adminToken");
  // OR: const admin = JSON.parse(localStorage.getItem("admin"));

  if (!adminToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
