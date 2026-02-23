/**
 * ProtectedRoute — Auth guard wrapper for routes.
 * Redirects to /login if not authenticated.
 * Optional `requiredRole` prop for admin-only pages.
 */
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Show nothing while restoring session
    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
        );
    }

    // Not logged in → redirect to login
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Wrong role → redirect to dashboard
    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
