import React from 'react';

interface CardProps {
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, description, buttonText, onButtonClick, children }) => {
  return (
    <div style={{
      backgroundColor: '#374151', // gray-700
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid #4B5563', // gray-600
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      color: '#F9FAFB', // gray-50
    }}>
      <h3 style={{
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '12px',
        color: '#FFFFFF',
      }}>
        {title}
      </h3>
      <p style={{
        marginBottom: '16px',
        color: '#D1D5DB', // gray-300
      }}>
        {description}
      </p>
      {children}
      {buttonText && onButtonClick && (
        <button
          onClick={onButtonClick}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#6D28D9', // Quantum Purple
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '16px',
          }}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default Card;