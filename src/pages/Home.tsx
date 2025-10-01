import React from 'react';
import { useAuth } from '../auth/AuthProvider';
import { Navigate } from 'react-router-dom';

const Home = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    // This should be handled by the Root layout, but as a fallback.
    return <Navigate to="/auth" replace />;
  }

  if (profile.role === 'recruiter') {
    return <Navigate to="/recruiter-dashboard" replace />;
  }

  // Default to student flow. If their profile is built, send them to jobs.
  if (profile.archetype) {
    return <Navigate to="/jobs" replace />;
  }

  // If they are a new student, send them to onboarding.
  return <Navigate to="/onboarding" replace />;
};

export default Home;