import React, { createContext, useContext, useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { supabase } from './supabaseClient';
import LoginPage from './features/auth/pages/LoginPage';
import OnboardingPage from './features/onboarding/pages/OnboardingPage';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import ProfilePage from './features/profile/pages/ProfilePage';

// --- Auth Provider ---
const AuthContext = createContext<{ session: any; loading: boolean } | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- Placeholder Pages ---
const QuestsPage = () => <div className="text-white">Quests Page - Coming Soon!</div>;
const NetworkPage = () => <div className="text-white">Network Page - Coming Soon!</div>;


// --- Layout to protect routes ---
const ProtectedLayout = () => {
    const { session } = useAuth();
    if (!session) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
}

// --- Router ---
const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
        {
            index: true,
            element: <Navigate to="/dashboard" replace />
        },
        {
            path: 'onboarding',
            element: <OnboardingPage />
        },
        {
            path: 'dashboard',
            element: <DashboardPage />
        },
        {
            path: 'profile',
            element: <ProfilePage />
        },
        {
            path: 'quests',
            element: <QuestsPage />
        },
        {
            path: 'network',
            element: <NetworkPage />
        }
    ]
  },
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