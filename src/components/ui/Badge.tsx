import React from 'react';
import './Badge.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  className?: string;
}

const Badge = ({ children, variant = 'primary', className }: BadgeProps) => {
  return <span className={`badge badge-${variant} ${className}`}>{children}</span>;
};

export default Badge;