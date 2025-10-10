import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';

const Navbar: React.FC = () => {
  const { session, profile } = useAuth();

  return (
    <nav className="bg-dark-matter p-4 px-8 border-b border-gray-medium flex justify-between items-center text-white">
      <Link to="/" className="text-2xl font-bold text-white no-underline">
        TalentQuest
      </Link>
      <div>
        {session ? (
          <div className="flex items-center gap-4">
            <span>Welcome, {profile?.name || 'Adventurer'}!</span>
            <button
              onClick={() => supabase.auth.signOut()}
              className="py-2 px-3 rounded-lg border-none bg-quantum-purple text-white cursor-pointer hover:bg-purple-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link to="/login" className="text-white no-underline hover:text-gray-light transition-colors">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;