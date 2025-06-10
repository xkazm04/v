'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { MilestoneEvent, PerspectiveConfig } from './TimelineVertical';
import { Milestone } from './sampleData';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useViewport } from '@/app/hooks/useViewport';
import { ExternalLink, Brain, DollarSign, Lightbulb, Search } from 'lucide-react';

interface TimelineEventCardProps {
  event: MilestoneEvent;
  milestone: Milestone;
  eventIndex: number;
  activeEventId: string | null;
  activePerspective: string | null;
  onEventHover: (eventId: string | null) => void;
  onPerspectiveToggle: (perspective: string | null) => void;
  isMilestoneActive: boolean;
  isVisible: boolean;
  availablePerspectives: PerspectiveConfig[];
}

const PERSPECTIVE_ICONS = {
  text_1: Search,
  text_2: DollarSign,
  text_3: Lightbulb,
  text_4: Brain,
} as const;

const PERSPECTIVE_COLORS = {
  text_1: {
    bg: 'rgba(59, 130, 246, 0.1)',
    border: 'rgba(59, 130, 246, 0.3)',
    text: 'rgba(59, 130, 246, 1)',
    hover: 'rgba(59, 130, 246, 0.2)'
  },
  text_2: {
    bg: 'rgba(16, 185, 129, 0.1)',
    border: 'rgba(16, 185, 129, 0.3)',
    text: 'rgba(16, 185, 129, 1)',
    hover: 'rgba(16, 185, 129, 0.2)'
  },
  text_3: {
    bg: 'rgba(245, 158, 11, 0.1)',
    border: 'rgba(245, 158, 11, 0.3)',
    text: 'rgba(245, 158, 11, 1)',
    hover: 'rgba(245, 158, 11, 0.2)'
  },
  text_4: {
    bg: 'rgba(147, 51, 234, 0.1)',
    border: 'rgba(147, 51, 234, 0.3)',
    text: 'rgba(147, 51, 234, 1)',
    hover: 'rgba(147, 51, 234, 0.2)'
  }
} as const;

export default function TimelineEventCard({
  event,
  milestone,
  eventIndex,
  activeEventId,
  activePerspective,
  onEventHover,
  onPerspectiveToggle,
  isMilestoneActive,
  isVisible,
  availablePerspectives
}: TimelineEventCardProps) {
  
  const { colors, mounted, isDark } = useLayoutTheme();
  const { isMobile, isDesktop } = useViewport();
  const [isHovered, setIsHovered] = useState(false);
  
  const isEventActive = event.id === activeEventId;
  const hasActivePerspective = activePerspective !== null;
  
  if (!mounted) return null;

  const handleHover = (hovering: boolean) => {
    setIsHovered(hovering);
    onEventHover(hovering ? event.id : null);
  };

  const handlePerspectiveClick = (perspectiveKey: string) => {
    if (activePerspective === perspectiveKey) {
      onPerspectiveToggle(null); // Close if same perspective
    } else {
      onPerspectiveToggle(perspectiveKey); // Open new perspective
    }
  };

  const handleResourceClick = () => {
    if (event.reference_url) {
      window.open(event.reference_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      className="relative group max-w-3xl w-full"
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Main Event Card */}
      <motion.div
        className="relative rounded-3xl border-2 backdrop-blur-sm transition-all duration-300 overflow-hidden"
        style={{
          backgroundColor: hasActivePerspective
            ? colors.primary + '08'
            : isEventActive 
              ? colors.primary + '05'
              : colors.background,
          borderColor: hasActivePerspective
            ? colors.primary
            : isEventActive 
              ? colors.primary + '60'
              : isHovered 
                ? colors.primary + '40'
                : colors.border,
          boxShadow: hasActivePerspective
            ? `0 25px 50px -10px ${colors.primary}30`
            : isEventActive
              ? `0 20px 40px -10px ${colors.primary}20`
              : isHovered
                ? `0 12px 30px -5px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.15)'}`
                : `0 4px 12px -2px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`
        }}
      >
        {/* Content Area */}
        <div className="p-8 pb-4">
          {/* Status Indicators */}
          <div className="absolute top-6 right-6 flex items-center gap-3">
            <motion.div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors.primary }}
              animate={{
                scale: isEventActive ? [1, 1.3, 1] : 1,
                opacity: isEventActive ? [0.7, 1, 0.7] : 0.7
              }}
              transition={{
                duration: 2,
                repeat: isEventActive ? Infinity : 0,
                ease: "easeInOut"
              }}
            />
          </div>

          {/* Event Title */}
          <motion.h3 
            className={`font-bold mb-6 transition-colors duration-300 ${
              isDesktop ? 'text-3xl' : 'text-2xl'
            }`}
            style={{
              color: hasActivePerspective || isEventActive 
                ? colors.primary 
                : isHovered 
                  ? colors.primary 
                  : colors.foreground
            }}
          >
            {event.title}
          </motion.h3>

          {/* Event Description */}
          <motion.p 
            className={`mb-6 leading-relaxed ${
              isDesktop ? 'text-lg' : 'text-base'
            }`}
            style={{ color: colors.foreground }}
          >
            {event.description}
          </motion.p>
        </div>

        {/* Bottom Button Bar */}
        <motion.div
          className="border-t backdrop-blur-sm"
          style={{
            borderColor: colors.border,
            backgroundColor: isDark 
              ? 'rgba(15, 23, 42, 0.8)' 
              : 'rgba(248, 250, 252, 0.8)'
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: isHovered || isEventActive || hasActivePerspective ? 1 : 0.7,
            y: 0 
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-center gap-2 p-4">
            {/* Perspective Buttons */}
            {availablePerspectives.map((config, index) => {
              const Icon = PERSPECTIVE_ICONS[config.key as keyof typeof PERSPECTIVE_ICONS];
              const colorConfig = PERSPECTIVE_COLORS[config.key as keyof typeof PERSPECTIVE_COLORS];
              const isActive = activePerspective === config.key;
              
              return (
                <motion.button
                  key={config.key}
                  onClick={() => handlePerspectiveClick(config.key)}
                  className="relative flex items-center justify-center w-12 h-12 rounded-xl border-2 backdrop-blur-sm transition-all duration-200 group/btn"
                  style={{
                    backgroundColor: isActive 
                      ? colorConfig.bg 
                      : isDark 
                        ? 'rgba(30, 41, 59, 0.5)' 
                        : 'rgba(248, 250, 252, 0.5)',
                    borderColor: isActive 
                      ? colorConfig.border 
                      : colors.border,
                    color: isActive 
                      ? colorConfig.text 
                      : colors.foreground
                  }}
                  whileHover={{ 
                    backgroundColor: isActive ? colorConfig.hover : colorConfig.bg
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.1 + index * 0.05,
                    type: 'spring',
                    stiffness: 300,
                    damping: 20
                  }}
                >
                  <Icon className="w-5 h-5" />
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                      style={{ backgroundColor: colorConfig.text }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.button>
              );
            })}

            {/* Divider */}
            {availablePerspectives.length > 0 && event.reference_url && (
              <div 
                className="w-px h-8 mx-2"
                style={{ backgroundColor: colors.border }}
              />
            )}

            {/* Resource Button */}
            {event.reference_url && (
              <motion.button
                onClick={handleResourceClick}
                className="relative flex items-center justify-center w-12 h-12 rounded-xl border-2 backdrop-blur-sm transition-all duration-200 group/btn"
                style={{
                  backgroundColor: isDark 
                    ? 'rgba(30, 41, 59, 0.5)' 
                    : 'rgba(248, 250, 252, 0.5)',
                  borderColor: colors.border,
                  color: colors.foreground
                }}
                whileHover={{ 
                  y: -2,
                  backgroundColor: colors.primary + '15',
                  borderColor: colors.primary,
                  color: colors.primary
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.1 + availablePerspectives.length * 0.05,
                  type: 'spring',
                  stiffness: 300,
                  damping: 20
                }}
              >
                <ExternalLink className="w-5 h-5" />
              </motion.button>
            )}
          </div>

          {/* Button Bar Glow Effect */}
          {(isHovered || hasActivePerspective) && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(90deg, transparent, ${colors.primary}10, transparent)`
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.div>

        {/* Enhanced Border Glow */}
        {(isHovered || isEventActive || hasActivePerspective) && (
          <motion.div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              background: `linear-gradient(45deg, ${colors.primary}08, transparent, ${colors.primary}08)`,
            }}
            animate={{
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}