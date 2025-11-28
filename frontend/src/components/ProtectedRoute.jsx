import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // ⚠️ BYPASS DE DESARROLLO - Permitir acceso sin autenticación en modo desarrollo
  // TODO: REMOVER antes de merge a production
  if (import.meta.env.DEV) {
    return children;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
