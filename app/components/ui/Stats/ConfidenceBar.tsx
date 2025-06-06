'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';

interface ConfidenceBarProps {
  confidence: number; // 0-100
  isCompact?: boolean;
  showLabel?: boolean;
  showPercentage?: boolean;
  className?: string;
}

const barVariants = {
  hidden: { 
    scaleX: 0,
    opacity: 0
  },
  visible: { 
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
      delay: 0.2
    }
  }
};

const fillVariants = {
  hidden: { 
    width: '0%',
    opacity: 0
  },
  visible: (confidence: number) => ({
    width: `${Math.min(Math.max(confidence, 0), 100)}%`,
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: 'easeOut',
      delay: 0.4
    }
  })
};

const labelVariants = {
  hidden: { 
    opacity: 0,
    y: 5
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: 0.6
    }
  }
};

export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({
  confidence,
  isCompact = false,
  showLabel = true,
  showPercentage = true,
  className
}) => {
  const { colors, isDark, mounted } = useLayoutTheme();

  if (!mounted) {
    return null;
  }

  // Clamp confidence value between 0-100
  const clampedConfidence = Math.min(Math.max(confidence || 0, 0), 100);

  // Get confidence level and color
  const getConfidenceLevel = (value: number) => {
    if (value >= 90) return { label: 'Very High', color: isDark ? '#22c55e' : '#16a34a' };
    if (value >= 75) return { label: 'High', color: isDark ? '#3b82f6' : '#2563eb' };
    if (value >= 60) return { label: 'Moderate', color: isDark ? '#f59e0b' : '#d97706' };
    if (value >= 40) return { label: 'Low', color: isDark ? '#f97316' : '#ea580c' };
    return { label: 'Very Low', color: isDark ? '#ef4444' : '#dc2626' };
  };

  const confidenceInfo = getConfidenceLevel(clampedConfidence);

  // Enhanced gradient colors based on confidence
  const getGradientColors = () => {
    const baseColor = confidenceInfo.color;
    return {
      start: baseColor,
      middle: `${baseColor}cc`,
      end: `${baseColor}80`
    };
  };

  const gradientColors = getGradientColors();

  // Background colors for the track
  const trackColors = {
    background: isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.4)',
    border: isDark ? 'rgba(71, 85, 105, 0.2)' : 'rgba(203, 213, 225, 0.3)'
  };

  return (
    <motion.div
      className={cn(
        "flex flex-col",
        className
      )}
      initial="hidden"
      animate="visible"
    >

      {/* Progress Bar Container */}
      <motion.div
        className={cn(
          "relative overflow-hidden rounded-full border",
          isCompact ? "h-0.5" : "h-1"
        )}
        style={{
          backgroundColor: trackColors.background,
          borderColor: trackColors.border
        }}
        variants={barVariants}
      >
        {/* Background shimmer effect */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(90deg, transparent, ${colors.primary}20, transparent)`
          }}
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: 'easeInOut'
          }}
        />

        {/* Main progress fill */}
        <motion.div
          className="inset-y-0 left-0 rounded-full absolute overflow-hidden"
          style={{
            background: `linear-gradient(90deg, ${gradientColors.start}, ${gradientColors.middle}, ${gradientColors.end})`
          }}
          variants={fillVariants}
          custom={clampedConfidence}
        >
          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`
            }}
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 2,
              ease: 'easeInOut'
            }}
          />

          {/* Glow effect for high confidence */}
          {clampedConfidence >= 75 && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                boxShadow: `inset 0 0 10px ${confidenceInfo.color}40, 0 0 5px ${confidenceInfo.color}20`
              }}
              animate={{
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          )}
        </motion.div>

        {/* Confidence milestones */}
        <div className="absolute inset-0 flex items-center">
          {[25, 50, 75].map((milestone) => (
            <motion.div
              key={milestone}
              className="absolute w-px bg-current opacity-20"
              style={{
                left: `${milestone}%`,
                height: '50%',
                top: '25%',
                color: colors.mutedForeground
              }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 0.2, scaleY: 1 }}
              transition={{ delay: 0.8, duration: 0.3 }}
            />
          ))}
        </div>

        {/* Pulse effect for very low confidence */}
        {clampedConfidence < 40 && (
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: `${confidenceInfo.color}40` }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default ConfidenceBar;