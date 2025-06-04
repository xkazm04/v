import React from 'react';
import { motion } from 'framer-motion';

type Props = {
  children: React.ReactNode;
}

const LightEffect = ({ children }: Props) => {
  const flickerVariants = {
    animate: {
      opacity: [1, 0.2, 0.8, 0.1, 0.1, 0.1, 0.1, 0.1, 1, 1, 1, 0.2, 0.8, 1, 1, 1, 0.1, 0.8, 1],
      filter: [
        'brightness(1) contrast(1)',
        'brightness(0.2) contrast(1.5)',
        'brightness(0.8) contrast(1.2)',
        'brightness(0.1) contrast(2)',
        'brightness(0.1) contrast(2)',
        'brightness(0.1) contrast(2)',
        'brightness(0.1) contrast(2)',
        'brightness(0.1) contrast(2)',
        'brightness(1) contrast(1)',
        'brightness(1) contrast(1)',
        'brightness(1) contrast(1)',
        'brightness(0.2) contrast(1.5)',
        'brightness(0.8) contrast(1.2)',
        'brightness(1) contrast(1)',
        'brightness(1) contrast(1)',
        'brightness(1) contrast(1)',
        'brightness(0.1) contrast(2)',
        'brightness(0.8) contrast(1.2)',
        'brightness(1) contrast(1)'
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const glowVariants = {
    animate: {
      opacity: [0.4, 0.1, 0.6, 0.2, 0.4],
      scale: [1, 1.1, 0.9, 1.05, 1],
      rotate: [0, 1, -1, 0.5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="relative inline-block">
      {/* Main content with erratic flickering */}
      <motion.div 
        className="relative z-10"
        variants={flickerVariants}
        animate="animate"
        style={{
          textShadow: '0 0 8px #d11919, 0 0 16px #d11919, 0 0 24px #d11919'
        }}
      >
        {children}
      </motion.div>
      
      {/* Unstable glow */}
      <motion.div 
        className="absolute inset-0 blur-md opacity-40 pointer-events-none"
        variants={glowVariants}
        animate="animate"
        style={{
          background: 'radial-gradient(ellipse, rgba(209, 25, 25, 0.4) 0%, transparent 60%)'
        }}
      />
    </div>
  );
};

export default LightEffect;