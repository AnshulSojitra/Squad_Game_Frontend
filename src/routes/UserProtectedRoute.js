import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useBoxArena } from "../context/BoxArenaContext";

export default function UserProtectedRoute() {
  const { tokens } = useBoxArena();
  const location = useLocation();

  if (!tokens.userToken) {
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
