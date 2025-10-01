import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';

// Import pages & layouts
import Layout from './auth/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import Quest from './pages/Quest';
import Jobs from './pages/Jobs';
import RecruiterDashboard from './pages/RecruiterDashboard';
import JobApplicants from './pages/JobApplicants';
import ApplicantProfile from './pages/ApplicantProfile';
import ProfilePage from './pages/ProfilePage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <Layout />, // The Layout component is the gatekeeper for all protected routes
    children: [
      {
        index: true, // The Home component renders at '/' for logged-in users and handles redirection
        element: <Home />,
      },
      {
        path: 'onboarding',
        element: <Onboarding />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'quest',
        element: <Quest />,
      },
      {
        path: 'jobs',
        element: <Jobs />,
      },
      {
        path: 'recruiter-dashboard',
        element: <RecruiterDashboard />,
      },
      {
        path: 'jobs/:jobId/applicants',
        element: <JobApplicants />,
      },
      {
        path: 'profile/:applicantId',
        element: <ApplicantProfile />,
      },
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