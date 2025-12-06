import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRoleHomePath } from '../utils/roleRoutes';

/**
 * Redirects users to their role-specific dashboard
 * Used for the root "/" route
 */
export default function RoleBasedRedirect() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const rolePath = getRoleHomePath(user.role_name);
    return <Navigate to={rolePath} replace />;
}
