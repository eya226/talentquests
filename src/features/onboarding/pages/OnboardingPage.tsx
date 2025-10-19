import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
// import ariaAnimation from '../../../assets/aria-animation.json'; // Replace with the actual path
import { useAuth } from '../../../App';
import { supabase } from '../../../supabaseClient';
import { Navigate } from 'react-router-dom';

// Placeholder for the animation data
const ariaAnimation = {"v":"5.5.7","fr":30,"ip":0,"op":150,"w":1024,"h":1024,"nm":"Aria","ddd":0,"assets":[],"layers":[]};

const studentQuestions = [
  "Tell me about a project you’re proud of.",
  "When code breaks, what’s your first move?",
  "Do you prefer working alone or with others?",
  "What kind of company would you love to join?",
];

const recruiterQuestions = [
  "What makes your best engineer different?",
  "Is speed or quality more important?",
  "How do you handle failure in your team?",
  "Do you value formal degrees or proven skills more?",
];

const OnboardingPage: React.FC = () => {
  const { session } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [conversationStarted, setConversationStarted] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  // TODO: Fetch user's role from their profile
  const userRole = 'student'; // Hardcoded for now
  const questions = userRole === 'student' ? studentQuestions : recruiterQuestions;

  const handleStartTalking = () => {
    setConversationStarted(true);
  };

  const handleResponseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userResponse) return;

    // TODO: Send the response to a Supabase Edge Function
    console.log(`User response to "${questions[currentQuestionIndex]}": ${userResponse}`);

    // In a real app, you would get the extracted data back and store it.
    // For now, we'll just move to the next question.

    setUserResponse('');
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Last question answered
      console.log("Onboarding questions complete!");
      // Here you would trigger the "Building your Digital Identity..." animation
      // and then navigate to the dashboard.
      setOnboardingComplete(true);
    }
  };

  if (onboardingComplete) {
      return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#1F2937] text-white flex flex-col items-center justify-between p-4">
      <div className="w-full max-w-4xl flex items-start pt-8">
        <div className="w-1/4">
          <Lottie animationData={ariaAnimation} loop={true} style={{ width: 150, height: 150 }} />
        </div>
        <div className="flex-1 pl-4">
          {!conversationStarted ? (
            <div className="text-center mt-16">
              <p className="text-2xl mb-6">Hi, I’m Aria. Let’s build your future — in 10 minutes. No forms. Just conversation.</p>
              <button
                onClick={handleStartTalking}
                className="bg-[#6D28D9] text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105 animate-pulse"
              >
                Start Talking
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-between">
                <div>
                    <div className="bg-gray-800 p-4 rounded-lg mb-4">
                        <p className="text-lg">{questions[currentQuestionIndex]}</p>
                    </div>
                </div>
            </div>
          )}
        </div>
      </div>

      {conversationStarted && (
        <div className="w-full max-w-4xl pb-8">
            <form onSubmit={handleResponseSubmit} className="flex items-center space-x-2">
                <button type="button" className="p-3 bg-gray-700 rounded-full hover:bg-gray-600">
                    <span role="img" aria-label="microphone">🎙️</span>
                </button>
                <input
                    type="text"
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                    placeholder="Say something..."
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
                    autoFocus
                />
                <button type="submit" className="p-3 bg-[#6D28D9] rounded-full hover:bg-opacity-90">
                    <span role="img" aria-label="send">➤</span>
                </button>
            </form>
        </div>
      )}
    </div>
  );
};

export default OnboardingPage;