import React from 'react';
import { motion } from 'framer-motion';

type Props = {
  children: React.ReactNode;
}
// Red glow for false information
const LightEffect = ({ children }: Props) => {

  return (
    <div className="relative inline-block">
      <motion.div 
        className="relative z-10"
        style={{
          textShadow: '0 0 8px #d11919, 0 0 16px #d11919, 0 0 24px #d11919'
        }}
      >
        {children}
      </motion.div>
      
      <motion.div 
        className="absolute inset-0 blur-md opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(209, 25, 25, 0.4) 0%, transparent 60%)'
        }}
      />
    </div>
  );
};

export default LightEffect;