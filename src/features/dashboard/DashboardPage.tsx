import React from 'react';
import GameStats from './GameStats';
import QuestLog from './QuestLog';
import AchievementWall from './AchievementWall';
import { useGameStore } from '../game-engine/gameStore';

const DashboardPage = () => {
    const { addXP } = useGameStore();

    return (
        <div className="bg-gray-darkest text-white min-h-screen p-8 font-sans">
            {/* The Navbar is now rendered in ProtectedLayout, so the header is removed */}
            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-3">
                    <GameStats />
                </div>

                <div className="lg:col-span-2">
                    <QuestLog />
                </div>

                <div>
                    <AchievementWall />
                </div>
            </main>

            {/* Temporary controls for testing */}
            <div className="mt-10 p-5 bg-dark-matter rounded-xl">
                <h3 className="mb-4 font-bold">Dev Controls</h3>
                <button
                    onClick={() => addXP(15)}
                    className="py-2 px-3 rounded-lg border-none bg-neon-blue text-white cursor-pointer hover:bg-sky-600 transition-colors"
                >
                    Add 15 XP
                </button>
            </div>
        </div>
    );
};

export default DashboardPage;