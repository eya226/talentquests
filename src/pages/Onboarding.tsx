import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../auth/AuthProvider';
import AriaMessage from '../components/AriaMessage';
import UserMessage from '../components/UserMessage';

interface Question {
  id: string;
  order: number;
  question_text: string;
  associated_skill: string;
  associated_value: string;
}

interface Answer {
  question: string;
  answer: string;
  question_details: Question;
}

const Onboarding = () => {
  const { user, signOut } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [messages, setMessages] = useState<{ sender: string, text: string }[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase.from('questions').select('*').order('order');
      if (error) {
        alert('Error fetching questions: ' + error.message);
      } else if (data && data.length > 0) {
        setQuestions(data);
        setMessages([{ sender: 'aria', text: "Hi! I'm Aria. Let's build your future. Ready?" }, { sender: 'aria', text: data[0].question_text }]);
      }
    };
    fetchQuestions();
  }, []);

  const handleSendAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAnswer.trim() || isSaving) return;

    const newAnswer: Answer = {
      question: questions[currentQuestionIndex].question_text,
      answer: currentAnswer,
      question_details: questions[currentQuestionIndex],
    };
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);
    setMessages(prev => [...prev, { sender: 'user', text: currentAnswer }]);
    setCurrentAnswer('');

    if (currentQuestionIndex < questions.length - 1) {
      const nextQuestion = questions[currentQuestionIndex + 1];
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'aria', text: nextQuestion.question_text }]);
        setCurrentQuestionIndex(prev => prev + 1);
      }, 1000);
    } else {
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'aria', text: "Great! Let's see what we've discovered..." }]);
        generateAndSaveProfile(newAnswers);
      }, 1000);
    }
  };

  const generateAndSaveProfile = async (finalAnswers: Answer[]) => {
    if (!user) return;
    setIsSaving(true);

    const skills = {};
    const values: string[] = [];
    let archetype = "Builder";

    finalAnswers.forEach(a => {
        const answerText = a.answer.toLowerCase();
        if (answerText.includes('team') || answerText.includes('together')) values.push('Team Player');
        if (answerText.includes('alone') || answerText.includes('solo')) values.push('Independent');
        if (answerText.includes('python')) skills['Python'] = 80;
        if (answerText.includes('react')) skills['React'] = 85;
        if (answerText.includes('flutter')) skills['Flutter'] = 75;
        if (answerText.includes('design') || answerText.includes('ui')) archetype = "Designer";
    });

    const profileData = {
      skills,
      "values": [...new Set(values)],
      archetype,
      vision_board: { dream: 'To build useful things' },
      updated_at: new Date(),
    };

    try {
      const { error } = await supabase.from('profiles').update(profileData).eq('id', user.id);
      if (error) throw error;

      // Navigate to the new profile page to show the real data
      navigate('/profile');

    } catch (error: any) {
      alert("Error saving profile: " + error.message);
      setIsSaving(false);
    }
  };

  if (questions.length === 0) {
    return <div className="bg-gray-900 text-white min-h-screen flex justify-center items-center"><p>Loading Onboarding...</p></div>;
  }

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-2xl flex flex-col h-[80vh] bg-gray-800 rounded-lg shadow-xl">
        <div className="flex-grow p-4 overflow-y-auto">
          {messages.map((msg, index) =>
            msg.sender === 'aria' ? <AriaMessage key={index}>{msg.text}</AriaMessage> : <UserMessage key={index}>{msg.text}</UserMessage>
          )}
        </div>
        <div className="p-4 border-t border-gray-700">
          <form onSubmit={handleSendAnswer} className="flex items-center">
            <input
              type="text"
              placeholder="Say something..."
              className="flex-grow p-3 rounded-l-lg bg-gray-700 text-white focus:outline-none"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              disabled={isSaving}
            />
            <button
              type="submit"
              className="p-3 bg-purple-600 rounded-r-lg hover:bg-purple-700 transition-colors"
              disabled={isSaving || !currentAnswer.trim()}
            >
              {isSaving ? '...' : '▶️'}
            </button>
          </form>
        </div>
      </div>
      <button onClick={signOut} className="text-gray-400 mt-4 hover:underline">Sign Out</button>
    </div>
  );
};

export default Onboarding;