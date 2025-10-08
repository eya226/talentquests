import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * This is a temporary layout that only checks for authentication.
 * The onboarding check has been removed to prevent the application from crashing
 * due to the missing 'profiles' table on the user's end.
 *
 * This allows the user to access the main application while the database setup is pending.
 */
const ProtectedLayout = () => {
    const { session, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!session) {
        return <Navigate to="/signup" replace />;
    }

    // Temporarily removed the onboarding check to prevent crashes.
    // The original logic was:
    // if (!profile?.onboarding_complete) {
    //     return <Navigate to="/onboarding" replace />;
    // }

    return <Outlet />;
}

export default ProtectedLayout;