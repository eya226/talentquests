import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../hooks/useAuth';

const LoginPage = () => {
  const { session } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.error_description || error.message);
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) alert(error.error_description || error.message);
  };

  if (session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="bg-gray-darkest min-h-screen flex items-center justify-center font-sans">
      <div className="w-full max-w-md p-8 space-y-8 bg-dark-matter rounded-xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Log In to TalentQuest</h1>
          <p className="text-gray-light mt-2">Enter your credentials to access your dashboard.</p>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="text-sm font-bold text-gray-light block mb-2">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full p-3 rounded-lg border border-gray-medium bg-gray-dark text-white placeholder-gray-light focus:ring-2 focus:ring-quantum-purple focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-bold text-gray-light block mb-2">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full p-3 rounded-lg border border-gray-medium bg-gray-dark text-white placeholder-gray-light focus:ring-2 focus:ring-quantum-purple focus:border-transparent outline-none"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 px-4 rounded-lg bg-quantum-purple text-white font-bold cursor-pointer hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>
        <div className="flex items-center justify-between">
          <hr className="w-full border-gray-medium" />
          <span className="p-2 text-gray-light">OR</span>
          <hr className="w-full border-gray-medium" />
        </div>
        <button onClick={handleGoogleLogin} disabled={loading} className="w-full py-3 px-4 rounded-lg bg-neon-blue text-white font-bold cursor-pointer hover:bg-sky-600 transition-colors disabled:opacity-50">
          Sign in with Google
        </button>
        <p className="text-center text-gray-light">
          Don't have an account? <Link to="/signup" className="font-bold text-neon-blue hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;