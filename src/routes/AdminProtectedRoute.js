import { Navigate, Outlet } from "react-router-dom";
import { useBoxArena } from "../context/AppDataContext";

export default function AdminProtectedRoute() {
  const { tokens } = useBoxArena();

  if (!tokens.adminToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

