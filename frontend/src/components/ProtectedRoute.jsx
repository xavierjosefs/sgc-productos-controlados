import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // TODO: Remove this bypass before production
  const DEVELOPMENT_BYPASS = true;
  
  if (DEVELOPMENT_BYPASS) {
    return children;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
