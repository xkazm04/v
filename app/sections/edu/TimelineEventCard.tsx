'use client';

import { motion } from 'framer-motion';
import { useState, useMemo, useCallback } from 'react';
import { MilestoneEvent, PerspectiveConfig } from './TimelineVertical';
import { Milestone } from './sampleData';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useViewport } from '@/app/hooks/useViewport';
import { ExternalLink, Brain, DollarSign, Lightbulb, Search } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface TimelineEventCardProps {
  event: MilestoneEvent;
  milestone: Milestone;
  eventIndex: number;
  activeEventId: string | null;
  activePerspectives: Set<string>;
  onEventHover: (eventId: string | null) => void;
  onPerspectiveToggle: (perspective: string) => void;
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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

export default function TimelineEventCard({
  event,
  milestone,
  eventIndex,
  activeEventId,
  activePerspectives,
  onEventHover,
  onPerspectiveToggle,
  isMilestoneActive,
  isVisible,
  availablePerspectives
}: TimelineEventCardProps) {
  
  const { colors, mounted, isDark } = useLayoutTheme();
  const { isMobile, isDesktop } = useViewport();
  const [isHovered, setIsHovered] = useState(false);
  
  // Memoized computed values for better performance
  const computedValues = useMemo(() => {
    const isEventActive = event.id === activeEventId;
    const hasActivePerspectives = activePerspectives.size > 0;
    
    const cardStyles = {
      backgroundColor: hasActivePerspectives
        ? colors.primary + '08'
        : isEventActive 
          ? colors.primary + '05'
          : colors.background,
      borderColor: hasActivePerspectives
        ? colors.primary
        : isEventActive 
          ? colors.primary + '60'
          : isHovered 
            ? colors.primary + '40'
            : colors.border,
      boxShadow: hasActivePerspectives
        ? `0 20px 40px -10px ${colors.primary}25`
        : isEventActive
          ? `0 15px 30px -10px ${colors.primary}15`
          : isHovered
            ? `0 10px 25px -5px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`
            : `0 4px 12px -2px ${isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.08)'}`
    };

    return {
      isEventActive,
      hasActivePerspectives,
      cardStyles
    };
  }, [event.id, activeEventId, activePerspectives.size, colors, isDark, isHovered]);

  const handleHover = useCallback((hovering: boolean) => {
    setIsHovered(hovering);
    onEventHover(hovering ? event.id : null);
  }, [event.id, onEventHover]);

  const handlePerspectiveClick = useCallback((perspectiveKey: string) => {
    onPerspectiveToggle(perspectiveKey);
  }, [onPerspectiveToggle]);

  const handleResourceClick = useCallback(() => {
    if (event.reference_url) {
      window.open(event.reference_url, '_blank', 'noopener,noreferrer');
    }
  }, [event.reference_url]);

  if (!mounted) return null;

  return (
    <motion.div
      className="relative group max-w-3xl w-full"
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      variants={itemVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      transition={{ delay: eventIndex * 0.1 }}
    >
      {/* Main Event Card */}
      <motion.div
        className="relative rounded-3xl border-2 backdrop-blur-sm transition-all duration-300 overflow-hidden"
        style={computedValues.cardStyles}
        whileHover={{ scale: 1.005 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {/* Status Indicator */}
        <div className="absolute top-6 right-6 flex items-center gap-3">
          <motion.div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: colors.primary }}
            animate={{
              scale: computedValues.isEventActive ? [1, 1.2, 1] : 1,
              opacity: computedValues.isEventActive ? [0.7, 1, 0.7] : 0.7
            }}
            transition={{
              duration: 2,
              repeat: computedValues.isEventActive ? Infinity : 0,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Content */}
        <div className="p-8 pb-4">
          <motion.h3 
            className={cn(
              "font-bold mb-6 transition-colors duration-300",
              isDesktop ? 'text-3xl' : 'text-2xl'
            )}
            style={{
              color: computedValues.hasActivePerspectives || computedValues.isEventActive 
                ? colors.primary 
                : isHovered 
                  ? colors.primary 
                  : colors.foreground
            }}
          >
            {event.title}
          </motion.h3>

          <motion.p 
            className={cn(
              "mb-6 leading-relaxed",
              isDesktop ? 'text-lg' : 'text-base'
            )}
            style={{ color: colors.foreground }}
          >
            {event.description}
          </motion.p>
        </div>

        {/* Control Bar */}
        <motion.div
          className="border-t backdrop-blur-sm"
          style={{
            borderColor: colors.border,
            backgroundColor: isDark 
              ? 'rgba(15, 23, 42, 0.8)' 
              : 'rgba(248, 250, 252, 0.8)'
          }}
          animate={{ 
            opacity: isHovered || computedValues.isEventActive || computedValues.hasActivePerspectives ? 1 : 0.8
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-center gap-2 p-4">
            {/* Perspective Buttons */}
            {availablePerspectives.map((config, index) => {
              const Icon = PERSPECTIVE_ICONS[config.key as keyof typeof PERSPECTIVE_ICONS];
              const isActive = activePerspectives.has(config.key);
              
              return (
                <motion.button
                  key={config.key}
                  onClick={() => handlePerspectiveClick(config.key)}
                  className={cn(
                    "relative flex items-center justify-center w-12 h-12 rounded-xl border-2",
                    "backdrop-blur-sm transition-all duration-200 group/btn"
                  )}
                  style={{
                    backgroundColor: isActive 
                      ? colors.primary + '15'
                      : isDark 
                        ? 'rgba(30, 41, 59, 0.5)' 
                        : 'rgba(248, 250, 252, 0.5)',
                    borderColor: isActive 
                      ? colors.primary 
                      : colors.border,
                    color: isActive 
                      ? colors.primary 
                      : colors.foreground
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: isActive 
                      ? colors.primary + '25' 
                      : colors.primary + '10'
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
                      style={{ backgroundColor: colors.primary }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.button>
              );
            })}

            {/* Resource Button */}
            {event.reference_url && (
              <>
                {availablePerspectives.length > 0 && (
                  <div 
                    className="w-px h-8 mx-2"
                    style={{ backgroundColor: colors.border }}
                  />
                )}
                <motion.button
                  onClick={handleResourceClick}
                  className={cn(
                    "relative flex items-center justify-center w-12 h-12 rounded-xl border-2",
                    "backdrop-blur-sm transition-all duration-200 group/btn"
                  )}
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
                  whileTap={{ scale: 0.95 }}
                >
                  <ExternalLink className="w-5 h-5" />
                </motion.button>
              </>
            )}
          </div>
        </motion.div>

        {/* Enhanced Glow Effect */}
        {(isHovered || computedValues.isEventActive || computedValues.hasActivePerspectives) && (
          <motion.div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              background: `linear-gradient(45deg, ${colors.primary}06, transparent, ${colors.primary}06)`,
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
    </motion.div>
  );
}