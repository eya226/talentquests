import React, { createContext, useContext, useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { supabase } from './supabaseClient'; // We'll create this next

// --- Auth Provider ---
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
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

export const useAuth = () => useContext(AuthContext);

// --- Pages ---
const LoginPage = () => {
  const { session } = useAuth();
  const [email, setEmail] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password: 'password' }); // Using a dummy password for simplicity
      if (error) throw error;
    } catch (error) {
      alert(error.error_description || error.message);
    }
  };

  if (session) {
    return <Navigate to="/" replace />;
  }

  return (
    <form onSubmit={handleLogin}>
      <h1>Login</h1>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
      <button type="submit">Log In</button>
       <p> (Use 'password' as the password for any test user) </p>
    </form>
  );
};

const DashboardPage = () => {
  const { session } = useAuth();
  return (
    <div>
      <h1>Welcome!</h1>
      <p>You are logged in as {session?.user?.email}</p>
      <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
    </div>
  );
};

// --- Layout to protect routes ---
const ProtectedLayout = () => {
    const { session } = useAuth();

    if (!session) {
        return <Navigate to="/login" replace/>;
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
            element: <DashboardPage/>
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