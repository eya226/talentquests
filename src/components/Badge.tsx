import React from 'react';

interface BadgeProps {
  text: string;
  color?: 'purple' | 'blue' | 'green';
  glow?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ text, color = 'blue', glow = false }) => {
  const colorStyles = {
    purple: { backgroundColor: '#5B21B6', color: '#E9D5FF' }, // violet-800, violet-200
    blue: { backgroundColor: '#1E40AF', color: '#DBEAFE' },   // blue-800, blue-100
    green: { backgroundColor: '#065F46', color: '#A7F3D0' },  // emerald-800, emerald-200
  };

  const glowStyle = glow ? {
    boxShadow: `0 0 10px ${colorStyles[color].backgroundColor}, 0 0 20px ${colorStyles[color].backgroundColor}`,
  } : {};

  return (
    <div style={{
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '9999px',
      fontSize: '14px',
      fontWeight: '600',
      ...colorStyles[color],
      ...glowStyle,
      transition: 'box-shadow 0.3s ease-in-out',
    }}>
      {text}
    </div>
  );
};

export default Badge;