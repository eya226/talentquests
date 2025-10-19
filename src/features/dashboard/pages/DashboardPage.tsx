import React from 'react';
import { Link } from 'react-router-dom';

// --- Reusable BottomNav ---
const BottomNav = () => (
  <nav className="fixed bottom-0 left-0 right-0 bg-[#1F2937] border-t border-gray-700 flex justify-around p-2">
    <Link to="/dashboard" className="text-white">Home</Link>
    <Link to="/quests" className="text-gray-500">Quests</Link>
    <Link to="/network" className="text-gray-500">Network</Link>
    <Link to="/profile" className="text-gray-500">Profile</Link>
  </nav>
);

// --- Mock Job Data ---
const mockJobs = [
  { id: 1, logo: '🏢', title: 'Junior Backend Developer', salary: '3,800 TND/month', match: 88, skills: ['Node.js', 'PostgreSQL'] },
  { id: 2, logo: '🏦', title: 'Frontend Developer', salary: '4,200 TND/month', match: 92, skills: ['React', 'TypeScript', 'Tailwind'] },
  { id: 3, logo: '🚀', title: 'DevOps Engineer', salary: '5,500 TND/month', match: 75, skills: ['Docker', 'Kubernetes', 'AWS'] },
];

// --- Job Card Component ---
const JobCard = ({ job }: { job: typeof mockJobs[0] }) => (
  <div className="bg-white text-black p-4 rounded-lg border-2 border-[#6D28D9] mb-4">
    <div className="flex items-center mb-2">
      <span className="text-2xl mr-4">{job.logo}</span>
      <div>
        <h3 className="font-bold">{job.title}</h3>
        <p className="text-gray-600">{job.salary}</p>
      </div>
      <div className="ml-auto text-right">
        <p className={`font-bold ${job.match >= 85 ? 'text-yellow-500' : ''}`}>{job.match}% Match</p>
      </div>
    </div>
    <div className="flex flex-wrap gap-2 mb-4">
      {job.skills.map(skill => <span key={skill} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">{skill}</span>)}
    </div>
    <button className="w-full bg-[#6D28D9] text-white font-bold py-2 rounded-lg">Apply</button>
  </div>
);

// --- Dashboard Page ---
const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#1F2937] text-white p-4 pb-16">
      {/* Sticky Header */}
      <header className="sticky top-0 bg-[#1F2937] py-4 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Jobs for You</h1>
          <div className="flex items-center">
            <div className="w-40 bg-gray-700 rounded-full h-4 mr-4">
              <div className="bg-[#0EA5E9] h-4 rounded-full" style={{ width: '10%' }}></div>
            </div>
            <span className="font-mono text-sm">Lv. 1</span>
          </div>
        </div>
      </header>

      {/* Job Feed */}
      <main className="mt-4">
        {mockJobs.map(job => <JobCard key={job.id} job={job} />)}
      </main>

      <BottomNav />
    </div>
  );
};

export default DashboardPage;