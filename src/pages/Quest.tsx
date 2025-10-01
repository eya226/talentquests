import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../auth/AuthProvider';

const Quest = () => {
  const { user } = useAuth();
  const [quest, setQuest] = useState<any>(null);
  const [code, setCode] = useState('');
  const [isSolved, setIsSolved] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuest = async () => {
      const { data } = await supabase.from('quests').select('*').limit(1).single();
      if (data) {
        setQuest(data);
        setCode(data.initial_code);
      }
      setLoading(false);
    };
    fetchQuest();
  }, []);

  const handleRunCode = async () => {
    if (!quest || !user) return;

    const isCorrectSolution = !code.includes('while True:');
    if (isCorrectSolution) {
      setIsSolved(true);
      const { error } = await supabase.from('quest_submissions').insert({
        user_id: user.id,
        quest_id: quest.id,
        submitted_code: code,
        is_solved: true,
      });

      if (error) {
        alert("Error saving submission: " + error.message);
        setIsSolved(false);
      } else {
        alert("Quest solved!");
        navigate('/jobs');
      }
    } else {
      alert("Bug not fixed yet!");
    }
  };

  if (loading) return <div>Loading Quest...</div>;
  if (!quest) return <div>No quests available.</div>;

  return (
    <div>
      <h1>{quest.title}</h1>
      <p>{quest.description}</p>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      {!isSolved ? (
        <button onClick={handleRunCode}>Run Code</button>
      ) : (
        <div>
          <h2>Success!</h2>
          <p>+{quest.xp_reward} XP Earned</p>
          <p>"{quest.badge_reward}" Badge Unlocked</p>
        </div>
      )}
    </div>
  );
};

export default Quest;