import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';

// Import pages & layouts
import Root from './pages/Root';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import Quest from './pages/Quest';
import Jobs from './pages/Jobs';
import RecruiterDashboard from './pages/RecruiterDashboard';
import JobApplicants from './pages/JobApplicants';
import ApplicantProfile from './pages/ApplicantProfile';
import ProfilePage from './pages/ProfilePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      // Protected routes will be rendered through the Outlet in Root
      // The Root component will handle redirection for unauthenticated users
      // and role-based redirection for authenticated users.
    ],
  },
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '/onboarding',
    element: <Onboarding />,
  },
  {
    path: '/quest',
    element: <Quest />,
  },
  {
    path: '/jobs',
    element: <Jobs />,
  },
  {
    path: '/recruiter-dashboard',
    element: <RecruiterDashboard />,
  },
  {
    path: '/jobs/:jobId/applicants',
    element: <JobApplicants />,
  },
  {
    path: '/profile/:applicantId',
    element: <ApplicantProfile />,
  },
  {
      path: '/profile',
      element: <ProfilePage />,
  }
]);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;