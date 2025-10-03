import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';
import { extractSkills } from '../lib/nlp';
import { Session } from '@supabase/supabase-js';

type ConversationStep = 'ASKING_NAME' | 'ASKING_UNIVERSITY' | 'ASKING_SKILLS' | 'CONFIRMATION' | 'COMPLETE';

const candidateSkills = ['React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'Vue', 'Angular', 'HTML', 'CSS', 'SQL', 'MongoDB', 'Firebase', 'Supabase', 'Docker', 'Kubernetes', 'AWS', 'Google Cloud', 'Azure', 'Machine Learning', 'Data Science', 'UI/UX Design', 'Figma', 'Project Management'];

const AriaOnboardingPage = () => {
  const { session } = useAuth() as { session: Session | null };
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    { from: 'aria', text: "Hello! I'm Aria, your personal guide to TalentQuest. Let's get your profile started. What's your full name?" }
  ]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationStep, setConversationStep] = useState<ConversationStep>('ASKING_NAME');

  // State to hold profile data
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [skills, setSkills] = useState<string[]>([]);

  const addMessage = (from: 'aria' | 'user', text: string) => {
      setMessages(prev => [...prev, { from, text }]);
  };

  const handleSaveProfile = async () => {
    if (!session?.user) return;
    setLoading(true);
    addMessage('aria', 'Perfect! I\'m saving your profile now. One moment...');

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: session.user.id,
        name,
        university,
        skills,
        onboarding_complete: true,
        updated_at: new Date(),
      });

    if (error) {
      addMessage('aria', 'I seem to have run into an issue saving your profile. Please try again later.');
      console.error('Error saving profile:', error);
    } else {
      addMessage('aria', 'All done! Your profile is set up. Redirecting you to your dashboard...');
      setTimeout(() => navigate('/'), 2000);
    }
    setLoading(false);
  };

  const processUserInput = async (input: string) => {
    addMessage('user', input);
    setUserInput('');
    setLoading(true);

    switch (conversationStep) {
      case 'ASKING_NAME':
        setName(input);
        setConversationStep('ASKING_UNIVERSITY');
        addMessage('aria', `Great to meet you, ${input}! What university do you attend?`);
        break;

      case 'ASKING_UNIVERSITY':
        setUniversity(input);
        setConversationStep('ASKING_SKILLS');
        addMessage('aria', `Got it, ${input}. Now for the fun part! Tell me about your skills and passions. What technologies or areas are you interested in? For example, you could say "I love building web apps with React and Node.js."`);
        break;

      case 'ASKING_SKILLS':
        addMessage('aria', 'Analyzing your skills...');
        const extracted = await extractSkills(input, candidateSkills);
        setSkills(extracted);
        setConversationStep('CONFIRMATION');
        if (extracted.length > 0) {
            addMessage('aria', `Based on what you said, I've identified these skills: ${extracted.join(', ')}. Does that look right? You can also list any others I missed.`);
        } else {
            addMessage('aria', `I wasn't able to pull out specific skills from that. Could you try listing some of the technologies you enjoy working with?`);
            setConversationStep('ASKING_SKILLS'); // Retry skill extraction
        }
        break;

      case 'CONFIRMATION':
        addMessage('aria', 'Got it. One last check...');
        const finalSkills = await extractSkills(input, candidateSkills);
        // Combine previously extracted skills with any new ones
        const combinedSkills = Array.from(new Set([...skills, ...finalSkills]));
        setSkills(combinedSkills);
        setConversationStep('COMPLETE');
        addMessage('aria', `Awesome! I've updated your skills to: ${combinedSkills.join(', ')}. Your initial profile is complete!`);
        await handleSaveProfile();
        break;
    }
    setLoading(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || loading) return;
    processUserInput(userInput);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1>Chat with Aria</h1>
            <p>Let's get your profile started.</p>
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
            disabled={loading || conversationStep === 'COMPLETE'}
          />
          <button type="submit" disabled={loading || conversationStep === 'COMPLETE'} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }}>
            Send
          </button>
        </form>
    </div>
  );
};

export default AriaOnboardingPage;