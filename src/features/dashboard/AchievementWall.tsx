import React from 'react';
import { useGameStore } from '../game-engine/gameStore';
import Badge from '../../components/Badge';

const AchievementWall: React.FC = () => {
  const { achievements } = useGameStore();
  const earnedAchievements = achievements.filter(a => a.earned);

  return (
    <div className="bg-dark-matter p-5 rounded-xl text-white border border-gray-medium h-full">
      <h3 className="mb-4 text-xl font-bold">
        Recent Achievements
      </h3>
      {earnedAchievements.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {earnedAchievements.map(ach => (
            <Badge key={ach.id} text={`✅ ${ach.name}`} color="green" glow />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">Your achievement wall is waiting for heroic deeds!</p>
      )}
    </div>
  );
};

export default AchievementWall;