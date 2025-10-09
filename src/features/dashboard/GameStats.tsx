import React from 'react';
import { useGameStore } from '../game-engine/gameStore';
import { useAuth } from '../../hooks/useAuth';
import ProgressBar from '../../components/ProgressBar';

const GameStats: React.FC = () => {
  const { profile } = useAuth();
  const { level, xp } = useGameStore();

  const xpForNextLevel = 100; // Each level requires 100 XP
  const xpInCurrentLevel = xp % xpForNextLevel;

  return (
    <div style={{
      backgroundColor: '#1F2937', // Dark Matter
      padding: '20px',
      borderRadius: '12px',
      color: 'white',
      border: '1px solid #4B5563'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>{profile?.name || 'Adventurer'}</h2>
        <div style={{
            backgroundColor: '#6D28D9', // Quantum Purple
            padding: '8px 16px',
            borderRadius: '16px',
            fontWeight: 'bold',
            fontSize: '18px'
        }}>
          Level {level}
        </div>
      </div>
      <div>
        <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#9CA3AF' }}>
            <span>Experience Points</span>
            <span>{xp} / {level * xpForNextLevel}</span>
        </div>
        <ProgressBar value={xpInCurrentLevel} />
      </div>
    </div>
  );
};

export default GameStats;