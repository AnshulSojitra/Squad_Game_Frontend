import { Navigate } from "react-router-dom";
import { useBoxArena } from "../context/BoxArenaContext";

export default function SuperAdminProtectedRoute({ children }) {
  const { tokens } = useBoxArena();

  if (!tokens.superAdminToken) {
    return <Navigate to="/super-admin/login" replace />;
  }

  return children;
}
