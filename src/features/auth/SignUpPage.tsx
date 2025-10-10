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

    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });

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
    <div className="bg-gray-darkest min-h-screen flex items-center justify-center font-sans">
      <div className="w-full max-w-md p-8 space-y-8 bg-dark-matter rounded-xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Create Your Account</h1>
          <p className="text-gray-light mt-2">Join the quest and build your future.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSignUp}>
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
              placeholder="Create a password"
              required
              className="w-full p-3 rounded-lg border border-gray-medium bg-gray-dark text-white placeholder-gray-light focus:ring-2 focus:ring-quantum-purple focus:border-transparent outline-none"
            />
          </div>
           <div>
            <label htmlFor="role" className="text-sm font-bold text-gray-light block mb-2">I am a:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'student' | 'recruiter')}
              required
              className="w-full p-3 rounded-lg border border-gray-medium bg-gray-dark text-white focus:ring-2 focus:ring-quantum-purple focus:border-transparent outline-none"
            >
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 px-4 rounded-lg bg-quantum-purple text-white font-bold cursor-pointer hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center text-gray-light">
          Already have an account? <Link to="/login" className="font-bold text-neon-blue hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;