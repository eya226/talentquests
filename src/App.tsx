import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';

// Import pages & layouts
import Root from './pages/Root';
import Home from './pages/Home';
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
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '/',
    element: <Root />, // The Root component now acts as the gatekeeper
    children: [
      {
        index: true, // The Home component will render at the root path and handle redirection
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