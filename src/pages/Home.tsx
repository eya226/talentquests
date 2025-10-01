import React from 'react';
import { useAuth } from '../auth/AuthProvider';
import { Navigate } from 'react-router-dom';

const Home = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    // This should theoretically not be hit if Layout works, but as a safeguard.
    return <Navigate to="/login" replace />;
  }

  if (profile.role === 'recruiter') {
    return <Navigate to="/recruiter-dashboard" replace />;
  }

  // Default to student flow.
  // If their profile is built (i.e., they have an archetype), send them to the job board.
  if (profile.archetype) {
    return <Navigate to="/jobs" replace />;
  }

  // If they are a new student without a profile, send them to onboarding.
  return <Navigate to="/onboarding" replace />;
};

export default Home;