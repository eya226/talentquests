import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabaseClient';
import { useGameStore } from '../game-engine/gameStore';

// --- Questions based on Role ---
const studentQuestions = [
    "To start, what is your full name?",
    "Great to meet you! What university do you attend?",
    "Tell me about a project you’re proud of, technical or otherwise.",
    "When your code breaks or a plan goes wrong, what’s your first move?",
    "And finally, what kind of company or team would you love to join one day?"
];

const recruiterQuestions = [
    "To start, what is your full name?",
    "What makes your best engineer or team member different from everyone else?",
    "In your opinion, is speed of delivery or quality of work more important?",
    "How does your team handle failure or a project that doesn't go as planned?",
    "What’s the biggest challenge your team is facing right now?"
];

const AIChatFlow = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { unlockAchievement } = useGameStore();

  const [messages, setMessages] = useState<{from: 'aria' | 'user', text: string}[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const questions = profile?.role === 'recruiter' ? recruiterQuestions : studentQuestions;

  // --- Effects ---
  useEffect(() => {
    // Initial greeting from Aria
    addMessage('aria', "Hi, I’m Aria. Let’s build your digital identity — in just a few questions.");
    setTimeout(() => {
        if (questions.length > 0) {
            addMessage('aria', questions[0]);
        }
    }, 1000);
  }, []);

  // --- Helper Functions ---
  const addMessage = (from: 'aria' | 'user', text: string) => {
      setMessages(prev => [...prev, { from, text }]);
  };

  const handleSaveProfile = async (finalAnswers: string[]) => {
    if (!user) return;
    setLoading(true);
    addMessage('aria', 'Perfect! I\'m analyzing your responses and building your profile...');

    // Simplified profile generation
    const name = finalAnswers[0] || profile?.name || 'New Adventurer';
    const university = profile?.role === 'student' ? (finalAnswers[1] || '') : undefined;

    const personality_tags = ['Curious', 'Resilient']; // Default tags
    const archetype = "Full-Stack Builder"; // Default archetype
    const vision_board = { dream_company: "InstaDeep", target_salary: 4000 }; // Default vision board

    const { error } = await supabase
      .from('profiles')
      .update({
        name,
        university,
        archetype,
        personality_tags,
        vision_board,
        onboarding_complete: true,
        updated_at: new Date(),
      })
      .eq('id', user.id);

    if (error) {
      addMessage('aria', 'I seem to have run into an issue saving your profile. Please try again later.');
      console.error('Error saving profile:', error);
    } else {
      unlockAchievement('chat_complete');
      addMessage('aria', 'All done! Your initial profile is set up. Redirecting you to your dashboard...');
      setTimeout(() => navigate('/'), 2500);
    }
    setLoading(false);
  };

  const processUserInput = async (input: string) => {
    addMessage('user', input);
    setUserInput('');
    setLoading(true);

    const newAnswers = [...answers, input];
    setAnswers(newAnswers);

    const nextQuestionIndex = currentQuestionIndex + 1;

    // Wait a moment before Aria responds
    setTimeout(async () => {
        if (nextQuestionIndex < questions.length) {
            setCurrentQuestionIndex(nextQuestionIndex);
            addMessage('aria', questions[nextQuestionIndex]);
        } else {
            setIsComplete(true);
            await handleSaveProfile(newAnswers);
        }
        setLoading(false);
    }, 1200);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || loading || isComplete) return;
    processUserInput(userInput);
  };

  // --- Render ---
  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1>Chat with Aria</h1>
            <p>Let's build your digital identity.</p>
        </div>
        <div className="chat-window" style={{ height: '400px', overflowY: 'auto', border: '1px solid #eee', padding: '1rem', marginBottom: '1rem', borderRadius: '8px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)' }}>
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.from}`} style={{ marginBottom: '1rem', display: 'flex', justifyContent: msg.from === 'aria' ? 'flex-start' : 'flex-end' }}>
              <div style={{
                maxWidth: '70%',
                padding: '0.75rem 1rem',
                borderRadius: '18px',
                backgroundColor: msg.from === 'aria' ? '#f1f1f1' : '#007bff',
                color: msg.from === 'aria' ? '#000' : '#fff',
              }}>
                <p style={{ margin: 0 }}>{msg.text}</p>
              </div>
            </div>
          ))}
          {loading && <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Aria is thinking...</p>}
        </div>
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }}
            disabled={loading || isComplete}
          />
          <button type="submit" disabled={loading || isComplete} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }}>
            Send
          </button>
        </form>
    </div>
  );
};

export default AIChatFlow;