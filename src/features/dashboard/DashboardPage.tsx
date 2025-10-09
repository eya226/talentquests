import React from 'react';
import { supabase } from '../../lib/supabaseClient';
import GameStats from './GameStats';
import QuestLog from './QuestLog';
import AchievementWall from './AchievementWall';
import { useGameStore } from '../game-engine/gameStore';

const DashboardPage = () => {
    const { addXP } = useGameStore();

    return (
        <div style={{
            backgroundColor: '#111827', // gray-900
            color: 'white',
            minHeight: '100vh',
            padding: '32px',
            fontFamily: 'sans-serif'
        }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>TalentQuest Dashboard</h1>
                <button
                    onClick={() => supabase.auth.signOut()}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '1px solid #4B5563',
                        backgroundColor: '#374151',
                        color: 'white',
                        cursor: 'pointer'
                    }}
                >
                    Sign Out
                </button>
            </header>

            <main style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
                <div style={{ gridColumn: 'span 3' }}>
                    <GameStats />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                    <QuestLog />
                </div>

                <div>
                    <AchievementWall />
                </div>
            </main>

            {/* Temporary controls for testing */}
            <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#1F2937', borderRadius: '12px' }}>
                <h3 style={{marginBottom: '16px'}}>Dev Controls</h3>
                <button onClick={() => addXP(15)} style={{padding: '8px 12px', borderRadius: '8px', border: 'none', backgroundColor: '#0EA5E9', color: 'white', cursor: 'pointer'}}>
                    Add 15 XP
                </button>
            </div>
        </div>
    );
};

export default DashboardPage;