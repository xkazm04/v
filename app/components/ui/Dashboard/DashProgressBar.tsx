'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DashProgressBarProps {
  value: number;
  color: string;
  isDark: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showValue?: boolean;
  delay?: number;
  className?: string;
}

const DashProgressBar: React.FC<DashProgressBarProps> = ({ 
  value, 
  color, 
  isDark, 
  size = 'md',
  animated = true,
  showValue = true,
  delay = 0,
  className = ''
}) => {
  // Size configurations
  const sizeConfig = {
    sm: { height: 'h-1.5', fontSize: 'text-xs' },
    md: { height: 'h-2', fontSize: 'text-xs' },
    lg: { height: 'h-3', fontSize: 'text-sm' }
  };

  const config = sizeConfig[size];

  return (
    <div className={`relative ${config.height} rounded-full overflow-hidden ${className}`}
      style={{ 
        backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
      }}
    >
      {/* Background subtle pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 2px,
            ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 4px
          )`
        }}
      />
      
      {/* Progress fill with enhanced styling */}
      <motion.div
        initial={animated ? { width: 0 } : { width: `${value}%` }}
        animate={{ width: `${value}%` }}
        transition={{ 
          duration: animated ? 1.2 : 0, 
          ease: "easeOut",
          delay: delay 
        }}
        className={`${config.height} relative overflow-hidden rounded-full`}
        style={{ 
          background: `linear-gradient(90deg, ${color}, ${color}ee, ${color}dd)`
        }}
      >
        {/* Enhanced shimmer effect */}
        <motion.div
          className="absolute inset-0 opacity-60"
          style={{
            background: `linear-gradient(90deg, 
              transparent, 
              rgba(255,255,255,0.6), 
              rgba(255,255,255,0.8), 
              rgba(255,255,255,0.6), 
              transparent
            )`
          }}
          animate={{
            x: ['-100%', '200%']
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: delay + 0.5,
            ease: "easeInOut"
          }}
        />

        {/* Subtle inner glow */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(0deg, 
              transparent, 
              rgba(255,255,255,0.3), 
              transparent
            )`
          }}
        />
      </motion.div>
      
      {/* Value display for larger sizes */}
      {showValue && size === 'lg' && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.8, duration: 0.4 }}
        >
          <span className={`${config.fontSize} font-bold text-white drop-shadow-lg`}>
            {value}%
          </span>
        </motion.div>
      )}

      {/* Pulse effect on complete */}
      {value >= 100 && animated && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: color }}
          animate={{
            opacity: [0, 0.3, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 1,
            delay: delay + 1.2,
            ease: "easeInOut"
          }}
        />
      )}
    </div>
  );
};

export default DashProgressBar;