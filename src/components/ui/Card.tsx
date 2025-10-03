import React from 'react';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className }: CardProps) => {
  return <div className={`card ${className}`}>{children}</div>;
};

export default Card;