import React from 'react';
import { useAuth } from '../auth/AuthProvider';
import { Navigate, Outlet } from 'react-router-dom';

const Root = () => {
  const { session, loading, profile } = useAuth();

  if (loading) {
    return <div className="bg-gray-900 min-h-screen" />; // Or a loading spinner
  }

  if (!session) {
    return <Navigate to="/auth" />;
  }

  if (profile?.role === 'recruiter') {
    return <Navigate to="/recruiter-dashboard" />;
  }

  // If student is onboarded, maybe go to a student dashboard. For now, quest is fine.
  if (profile?.archetype) {
     return <Navigate to="/jobs" />;
  }

  // Default for a new student is the onboarding flow.
  if(profile?.role === 'student' && !profile?.archetype) {
    return <Navigate to="/onboarding" />;
  }

  return <Outlet />;
};

export default Root;