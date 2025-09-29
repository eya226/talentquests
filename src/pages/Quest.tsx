import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

interface QuestData {
  id: string;
  title: string;
  description: string;
  initial_code: string;
  xp_reward: number;
  badge_reward: string;
}

const Quest = () => {
  const [quests, setQuests] = useState<QuestData[]>([]);
  const [currentQuest, setCurrentQuest] = useState<QuestData | null>(null);
  const [code, setCode] = useState('');
  const [isSolved, setIsSolved] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const { data, error } = await supabase.from('quests').select('*').order('created_at', { ascending: true });
        if (error) throw error;
        if (data && data.length > 0) {
          setQuests(data);
          // For the demo, we'll start with the first quest
          setCurrentQuest(data[0]);
          setCode(data[0].initial_code);
        }
      } catch (error: any) {
        alert("Error fetching quests: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuests();
  }, []);

  const handleRunCode = async () => {
    if (!currentQuest) return;

    const isCorrectSolution = (
        !code.includes('while True:') &&
        (code.includes('for ') || code.includes('while count <') || code.includes('if '))
    );

    if (isCorrectSolution) {
      setIsSolved(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not found!");

        const submission = {
          user_id: user.id,
          quest_id: currentQuest.id,
          submitted_code: code,
          is_solved: true,
        };

        const { error } = await supabase.from('quest_submissions').insert(submission);
        if (error) throw error;

        setTimeout(() => {
          navigate('/jobs');
        }, 2500);

      } catch (error: any) {
        alert("Error saving submission: " + error.message);
        setIsSolved(false); // Revert state on error
      }
    } else {
      alert("That's not quite right. Hint: Replace the infinite loop with a finite one, like a `for` loop.");
    }
  };

  if (loading) {
    return <div className="bg-gray-900 text-white min-h-screen flex justify-center items-center"><p>Loading Quests...</p></div>;
  }

  if (!currentQuest) {
    return <div className="bg-gray-900 text-white min-h-screen flex justify-center items-center"><p>No quests available.</p></div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col justify-center items-center p-4 font-mono">
      <div className="w-full max-w-3xl bg-black rounded-lg shadow-2xl shadow-purple-500/20 border border-purple-700 overflow-hidden">
        <div className="p-4 bg-gray-800 border-b border-purple-700">
          <h1 className="text-2xl font-bold text-green-400">{currentQuest.title}</h1>
        </div>

        <div className="p-6">
          <p className="mb-4 text-gray-300">{currentQuest.description}</p>

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
              <p className="mt-2 text-lg">+{currentQuest.xp_reward} XP Earned</p>
              <p className="text-lg">"{currentQuest.badge_reward}" Badge Unlocked</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quest;