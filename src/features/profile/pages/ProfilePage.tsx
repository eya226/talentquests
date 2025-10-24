import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../App';
import './ProfilePage.css'; // For custom animations

// --- Reusable BottomNav ---
const BottomNav = () => (
  <nav className="fixed bottom-0 left-0 right-0 bg-[#1F2937] border-t border-gray-700 flex justify-around p-2">
    <Link to="/dashboard" className="text-gray-500">Home</Link>
    <Link to="/quests" className="text-gray-500">Quests</Link>
    <Link to="/network" className="text-gray-500">Network</Link>
    <Link to="/profile" className="text-white">Profile</Link>
  </nav>
);

// --- Profile Page ---
const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  const { level = 1, xp = 0, skills = [], achievements = [], traits = [], vision = {} } = user;
  const xpToNextLevel = 1000;
  const title = 'Bug Hunter'; // Placeholder

  return (
    <div className="min-h-screen bg-[#1F2937] text-white p-4 pb-20">
      <header className="text-center py-6">
        <h1 className="text-2xl font-bold">{title} • Level {level}</h1>
        <p className="text-gray-400">{xp} Total XP • {xp}/{xpToNextLevel} to next level</p>
        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
          <div className="bg-neon-blue h-2.5 rounded-full" style={{ width: `${(xp / xpToNextLevel) * 100}%` }}></div>
        </div>
      </header>

      <section className="my-6">
        <h2 className="text-xl font-semibold mb-3">Your Skills</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill: string) => (
            <span key={skill} className="bg-gray-800 border border-gray-600 text-white px-3 py-1 rounded-full">💡 {skill}</span>
          ))}
        </div>
      </section>

      <section className="my-6">
        <h2 className="text-xl font-semibold mb-3">Achievements</h2>
        <div className="achievement-carousel">
          {achievements.map((ach: any) => (
            <div key={ach.name} className="achievement-card">
              <span className="text-4xl">{ach.icon}</span>
              <p className="font-bold mt-1">{ach.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="my-6">
        <h2 className="text-xl font-semibold mb-3">Your Traits</h2>
        <div className="flex flex-wrap gap-2">
          {traits.map((trait: string) => (
            <span key={trait} className="bg-gray-800 border border-gray-600 text-white px-3 py-1 rounded-full">🧬 {trait}</span>
          ))}
        </div>
      </section>

      <section className="my-6">
        <h2 className="text-xl font-semibold mb-3">Your Vision</h2>
        <div className="bg-gray-800 p-4 rounded-lg">
          <p><strong>Dream Companies:</strong> {vision.companies?.join(', ')}</p>
          <p><strong>Salary Goal:</strong> {vision.salaryGoal} TND/month</p>
        </div>
      </section>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
