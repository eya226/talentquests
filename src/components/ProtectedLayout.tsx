import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedLayout = () => {
    const { session, profile, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Or a spinner component
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    // Now that the profile is available, we can check the onboarding status.
    // A profile exists but onboarding is not complete
    if (profile && !profile.onboarding_complete) {
        return <Navigate to="/onboarding" replace />;
    }

    // A user exists, but for some reason their profile doesn't (edge case)
    // We send them to onboarding to create it.
    if (!profile) {
        return <Navigate to="/onboarding" replace />;
    }

    // If session and profile are valid, and onboarding is complete, render the main content.
    return <Outlet />;
}

export default ProtectedLayout;