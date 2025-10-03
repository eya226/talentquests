import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const LoginPage = () => {
  const { session } = useAuth();
  const [email, setEmail] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password: 'password' }); // Using a dummy password for simplicity
      if (error) throw error;
    } catch (error: any) {
      alert(error.error_description || error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (error: any) {
      alert(error.error_description || error.message);
    }
  };

  if (session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <Card>
        <form onSubmit={handleLogin}>
          <h1 style={{ textAlign: 'center' }}>TalentQuest</h1>
          <div style={{ marginBottom: '1rem' }}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}/>
          </div>
          <Button type="submit" style={{ width: '100%' }}>
            Log In with Email
          </Button>
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#6c757d' }}>(Use 'password' as the password for any test user)</p>
        </form>
        <hr style={{ margin: '1rem 0' }} />
        <Button onClick={handleGoogleLogin} variant="secondary" style={{ width: '100%' }}>
          Sign in with Google
        </Button>
      </Card>
    </div>
  );
};

export default LoginPage;