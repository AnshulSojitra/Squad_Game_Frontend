import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function UserProtectedRoute() {
  const token = localStorage.getItem("userToken");
  const location = useLocation();

  if (!token) {
    return (
      <Navigate
        to="/user/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <Outlet />;
}
