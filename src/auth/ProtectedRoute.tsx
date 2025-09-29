import React from 'react';
import { useAuth } from './AuthProvider';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles?: ('student' | 'recruiter')[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, profile } = useAuth();

  if (!user) {
    // If user is not logged in, redirect to the auth page
    return <Navigate to="/auth" />;
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    // If user does not have the required role, redirect to their default home page
    // This prevents students from accessing recruiter pages and vice-versa
    return <Navigate to="/" />;
  }

  return <Outlet />; // Render the child route component
};

export default ProtectedRoute;