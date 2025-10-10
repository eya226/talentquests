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
    <div className="bg-gray-dark rounded-xl p-6 border border-gray-medium shadow-md text-gray-50">
      <h3 className="text-xl font-bold mb-3 text-white">
        {title}
      </h3>
      <p className="mb-4 text-gray-light">
        {description}
      </p>
      {children}
      {buttonText && onButtonClick && (
        <button
          onClick={onButtonClick}
          className="w-full py-3 px-4 mt-4 rounded-lg bg-quantum-purple text-white font-bold cursor-pointer hover:bg-purple-700 transition-colors"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default Card;