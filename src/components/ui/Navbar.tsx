import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabaseClient';
import Button from './Button';
import './Navbar.css';

const Navbar = () => {
  const { session } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">TalentQuest</Link>
      </div>
      <div className="navbar-links">
        {session ? (
          <>
            <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>Dashboard</Link>
            <Link to="/profile" style={{ textDecoration: 'none', color: '#333' }}>Profile</Link>
            <span style={{ fontStyle: 'italic' }}>{session.user.email}</span>
            <Button onClick={() => supabase.auth.signOut()} variant="secondary">
              Sign Out
            </Button>
          </>
        ) : (
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;