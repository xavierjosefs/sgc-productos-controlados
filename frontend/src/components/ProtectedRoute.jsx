import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // Bypass temporal para desarrollo - QUITAR ANTES DE PRODUCCIÓN
  if (import.meta.env.DEV) {
    return children;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
