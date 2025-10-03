import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedLayout = () => {
    const { session } = useAuth();

    if (!session) {
        return <Navigate to="/login" replace/>;
    }

    return <Outlet />;
}

export default ProtectedLayout;