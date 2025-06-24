'use client';

import React from 'react';
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import PropagateLoader from "react-spinners/PropagateLoader";
import { motion } from 'framer-motion';

type LoaderComponentProps = {
  loading: boolean;
  size?: number;
  speedMultiplier?: number;
  className?: string;
  text?: string;
  variant?: 'default' | 'small' | 'large';
  color?: string; 
}

const LoaderComponent = ({ 
  loading, 
  size,
  speedMultiplier = 0.7,
  className = '',
  text,
  variant = 'default',
  color
}: LoaderComponentProps) => {
  const { colors, isDark, subtone } = useLayoutTheme();

  const loaderColor = color || 
    (subtone.isActive ? subtone.color : colors.primary) ||
    (isDark ? '#3b82f6' : '#2563eb');

  const sizeMap = {
    small: 3,
    default: 5,
    large: 8
  };

  const loaderSize = size || sizeMap[variant];

  if (!loading) return null;

  return (
    <motion.div 
      className={`flex flex-col items-center justify-center ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="animate-pulse">
        <PropagateLoader
          color={loaderColor}
          loading={loading}
          speedMultiplier={speedMultiplier}
          size={loaderSize}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
      
      {text && (
        <motion.p 
          className="mt-3 text-sm font-medium"
          style={{ color: colors.mutedForeground }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );
};

export default LoaderComponent;