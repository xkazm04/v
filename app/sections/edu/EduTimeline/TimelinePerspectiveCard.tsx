'use client';
import { motion } from 'framer-motion';
import { PerspectiveConfig, MilestoneEvent } from '../TimelineVertical';
import { ExternalLink, Quote } from 'lucide-react';

interface TimelinePerspectiveCardProps {
  config: PerspectiveConfig;
  content: string;
  isHovered: boolean;
  event: MilestoneEvent;
  isDark: boolean;
  colors: any;
}

const getColorClasses = (color: string, isDark: boolean) => {
  const colorMap = {
    blue: {
      bg: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 246, 255, 0.8)',
      border: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)',
      text: isDark ? 'rgba(96, 165, 250, 1)' : 'rgba(29, 78, 216, 1)',
      accent: isDark ? 'rgba(59, 130, 246, 1)' : 'rgba(37, 99, 235, 1)'
    },
    emerald: {
      bg: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(236, 253, 245, 0.8)',
      border: isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)',
      text: isDark ? 'rgba(52, 211, 153, 1)' : 'rgba(6, 120, 95, 1)',
      accent: isDark ? 'rgba(16, 185, 129, 1)' : 'rgba(5, 150, 105, 1)'
    },
    amber: {
      bg: isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 251, 235, 0.8)',
      border: isDark ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.2)',
      text: isDark ? 'rgba(251, 191, 36, 1)' : 'rgba(146, 64, 14, 1)',
      accent: isDark ? 'rgba(245, 158, 11, 1)' : 'rgba(217, 119, 6, 1)'
    },
    purple: {
      bg: isDark ? 'rgba(147, 51, 234, 0.1)' : 'rgba(250, 245, 255, 0.8)',
      border: isDark ? 'rgba(147, 51, 234, 0.3)' : 'rgba(147, 51, 234, 0.2)',
      text: isDark ? 'rgba(168, 85, 247, 1)' : 'rgba(107, 33, 168, 1)',
      accent: isDark ? 'rgba(147, 51, 234, 1)' : 'rgba(126, 34, 206, 1)'
    }
  };

  return colorMap[color as keyof typeof colorMap] || colorMap.blue;
};

export default function TimelinePerspectiveCard({
  config,
  content,
  isHovered,
  event,
  isDark,
  colors
}: TimelinePerspectiveCardProps) {
  
  const colorClasses = getColorClasses(config.color, isDark);

  return (
    <motion.div
      className="relative p-6 rounded-2xl border-2 backdrop-blur-sm cursor-pointer"
      style={{
        backgroundColor: colorClasses.bg,
        borderColor: isHovered ? colorClasses.accent : colorClasses.border,
        boxShadow: isHovered 
          ? `0 20px 40px -10px ${colorClasses.accent}30`
          : `0 8px 25px -5px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`
      }}
      whileHover={{ 
        scale: 1.02,
        y: -2
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
          style={{
            backgroundColor: colorClasses.accent + '20',
            color: colorClasses.accent
          }}
          animate={{
            rotate: isHovered ? [0, 5, -5, 0] : 0
          }}
          transition={{ duration: 0.5 }}
        >
          {config.icon}
        </motion.div>
        
        <div className="flex-1">
          <h4 
            className="font-bold text-sm"
            style={{ color: colorClasses.text }}
          >
            {config.label}
          </h4>
          <p 
            className="text-xs opacity-75"
            style={{ color: colorClasses.text }}
          >
            {config.description}
          </p>
        </div>
      </div>

      {/* Quote Indicator */}
      <motion.div 
        className="absolute top-4 right-4"
        animate={{ rotate: isHovered ? 15 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <Quote 
          className="w-4 h-4" 
          style={{ color: colorClasses.accent + '60' }}
        />
      </motion.div>

      {/* Content */}
      <motion.p 
        className="text-sm leading-relaxed mb-4"
        style={{ color: isDark ? colors.foreground : colorClasses.text }}
        animate={{ 
          opacity: isHovered ? 1 : 0.9 
        }}
      >
        {content}
      </motion.p>

      {/* Connection to Source */}
      {event.reference_url && (
        <motion.div
          className="flex items-center gap-2 text-xs font-medium"
          style={{ color: colorClasses.accent }}
          whileHover={{ x: 3 }}
        >
          <ExternalLink className="w-3 h-3" />
          <span>View source</span>
        </motion.div>
      )}

      {/* Perspective Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${colorClasses.accent}10, transparent, ${colorClasses.accent}10)`,
        }}
        animate={{
          opacity: isHovered ? [0.3, 0.6, 0.3] : 0
        }}
        transition={{
          duration: 2,
          repeat: isHovered ? Infinity : 0,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
}