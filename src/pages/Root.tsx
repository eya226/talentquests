import React from 'react';
import { useAuth } from '../auth/AuthProvider';
import { Navigate, Outlet } from 'react-router-dom';

const Root = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  // If a session exists, render the requested protected route via the Outlet.
  // The redirection logic for the root path '/' will be handled by the Home component.
  return <Outlet />;
};

export default Root;