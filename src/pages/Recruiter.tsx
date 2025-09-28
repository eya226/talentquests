import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Recruiter = () => {
  const [invited, setInvited] = useState(false);

  const handleInvite = () => {
    setInvited(true);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-2xl border border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-purple-300 mb-4">Talent War Room: EdTech Tunisia</h1>

        <div className="bg-gray-900 rounded-lg p-6 relative">
          <div className="flex items-center space-x-4">
            {/* Placeholder for Youssef's avatar */}
            <div className="w-16 h-16 bg-purple-500 rounded-full flex-shrink-0"></div>
            <div>
              <h2 className="text-xl font-bold">Youssef from Gabès</h2>
              <p className="text-gray-400">CS Student, University of Gabès</p>
            </div>
          </div>

          <div className="absolute top-6 right-6 bg-green-500 text-black font-bold py-1 px-3 rounded-full text-sm">
            88% Match
          </div>

          <div className="mt-6 border-t border-gray-700 pt-4">
            <h3 className="font-semibold text-lg mb-2">Candidate Insight:</h3>
            <p className="text-gray-300">"Values purpose, learns independently, strong logic."</p>

            <div className="mt-4 flex space-x-4">
              <button className="flex-1 p-3 bg-blue-500 rounded-lg font-bold hover:bg-blue-400 transition-colors">
                Watch Quest Replay ▶️
              </button>

              {!invited ? (
                <button
                  onClick={handleInvite}
                  className="flex-1 p-3 bg-green-500 rounded-lg text-black font-bold hover:bg-green-400 transition-colors"
                >
                  Send Interview Invite
                </button>
              ) : (
                <div className="flex-1 p-3 bg-green-900/50 border border-green-500 rounded-lg text-center">
                  <p className="font-bold text-green-300">Invite Sent!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {invited && (
          <div className="mt-6 text-center animate-fade-in-up">
            <p className="text-lg">This is just the beginning.</p>
            <Link to="/" className="text-blue-400 hover:underline mt-2 inline-block">
              Start a New Journey
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recruiter;