import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRoleHomePath, hasRoleAccess } from '../utils/roleRoutes';

/**
 * Protected route component with role-based access control
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string[]} [props.allowedRoles] - Optional array of roles allowed to access this route
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const token = localStorage.getItem('token');

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // No token = redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // No user loaded yet but has token = still loading
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check role-based access if allowedRoles is specified
  if (allowedRoles && !hasRoleAccess(user.role_name, allowedRoles)) {
    // Redirect to user's own dashboard if they try to access unauthorized route
    const userHomePath = getRoleHomePath(user.role_name);
    return <Navigate to={userHomePath} replace />;
  }

  return children;
}
