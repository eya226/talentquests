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
    <div className="bg-dark-matter p-5 rounded-xl text-white border border-gray-medium">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{profile?.name || 'Adventurer'}</h2>
        <div className="bg-quantum-purple py-2 px-4 rounded-full font-bold text-lg">
          Level {level}
        </div>
      </div>
      <div>
        <div className="mb-2 flex justify-between text-sm text-gray-400">
            <span>Experience Points</span>
            <span>{xp} / {level * xpForNextLevel}</span>
        </div>
        <ProgressBar value={xpInCurrentLevel} />
      </div>
    </div>
  );
};

export default GameStats;