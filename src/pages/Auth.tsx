import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Default role
  const [isLogin, setIsLogin] = useState(true);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // The AuthProvider will handle the redirect, no alert needed.
      } else {
        // Sign up with role metadata
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: role,
            }
          }
        });
        if (error) throw error;
        alert('Signed up successfully! Please check your email to verify.');
      }
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>
        {isLogin ? 'Welcome Back' : 'Join TalentQuest'}
      </h1>
      <form onSubmit={handleAuthAction}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        {!isLogin && (
          <div>
            <label htmlFor="role">I am a</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
        </button>
      </form>
      <div>
        <button onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account? Sign Up' : 'Have an account? Log In'}
        </button>
      </div>
    </div>
  );
};

export default Auth;