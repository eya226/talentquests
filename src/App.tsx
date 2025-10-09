import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import LoginPage from './features/auth/LoginPage';
import SignUpPage from './features/auth/SignUpPage';
import DashboardPage from './features/dashboard/DashboardPage';
import AIChatFlow from './features/onboarding/AIChatFlow';
import ProtectedLayout from './components/ProtectedLayout';
import AuthGuard from './features/auth/AuthGuard';

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
            element: <AIChatFlow />
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