import { useAuth } from '../hooks/useAuth';
import { useGameStore } from '../store/gameStore';
import { supabase } from '../lib/supabaseClient';

const DashboardPage = () => {
  const { session } = useAuth();
  const { level, xp, progress, setXP, setProgress } = useGameStore();

  return (
    <div style={{ padding: '2rem' }}>
        <div>
            <h1>Welcome, {session?.user?.email}!</h1>
            <p>Your adventure begins now. Here are your stats:</p>
        </div>
        <div>
            <h2>Your Hero Stats</h2>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Level:</strong> {level}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>XP:</strong> {xp}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Quest Progress:</strong>
              {/* Using a simple div for now, will replace with ProgressBar component later */}
              <div style={{ width: '100%', backgroundColor: '#e9ecef', borderRadius: '0.25rem' }}>
                <div style={{ width: `${progress}%`, backgroundColor: '#007bff', height: '20px', lineHeight: '20px', color: 'white', textAlign: 'center', borderRadius: '0.25rem' }}>
                  {progress}%
                </div>
              </div>
            </div>
            <hr />
            <h3>Test Controls (for demonstration)</h3>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={() => setXP(10)}>Gain 10 XP</button>
                <button onClick={() => setProgress(progress >= 100 ? 0 : progress + 20)}>Increase Progress</button>
            </div>
        </div>
        <div style={{ marginTop: '2rem' }}>
            <button onClick={() => supabase.auth.signOut()}>
                Sign Out
            </button>
        </div>
    </div>
  );
};

export default DashboardPage;