import { useAuth } from '../hooks/useAuth';
import { useGameStore } from '../store/gameStore';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';

const DashboardPage = () => {
  const { session } = useAuth();
  const { level, xp, progress, setXP, setProgress } = useGameStore();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome, {session?.user?.email}!</h1>
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
        <h3>Test Controls</h3>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Button onClick={() => setXP(10)}>Gain 10 XP</Button>
            <Button onClick={() => setProgress(progress + 20)}>Increase Progress by 20%</Button>
        </div>
        <p style={{marginTop: '1rem', fontSize: '0.8rem', color: '#666'}}>These are for demonstration purposes.</p>
      </Card>
    </div>
  );
};

export default DashboardPage;