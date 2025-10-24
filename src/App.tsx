import React, { createContext, useContext, useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet, useLocation } from 'react-router-dom';
import apiClient from './lib/apiClient';
import LoginPage from './features/auth/pages/LoginPage';
import OnboardingPage from './features/onboarding/pages/OnboardingPage';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import ProfilePage from './features/profile/pages/ProfilePage';

// --- Auth Context ---
const AuthContext = createContext<any>(null);

// --- Auth Provider ---
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await apiClient.get('/profile');
        setUser(res.data);
      } catch (err) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    await loadUser();
  };

  const signup = async (email, password, role) => {
    await apiClient.post('/auth/signup', { email, password, role });
    // After signup, the user should log in
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, loadUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// --- Placeholder Pages ---
const QuestsPage = () => <div className="text-white">Quests Page - Coming Soon!</div>;
const NetworkPage = () => <div className="text-white">Network Page - Coming Soon!</div>;

// --- Layout to protect routes ---
const ProtectedLayout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="bg-[#1F2937] min-h-screen text-white">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the user hasn't completed onboarding, redirect them to the onboarding page.
  // This prevents a redirect loop by checking if they are already on the onboarding page.
  if (!user.onboarding_complete && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
};

// --- Router ---
const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'onboarding', element: <OnboardingPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'quests', element: <QuestsPage /> },
      { path: 'network', element: <NetworkPage /> },
    ],
  },
]);

// --- Main App Component ---
const App = () => (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

export default App;
