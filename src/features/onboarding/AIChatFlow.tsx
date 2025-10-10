import React, { useState, useEffect, useRef } from 'react';
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

// --- Helper function for simplified NLP ---
const generatePersonalityTags = (answers: string[]): string[] => {
    const tags = new Set<string>();
    const text = answers.join(' ').toLowerCase();

    const keywordMap: { [key: string]: string } = {
        'team': 'Collaborative', 'collaborate': 'Collaborative', 'together': 'Collaborative',
        'debug': 'Problem-Solver', 'fix': 'Problem-Solver', 'problem': 'Problem-Solver', 'solve': 'Problem-Solver',
        'learn': 'Curious', 'new': 'Curious', 'research': 'Curious',
        'build': 'Builder', 'create': 'Builder', 'develop': 'Builder',
        'lead': 'Leader', 'manage': 'Leader', 'mentor': 'Leader',
        'fast': 'Agile', 'speed': 'Agile', 'quick': 'Agile',
        'quality': 'Detail-Oriented', 'test': 'Detail-Oriented', 'robust': 'Detail-Oriented', 'clean': 'Detail-Oriented'
    };

    for (const keyword in keywordMap) {
        if (text.includes(keyword)) {
            tags.add(keywordMap[keyword]);
        }
    }

    if (tags.size === 0) return ['Proactive']; // Default tag if no keywords match
    return Array.from(tags);
};


const AIChatFlow = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { unlockAchievement } = useGameStore();
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<{from: 'aria' | 'user', text: string}[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const questions = profile?.role === 'recruiter' ? recruiterQuestions : studentQuestions;

  useEffect(() => {
    addMessage('aria', "Hi, I’m Aria. Let’s build your digital identity — in just a few questions.");
    setTimeout(() => {
        if (questions.length > 0) addMessage('aria', questions[0]);
    }, 1000);
  }, []);

  useEffect(() => {
    if (chatWindowRef.current) chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
  }, [messages]);

  const addMessage = (from: 'aria' | 'user', text: string) => {
      setMessages(prev => [...prev, { from, text }]);
  };

  const handleSaveProfile = async (finalAnswers: string[]) => {
    if (!user) return;
    setLoading(true);
    addMessage('aria', 'Perfect! I\'m analyzing your responses and building your profile...');

    // Dynamic profile generation
    const name = finalAnswers[0] || profile?.name || 'New Adventurer';
    const university = profile?.role === 'student' ? (finalAnswers[1] || '') : undefined;
    const personality_tags = generatePersonalityTags(finalAnswers);
    const archetype = "Full-Stack Builder"; // Default archetype for now
    const vision_board = { dream_company: "InstaDeep", target_salary: 4000 }; // Default vision board

    const { error } = await supabase
      .from('profiles')
      .update({ name, university, archetype, personality_tags, vision_board, onboarding_complete: true, updated_at: new Date() })
      .eq('id', user.id);

    if (error) {
      addMessage('aria', 'I seem to have run into an issue saving your profile. Please try again later.');
      console.error('Error saving profile:', error);
    } else {
      unlockAchievement('chat_complete');
      addMessage('aria', `I've updated your profile with these traits: ${personality_tags.join(', ')}. Redirecting you to your dashboard...`);
      setTimeout(() => navigate('/'), 3000);
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

  return (
    <div className="bg-gray-darkest min-h-screen flex items-center justify-center font-sans">
      <div className="max-w-3xl w-full mx-auto my-12 p-8 bg-dark-matter rounded-xl shadow-2xl">
          <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white">Chat with Aria</h1>
              <p className="text-gray-light">Let's build your digital identity.</p>
          </div>
          <div ref={chatWindowRef} className="h-96 overflow-y-auto p-4 mb-4 rounded-lg shadow-inner bg-gray-darkest space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.from === 'aria' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[70%] py-2 px-4 rounded-2xl ${msg.from === 'aria' ? 'bg-gray-dark text-white' : 'bg-quantum-purple text-white'}`}>
                  <p className="m-0">{msg.text}</p>
                </div>
              </div>
            ))}
            {loading && <p className="text-center italic text-gray-light">Aria is thinking...</p>}
          </div>
          <form onSubmit={handleFormSubmit} className="flex gap-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 rounded-lg border border-gray-medium bg-gray-dark text-white placeholder-gray-light focus:ring-2 focus:ring-quantum-purple focus:border-transparent outline-none disabled:opacity-50"
              disabled={loading || isComplete}
            />
            <button type="submit" disabled={loading || isComplete} className="py-3 px-6 rounded-lg border-none bg-quantum-purple text-white font-semibold cursor-pointer hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Send
            </button>
          </form>
      </div>
    </div>
  );
};

export default AIChatFlow;