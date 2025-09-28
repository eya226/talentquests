import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

// Import the page components
import Onboarding from './pages/Onboarding';
import Quest from './pages/Quest';
import Jobs from './pages/Jobs';
import Recruiter from './pages/Recruiter';

// Define the application routes
const router = createBrowserRouter([
  {
    path: '/',
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
    path: '/recruiter',
    element: <Recruiter />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);