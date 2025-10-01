import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../auth/AuthProvider';

const Onboarding = () => {
  const { user, signOut } = useAuth();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [messages, setMessages] = useState<{ sender: string, text: string }[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data } = await supabase.from('questions').select('*').order('order');
      if (data && data.length > 0) {
        setQuestions(data);
        setMessages([{ sender: 'aria', text: "Hi! Let's build your profile." }, { sender: 'aria', text: data[0].question_text }]);
      }
    };
    fetchQuestions();
  }, []);

  const handleSendAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAnswer.trim() || isSaving) return;

    const newAnswer = { answer: currentAnswer };
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);
    setMessages(prev => [...prev, { sender: 'user', text: currentAnswer }]);
    setCurrentAnswer('');

    if (currentQuestionIndex < questions.length - 1) {
      const nextQuestion = questions[currentQuestionIndex + 1];
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'aria', text: nextQuestion.question_text }]);
        setCurrentQuestionIndex(prev => prev + 1);
      }, 500);
    } else {
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'aria', text: "Great, that's everything for now!" }]);
        generateAndSaveProfile(newAnswers);
      }, 500);
    }
  };

  const generateAndSaveProfile = async (finalAnswers: any[]) => {
    if (!user) return;
    setIsSaving(true);

    const profileData = {
      archetype: "Generated Builder",
      skills: { "Analysis": finalAnswers.length * 10 },
      "values": ["Curious"],
      updated_at: new Date(),
    };

    const { error } = await supabase.from('profiles').update(profileData).eq('id', user.id);
    if (error) {
      alert("Error saving profile: " + error.message);
      setIsSaving(false);
    } else {
      // This is the key part of the fix - navigate to the profile page to show the real data
      navigate('/profile');
    }
  };

  if (questions.length === 0) {
    return <div>Loading Onboarding...</div>;
  }

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}: </strong>{msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSendAnswer}>
        <input
          type="text"
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          disabled={isSaving}
        />
        <button type="submit" disabled={isSaving || !currentAnswer.trim()}>
          {isSaving ? 'Saving...' : 'Send'}
        </button>
      </form>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};

export default Onboarding;