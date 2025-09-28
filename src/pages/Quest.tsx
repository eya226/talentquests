import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialCode = `while True: # <- Bug!
    turn_on_lights()`;

const Quest = () => {
  const [code, setCode] = useState(initialCode);
  const [isSolved, setIsSolved] = useState(false);
  const navigate = useNavigate();

  const handleRunCode = () => {
    // Mock logic: The bug is "fixed" if the code no longer contains the infinite loop.
    if (!code.includes('while True:')) {
      setIsSolved(true);
      // Navigate to the job board after the success animation
      setTimeout(() => {
        navigate('/jobs');
      }, 2500);
    } else {
      alert("The infinite loop is still present! Try fixing the condition.");
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col justify-center items-center p-4 font-mono">
      <div className="w-full max-w-3xl bg-black rounded-lg shadow-2xl shadow-purple-500/20 border border-purple-700 overflow-hidden">
        <div className="p-4 bg-gray-800 border-b border-purple-700">
          <h1 className="text-2xl font-bold text-green-400">The Bug Hunter's Guild</h1>
          <p className="text-purple-300 mt-1">Challenge: Neo-Bugton's Infinite Loop</p>
        </div>

        <div className="p-6">
          <p className="mb-4 text-gray-300">The city's streetlights are stuck in an infinite loop, draining power. Fix the code to break the cycle.</p>

          <div className="bg-gray-900 rounded-md p-4">
            <textarea
              className="w-full h-32 bg-transparent text-cyan-300 border-0 focus:outline-none resize-none font-mono"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
            />
          </div>

          {!isSolved ? (
            <button
              onClick={handleRunCode}
              className="mt-6 w-full p-3 bg-green-500 rounded-md text-black font-bold hover:bg-green-400 transition-all duration-200"
            >
              Run Code
            </button>
          ) : (
            <div className="mt-6 p-4 bg-green-900/50 border border-green-500 rounded-md text-center animate-fade-in-up">
              <h2 className="text-2xl font-bold text-green-300">Success!</h2>
              <p className="mt-2 text-lg">+50 XP Earned</p>
              <p className="text-lg">"Syntax Mastery" Badge Unlocked</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quest;