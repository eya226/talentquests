import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AuthGuard = () => {
    const { session, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!session) {
        return <Navigate to="/signup" replace />;
    }

    return <Outlet />;
};

export default AuthGuard;