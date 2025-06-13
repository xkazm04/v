'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { PerspectiveConfig, MilestoneEvent } from '../TimelineVertical';
import { ExternalLink, Quote } from 'lucide-react';

interface TimelinePerspectiveCardProps {
  config: PerspectiveConfig;
  content: string;
  isHovered: boolean;
  event: MilestoneEvent;
  isDark: boolean;
  colors: any;
  revealIndex?: number;
}

export default function TimelinePerspectiveCard({
  config,
  content,
  isHovered,
  event,
  isDark,
  colors,
  revealIndex = 0
}: TimelinePerspectiveCardProps) {
  
  // Memoized color configuration for better performance
  const colorConfig = useMemo(() => {
    const colorMap = {
      blue: {
        bg: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(239, 246, 255, 0.9)',
        border: isDark ? 'rgba(59, 130, 246, 0.25)' : 'rgba(59, 130, 246, 0.2)',
        text: isDark ? 'rgba(96, 165, 250, 1)' : 'rgba(29, 78, 216, 1)',
        accent: isDark ? 'rgba(59, 130, 246, 1)' : 'rgba(37, 99, 235, 1)'
      },
      emerald: {
        bg: isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(236, 253, 245, 0.9)',
        border: isDark ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.2)',
        text: isDark ? 'rgba(52, 211, 153, 1)' : 'rgba(6, 120, 95, 1)',
        accent: isDark ? 'rgba(16, 185, 129, 1)' : 'rgba(5, 150, 105, 1)'
      },
      amber: {
        bg: isDark ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255, 251, 235, 0.9)',
        border: isDark ? 'rgba(245, 158, 11, 0.25)' : 'rgba(245, 158, 11, 0.2)',
        text: isDark ? 'rgba(251, 191, 36, 1)' : 'rgba(146, 64, 14, 1)',
        accent: isDark ? 'rgba(245, 158, 11, 1)' : 'rgba(217, 119, 6, 1)'
      },
      purple: {
        bg: isDark ? 'rgba(147, 51, 234, 0.08)' : 'rgba(250, 245, 255, 0.9)',
        border: isDark ? 'rgba(147, 51, 234, 0.25)' : 'rgba(147, 51, 234, 0.2)',
        text: isDark ? 'rgba(168, 85, 247, 1)' : 'rgba(107, 33, 168, 1)',
        accent: isDark ? 'rgba(147, 51, 234, 1)' : 'rgba(126, 34, 206, 1)'
      }
    };

    // Safely get the color with fallback
    const colorKey = config?.color as keyof typeof colorMap;
    return colorMap[colorKey] || colorMap.blue;
  }, [config?.color, isDark]);

  // Safety check for config
  if (!config) {
    return null;
  }

  return (
    <motion.div
      className="relative p-5 rounded-2xl border-2 backdrop-blur-sm cursor-pointer xl:min-w-[400px]"
      style={{
        backgroundColor: colorConfig.bg,
        borderColor: isHovered ? colorConfig.accent : colorConfig.border,
        boxShadow: isHovered 
          ? `0 15px 30px -8px ${colorConfig.accent}20`
          : `0 6px 20px -4px ${isDark ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.08)'}`
      }}
      whileHover={{ 
        scale: 1.02,
        y: -3
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
          style={{
            backgroundColor: colorConfig.accent + '15',
            color: colorConfig.accent
          }}
          animate={{
            rotate: isHovered ? [0, 5, -5, 0] : 0
          }}
          transition={{ duration: 0.4 }}
        >
          {config.icon}
        </motion.div>
        
        <div className="flex-1">
          <h4 
            className="font-bold text-sm leading-tight"
            style={{ color: colorConfig.text }}
          >
            {config.label}
          </h4>
          <p 
            className="text-xs opacity-75 leading-tight"
            style={{ color: colorConfig.text }}
          >
            {config.description}
          </p>
        </div>

        {/* Quote Indicator */}
        <motion.div 
          animate={{ 
            rotate: isHovered ? 15 : 0
          }}
          transition={{ duration: 0.2 }}
        >
          <Quote 
            className="w-4 h-4" 
            style={{ color: colorConfig.accent + '50' }}
          />
        </motion.div>
      </div>

      {/* Content */}
      <motion.p 
        className="text-sm leading-relaxed mb-4"
        style={{ color: isDark ? colors.foreground : colorConfig.text }}
        animate={{ 
          opacity: isHovered ? 1 : 0.95
        }}
      >
        {content}
      </motion.p>

      {/* Source Link */}
      {event.reference_url && (
        <motion.div
          className="flex items-center gap-2 text-xs font-medium"
          style={{ color: colorConfig.accent }}
          whileHover={{ x: 2 }}
          onClick={(e) => {
            e.stopPropagation();
            window.open(event.reference_url, '_blank', 'noopener,noreferrer');
          }}
        >
          <ExternalLink className="w-3 h-3" />
          <span>View source</span>
        </motion.div>
      )}

      {/* Simple Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${colorConfig.accent}08, transparent, ${colorConfig.accent}08)`,
        }}
        animate={{
          opacity: isHovered ? [0.2, 0.4, 0.2] : 0
        }}
        transition={{
          duration: 2,
          repeat: isHovered ? Infinity : 0,
          ease: "easeInOut"
        }}
      />

      {/* Reveal Animation Indicator */}
      <motion.div
        className="absolute top-2 left-2 w-1 h-1 rounded-full"
        style={{ backgroundColor: colorConfig.accent }}
        initial={{ scale: 0 }}
        animate={{ 
          scale: [0, 1.5, 1],
          opacity: [0, 1, 0.7]
        }}
        transition={{ 
          duration: 0.8,
          delay: revealIndex * 0.15,
          ease: "easeOut"
        }}
      />
    </motion.div>
  );
}