import React from 'react';

interface BadgeProps {
  text: string;
  color?: 'purple' | 'blue' | 'green';
  glow?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ text, color = 'blue', glow = false }) => {
  const baseClasses = "inline-block px-3 py-1 rounded-full text-sm font-semibold transition-shadow duration-300 ease-in-out";

  const colorVariants = {
    purple: 'bg-quantum-purple text-purple-200',
    blue: 'bg-neon-blue text-blue-100',
    green: 'bg-code-green text-green-100',
  };

  const glowVariants = {
    purple: 'shadow-[0_0_10px_theme(colors.quantum-purple)]',
    blue: 'shadow-[0_0_10px_theme(colors.neon-blue)]',
    green: 'shadow-[0_0_10px_theme(colors.code-green)]',
  };

  const classes = [
    baseClasses,
    colorVariants[color],
    glow ? glowVariants[color] : ''
  ].join(' ');

  return (
    <div className={classes}>
      {text}
    </div>
  );
};

export default Badge;