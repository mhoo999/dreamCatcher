import React from 'react';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const Card: React.FC<CardProps> = ({ className = '', children, onClick }) => {
  return (
    <div className={`rounded-card bg-card shadow-card p-6 ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card; 