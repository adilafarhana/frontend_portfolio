import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

/**
 * ProtectedRoute — wraps admin-only pages.
 * If user is logged in, renders children; otherwise redirects to /admin/login.
 */
const ProtectedRoute = ({ children }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
