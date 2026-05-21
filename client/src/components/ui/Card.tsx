import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = true }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -8, boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)' } : {}}
      transition={{ duration: 0.3 }}
      className={`mughal-card ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;