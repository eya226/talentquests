import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  progress: number;
  className?: string;
}

const ProgressBar = ({ progress, className }: ProgressBarProps) => {
  const progressValue = Math.max(0, Math.min(100, progress));

  return (
    <div className={`progress-bar-container ${className}`}>
      <div className="progress-bar" style={{ width: `${progressValue}%` }}>
        {progressValue}%
      </div>
    </div>
  );
};

export default ProgressBar;