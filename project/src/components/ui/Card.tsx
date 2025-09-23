import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card = ({ children, className = '', hover = true, onClick }: CardProps) => {
  const Component = onClick ? motion.button : motion.div;
  
  return (
    <Component
      className={`glass-card ${hover ? 'mission-card' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      whileHover={hover ? { y: -2 } : undefined}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};