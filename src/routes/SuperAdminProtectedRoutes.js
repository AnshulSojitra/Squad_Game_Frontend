import { Navigate } from "react-router-dom";

export default function SuperAdminProtectedRoute({ children }) {
  const token = localStorage.getItem("superAdminToken");

  if (!token) {
    return <Navigate to="/super-admin/login" replace />;
  }

  return children;
}
