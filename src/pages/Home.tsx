import React from 'react';
import { useAuth } from '../auth/AuthProvider';
import { Navigate } from 'react-router-dom';

const Home = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return <div className="bg-gray-900 min-h-screen" />;
  }

  if (!profile) {
    // This case should ideally not be hit if protected, but as a fallback
    return <Navigate to="/auth" />;
  }

  // Redirect user based on their role
  if (profile.role === 'recruiter') {
    return <Navigate to="/recruiter-dashboard" />;
  }

  // Default to student onboarding/dashboard
  return <Navigate to="/onboarding" />;
};

export default Home;