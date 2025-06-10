'use client';
import { motion } from 'framer-motion';

interface TimelineScrollIndicatorProps {
  scrollProgress: number;
  colors: any;
}

export default function TimelineScrollIndicator({ 
  scrollProgress, 
  colors 
}: TimelineScrollIndicatorProps) {
  return (
    <div className="fixed bottom-8 right-8 z-40">
      <motion.div
        className="w-16 h-16 rounded-full border-2 flex items-center justify-center backdrop-blur-sm"
        style={{
          backgroundColor: colors.cardColors?.background || colors.background,
          borderColor: colors.border,
          color: colors.foreground
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5 }}
        whileHover={{ scale: 1.1 }}
      >
        <div className="relative w-12 h-12">
          {/* Background Circle */}
          <svg className="w-12 h-12 transform -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke={colors.border}
              strokeWidth="2"
              fill="none"
            />
            {/* Progress Circle */}
            <motion.circle
              cx="24"
              cy="24"
              r="20"
              stroke={colors.primary}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="125.6"
              animate={{
                strokeDashoffset: 125.6 - (scrollProgress * 125.6)
              }}
              transition={{ duration: 0.1 }}
            />
          </svg>
          
          {/* Percentage Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold">
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}