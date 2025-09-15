import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute() {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login-student" />;
}

export default PrivateRoute;
