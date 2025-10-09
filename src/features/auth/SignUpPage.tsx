import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../hooks/useAuth';

const SignUpPage = () => {
  const { session } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'recruiter'>('student');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      alert(authError.error_description || authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          role: role,
          name: email.split('@')[0], // Default name to email prefix
        });

      if (profileError) {
        alert(`Error creating profile: ${profileError.message}`);
      } else {
        alert('Success! Check your email for the confirmation link.');
      }
    }
    setLoading(false);
  };

  if (session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <h1>Create Your Account</h1>
      <form onSubmit={handleSignUp}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
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
            placeholder="Create a password"
            required
          />
        </div>
        <div>
          <label htmlFor="role">I am a:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as 'student' | 'recruiter')}
            required
          >
            <option value="student">Student</option>
            <option value="recruiter">Recruiter</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Log In</Link>
      </p>
    </div>
  );
};

export default SignUpPage;