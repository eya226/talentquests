import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Jobs = () => {
  const [applied, setApplied] = useState(false);
  const navigate = useNavigate();

  const handleApply = () => {
    setApplied(true);
    // Navigate to the recruiter view after the success message
    setTimeout(() => {
      navigate('/recruiter');
    }, 2500);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col justify-center items-center p-4">
      {!applied ? (
        <div className="w-full max-w-sm bg-gray-800 rounded-2xl shadow-2xl shadow-blue-500/20 border border-blue-700 p-6 text-center animate-fade-in-up">
          <div className="mb-4">
            <span className="bg-green-500 text-black font-bold py-1 px-3 rounded-full text-sm">
              ✨ 88% Culture Fit
            </span>
          </div>
          <h2 className="text-2xl font-bold">EdTech Tunisia</h2>
          <p className="text-lg text-gray-400">Junior Backend Developer</p>
          <p className="text-xl font-semibold text-green-400 mt-2">2,800 TND / month</p>
          <p className="mt-4 text-sm text-gray-300">"You both value education & purpose-driven work. You also beat the Malware Spider — a perfect fit!"</p>

          <button
            onClick={handleApply}
            className="mt-6 w-full p-3 bg-blue-500 rounded-lg text-white font-bold hover:bg-blue-400 transition-all duration-200"
          >
            1-Tap Apply
          </button>
        </div>
      ) : (
        <div className="text-center animate-fade-in-up">
          <h1 className="text-4xl font-bold text-green-400">Applied!</h1>
          <p className="mt-2 text-lg">The recruiter at EdTech Tunisia has been notified.</p>
        </div>
      )}
    </div>
  );
};

export default Jobs;