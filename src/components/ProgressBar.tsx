import React from 'react';

interface ProgressBarProps {
  value: number; // A value between 0 and 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  const progress = Math.min(Math.max(value, 0), 100); // Clamp value between 0 and 100

  return (
    <div className="w-full bg-gray-dark rounded-full h-5 overflow-hidden">
      <div
        className="bg-quantum-purple h-full flex items-center justify-center text-xs font-bold text-white transition-all duration-500 ease-in-out"
        style={{ width: `${progress}%` }}
      >
        {`${progress.toFixed(0)}%`}
      </div>
    </div>
  );
};

export default ProgressBar;