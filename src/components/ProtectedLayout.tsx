import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from './Navbar';

const ProtectedLayout = () => {
    const { session, profile, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Or a spinner component
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    // A profile exists but onboarding is not complete
    if (profile && !profile.onboarding_complete) {
        return <Navigate to="/onboarding" replace />;
    }

    // A user exists, but for some reason their profile doesn't (edge case)
    // We send them to onboarding to create it.
    if (!profile) {
        return <Navigate to="/onboarding" replace />;
    }

    // If session and profile are valid, and onboarding is complete, render the main content
    // wrapped with the Navbar.
    return (
        <div>
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default ProtectedLayout;