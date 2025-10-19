import React, { useState } from 'react';
import { supabase } from '../../../supabaseClient';

const LoginPage: React.FC = () => {
  const [role, setRole] = useState<'student' | 'recruiter'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) console.error('Error logging in with Google:', error);
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
    } else {
      alert('Check your email for the confirmation link!');
    }
  };

  return (
    <div className="min-h-screen bg-[#1F2937] text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setRole('student')}
            className={`px-6 py-2 rounded-l-full transition-colors ${
              role === 'student' ? 'bg-[#6D28D9] text-white' : 'bg-gray-700'
            }`}
          >
            I’m a Student
          </button>
          <button
            onClick={() => setRole('recruiter')}
            className={`px-6 py-2 rounded-r-full transition-colors ${
              role === 'recruiter' ? 'bg-[#6D28D9] text-white' : 'bg-gray-700'
            }`}
          >
            I’m a Recruiter
          </button>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Welcome to TalentQuest</h1>
          <p className="text-lg text-gray-400">Your career starts as a game</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-[#0EA5E9] hover:bg-opacity-90 text-white font-bold py-3 rounded-lg transition-transform transform hover:scale-105"
          >
            Sign in with Google
          </button>
          <button
            onClick={() => setShowEmailForm(!showEmailForm)}
            className="w-full text-center text-gray-400 hover:text-white"
          >
            Continue with Email
          </button>
        </div>

        {showEmailForm && (
          <form onSubmit={handleEmailSignIn} className="mt-6 space-y-4 animate-fade-in">
            <input
              type="email"
              placeholder={role === 'recruiter' ? 'Enter your work email' : 'Enter your email'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
              required
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
              required
            />
            <button
              type="submit"
              className="w-full bg-[#6D28D9] hover:bg-opacity-90 text-white font-bold py-3 rounded-lg transition-transform transform hover:scale-105"
            >
              Sign In
            </button>
            <button
              onClick={handleEmailSignUp}
              className="w-full bg-gray-600 hover:bg-opacity-90 text-white font-bold py-3 rounded-lg transition-transform transform hover:scale-105"
            >
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;