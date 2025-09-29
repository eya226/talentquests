import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import ProtectedRoute from './auth/ProtectedRoute';

// Import pages
import Auth from './pages/Auth';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import Quest from './pages/Quest';
import Jobs from './pages/Jobs';
import RecruiterDashboard from './pages/RecruiterDashboard';
import JobApplicants from './pages/JobApplicants';
import ApplicantProfile from './pages/ApplicantProfile';
import ProfilePage from './pages/ProfilePage';

const router = createBrowserRouter([
  // Public routes
  {
    path: '/auth',
    element: <Auth />,
  },
  // Protected routes
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        index: true, // This will be the default child route for '/'
        element: <Home />,
      },
      {
        path: 'onboarding',
        element: <ProtectedRoute allowedRoles={['student']} />,
        children: [{ index: true, element: <Onboarding /> }],
      },
      {
        path: 'quest',
        element: <ProtectedRoute allowedRoles={['student']} />,
        children: [{ index: true, element: <Quest /> }],
      },
      {
        path: 'jobs',
        element: <ProtectedRoute allowedRoles={['student']} />,
        children: [{ index: true, element: <Jobs /> }],
      },
      {
        path: 'recruiter-dashboard',
        element: <ProtectedRoute allowedRoles={['recruiter']} />,
        children: [{ index: true, element: <RecruiterDashboard /> }],
      },
      {
        path: 'jobs/:jobId/applicants',
        element: <ProtectedRoute allowedRoles={['recruiter']} />,
        children: [{ index: true, element: <JobApplicants /> }],
      },
      {
        path: 'profile/:applicantId',
        element: <ProtectedRoute allowedRoles={['recruiter']} />,
        children: [{ index: true, element: <ApplicantProfile /> }],
      },
      {
        path: 'profile',
        element: <ProtectedRoute allowedRoles={['student']} />,
        children: [{ index: true, element: <ProfilePage /> }],
      }
    ],
  },
]);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;