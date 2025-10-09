import React from 'react';

interface ProgressBarProps {
  value: number; // A value between 0 and 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  const progress = Math.min(Math.max(value, 0), 100); // Clamp value between 0 and 100

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#374151', // gray-700
      borderRadius: '9999px',
      height: '20px',
      overflow: 'hidden',
    }}>
      <div style={{
        width: `${progress}%`,
        backgroundColor: '#6D28D9', // Quantum Purple
        height: '100%',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'width 0.5s ease-in-out',
        fontSize: '12px',
        fontWeight: 'bold',
      }}>
        {`${progress}%`}
      </div>
    </div>
  );
};

export default ProgressBar;