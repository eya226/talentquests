import React from 'react';
import { useGameStore } from '../game-engine/gameStore';
import Badge from '../../components/Badge';

const AchievementWall: React.FC = () => {
  const { achievements } = useGameStore();
  const earnedAchievements = achievements.filter(a => a.earned);

  return (
    <div style={{
      backgroundColor: '#1F2937', // Dark Matter
      padding: '20px',
      borderRadius: '12px',
      color: 'white',
      border: '1px solid #4B5563'
    }}>
      <h3 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: 'bold' }}>
        Recent Achievements
      </h3>
      {earnedAchievements.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {earnedAchievements.map(ach => (
            <Badge key={ach.id} text={`✅ ${ach.name}`} color="green" glow />
          ))}
        </div>
      ) : (
        <p style={{ color: '#9CA3AF' }}>Your achievement wall is waiting for heroic deeds!</p>
      )}
    </div>
  );
};

export default AchievementWall;