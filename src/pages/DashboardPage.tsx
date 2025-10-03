import { useAuth } from '../hooks/useAuth';
import { useGameStore } from '../store/gameStore';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabaseClient';

const DashboardPage = () => {
  const { session } = useAuth();
  const { level, xp, progress, setXP, setProgress } = useGameStore();

  return (
    <div style={{ padding: '2rem' }}>
        <Card>
            <h1>Welcome, {session?.user?.email}!</h1>
            <p>You are logged in and ready to start your adventure.</p>
        </Card>
        <Card>
            <h2>Your Hero Stats</h2>
            <div style={{ marginBottom: '1rem' }}>
            <strong>Level:</strong> {level}
            </div>
            <div style={{ marginBottom: '1rem' }}>
            <strong>XP:</strong> {xp}
            </div>
            <div style={{ marginBottom: '1rem' }}>
            <strong>Quest Progress:</strong>
            <ProgressBar progress={progress} />
            </div>
            <hr />
            <h3>Test Controls (for demonstration)</h3>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Button onClick={() => setXP(10)}>Gain 10 XP</Button>
                <Button onClick={() => setProgress(progress >= 100 ? 0 : progress + 20)}>Increase Progress</Button>
            </div>
        </Card>
         <Card>
            <Button onClick={() => supabase.auth.signOut()} variant='danger'>
                Sign Out
            </Button>
        </Card>
    </div>
  );
};

export default DashboardPage;