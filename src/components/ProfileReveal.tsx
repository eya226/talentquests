import React from 'react';

interface ProfileData {
    archetype: string;
    skills: Record<string, number>;
    values: string[];
    vision_board: Record<string, any>;
}

// A single animated card component
const InfoCard = ({ title, value, delay }: { title: string, value: string, delay: number }) => (
  <div
    className="bg-gray-800 p-6 rounded-lg shadow-lg animate-fade-in-up"
    style={{ animationDelay: `${delay}ms` }}
  >
    <h3 className="text-blue-400 text-sm font-bold uppercase tracking-wider">{title}</h3>
    <p className="text-white text-xl font-semibold mt-1">{value}</p>
  </div>
);

const ProfileReveal = ({ profile, onBeginQuest, isLoading }: { profile: ProfileData, onBeginQuest: () => void, isLoading: boolean }) => {
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col justify-center items-center p-4 text-center">
      <div className="animate-fade-in-up">
        <h1 className="text-5xl font-bold text-white mb-2">Here’s who you are.</h1>
        <p className="text-xl text-gray-400 mb-10">Your generated Digital Identity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        <div
            className="md:col-span-2 lg:col-span-1 bg-gray-800 p-6 rounded-lg shadow-lg animate-fade-in-up"
            style={{ animationDelay: '200ms'}}
        >
            <h3 className="text-blue-400 text-sm font-bold uppercase tracking-wider">Archetype</h3>
            <p className="text-white text-4xl font-bold mt-1">{profile.archetype}</p>
        </div>

        <InfoCard title="Top Skills" value={Object.keys(profile.skills).join(', ') || 'Emerging...'} delay={400} />
        <InfoCard title="Core Values" value={profile.values.join(', ') || 'Discovering...'} delay={600} />
      </div>

      <div
        className="mt-8 animate-fade-in-up"
        style={{ animationDelay: '800ms' }}
      >
        <button
          onClick={onBeginQuest}
          disabled={isLoading}
          className="bg-green-500 text-white font-bold py-4 px-8 rounded-full text-lg hover:bg-green-600 transition-transform transform hover:scale-105 glow-on-hover disabled:bg-gray-500"
        >
          {isLoading ? 'Saving...' : 'Begin Your First Quest'}
        </button>
      </div>
    </div>
  );
};

// Add animations to stylesheet
const styles = `
@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
  opacity: 0; /* Start hidden */
}
.glow-on-hover {
  box-shadow: 0 0 8px #10B981, 0 0 16px #10B981;
}
`;
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default ProfileReveal;