import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

const Badge = ({ children, color = 'bg-neutral-100 text-neutral-800', className = '' }: BadgeProps) => {
  return (
    <span className={`tag ${color} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;