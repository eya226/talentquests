import React from 'react';
import { useAuth } from './AuthProvider';
import { Navigate, Outlet } from 'react-router-dom';

const Layout = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!session) {
    // If there is no active session, redirect the user to the login page.
    return <Navigate to="/login" replace />;
  }

  // If a session exists, render the child route (the protected page).
  return <Outlet />;
};

export default Layout;