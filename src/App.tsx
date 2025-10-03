import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import AriaOnboardingPage from './pages/AriaOnboardingPage';
import ProtectedLayout from './components/ProtectedLayout';
import AuthGuard from './components/AuthGuard';

// --- Router ---
const router = createBrowserRouter([
  {
    path: '/signup',
    element: <SignUpPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/onboarding',
    element: <AuthGuard />, // Ensures user is logged in to access onboarding
    children: [
        {
            index: true,
            element: <AriaOnboardingPage />
        }
    ]
  },
  {
    path: '/',
    element: <ProtectedLayout />, // Checks for both auth and onboarding status
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
    ],
  },
   {
    path: '*',
    element: <Navigate to="/" replace />,
  }
]);

// --- Main App Component ---
const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;