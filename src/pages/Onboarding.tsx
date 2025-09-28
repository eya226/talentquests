import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AriaMessage from '../components/AriaMessage';
import UserMessage from '../components/UserMessage';
import ProfileReveal from '../components/ProfileReveal';

// Demo scenario data
const demoScript = [
  {
    aria: "Tell me about a project you enjoyed building.",
    user: "I made a quiz app for my brother’s school. He said the kids love it.",
    tags: ["Full-Stack Dev", "Education Impact"]
  },
  {
    aria: "When code breaks, what’s your first move?",
    user: "I check the error message. Then Google in Arabic.",
    tags: ["Problem-Solver", "Resourceful Learner"]
  },
  {
    aria: "Do you prefer working alone or with others?",
    user: "Alone… but I want to learn teamwork.",
    tags: ["Independent", "Growth Mindset"]
  },
  {
    aria: "What kind of company would you love to join?",
    user: "One that builds useful things. Not just money.",
    tags: ["Purpose-Driven"]
  }
];

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState([{ sender: 'aria', text: "Hi, I'm Aria. Let's build your future — in 10 minutes. Ready?" }]);
  const [revealedTags, setRevealedTags] = useState<string[]>([]);
  const [isChatting, setIsChatting] = useState(true);
  const navigate = useNavigate();

  const nextStep = () => {
    if (!isChatting || step >= demoScript.length) return;

    const userMessage = { sender: 'user', text: demoScript[step].user };
    const nextAriaQuestion = (step + 1 < demoScript.length)
        ? { sender: 'aria', text: demoScript[step + 1].aria }
        : { sender: 'aria', text: "Great! Let's see what we've discovered..."};

    setTimeout(() => {
        setMessages(prev => [...prev, userMessage]);
        setRevealedTags(prev => [...prev, ...demoScript[step].tags]);
    }, 500);

    setTimeout(() => {
        setMessages(prev => [...prev, nextAriaQuestion]);
        if (step + 1 < demoScript.length) {
            setStep(prev => prev + 1);
        } else {
            setTimeout(() => setIsChatting(false), 2000);
        }
    }, 2000);
  };

  const handleBeginQuest = () => {
    // Navigate to the quest page after a short delay
    setTimeout(() => {
      navigate('/quest');
    }, 1000);
  };

  useEffect(() => {
    const initialAriaMessage = { sender: 'aria', text: demoScript[0].aria };
    setTimeout(() => {
      setMessages(prev => [...prev, initialAriaMessage]);
    }, 2000);
  }, []);

  if (!isChatting) {
    return <ProfileReveal onBeginQuest={handleBeginQuest} />;
  }

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-2xl flex flex-col h-[80vh] bg-gray-800 rounded-lg shadow-xl">
        <div className="flex-grow p-4 overflow-y-auto">
          {messages.map((msg, index) =>
            msg.sender === 'aria' ? (
              <AriaMessage key={index}>{msg.text}</AriaMessage>
            ) : (
              <UserMessage key={index}>{msg.text}</UserMessage>
            )
          )}
        </div>
        <div className="p-4 border-t border-gray-700">
          <div className="flex justify-center items-center flex-wrap gap-2">
            {revealedTags.map(tag => (
              <span key={tag} className="bg-green-500 text-white px-3 py-1 rounded-full text-sm animate-pop-in">{tag}</span>
            ))}
          </div>
          <button
              className="mt-4 w-full p-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors duration-200 glow-on-hover"
              onClick={nextStep}
              disabled={!isChatting || step >= demoScript.length}
          >
            {step < demoScript.length ? "Continue Youssef's Story" : "Finalizing..."}
          </button>
        </div>
      </div>
    </div>
  );
};

// Basic CSS for animations
const popInStyles = `
@keyframes pop-in {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.animate-pop-in {
  animation: pop-in 0.5s ease-out forwards;
}
`;
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = popInStyles;
document.head.appendChild(styleSheet);

export default Onboarding;