import React from 'react';

interface CompatibilityBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export const CompatibilityBadge: React.FC<CompatibilityBadgeProps> = ({ score, size = 'md' }) => {
  let bgColor = 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  let glowColor = '';
  
  if (score >= 80) {
    bgColor = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    glowColor = 'shadow-[0_0_10px_rgba(74,222,128,0.5)]';
  } else if (score >= 50) {
    bgColor = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    glowColor = 'shadow-[0_0_10px_rgba(250,204,21,0.3)]';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${bgColor} ${sizeClasses[size]} ${glowColor} transition-all duration-300`}
    >
      ⭐ {score}% Match
    </span>
  );
};
