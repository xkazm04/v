'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { MilestoneEvent, PERSPECTIVE_CONFIGS } from '../TimelineVertical';
import { Milestone } from '../sampleData';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useViewport } from '@/app/hooks/useViewport';
import TimelineEventCard from '../TimelineEventCard';
import TimelinePerspectiveCard from './TimelinePerspectiveCard';

interface TimelineEventContainerProps {
  event: MilestoneEvent;
  milestone: Milestone;
  eventIndex: number;
  activeEventId: string | null;
  expandedEventId: string | null;
  onEventHover: (eventId: string | null) => void;
  onEventExpand: (eventId: string | null) => void;
  isMilestoneActive: boolean;
  isVisible: boolean;
}

export default function TimelineEventContainer({
  event,
  milestone,
  eventIndex,
  activeEventId,
  expandedEventId,
  onEventHover,
  onEventExpand,
  isMilestoneActive,
  isVisible
}: TimelineEventContainerProps) {
  
  const { colors, mounted, isDark } = useLayoutTheme();
  const { isMobile, isTablet } = useViewport();
  const [activePerspective, setActivePerspective] = useState<string | null>(null);
  
  if (!mounted) return null;

  // Get available perspectives for this event
  const availablePerspectives = PERSPECTIVE_CONFIGS.filter(config => 
    //@ts-expect-error Ignore
    event[config.key] && event[config.key]?.trim()
  );

  // Find the active perspective config
  const activePerspectiveConfig = activePerspective 
    ? availablePerspectives.find(config => config.key === activePerspective)
    : null;

  // Responsive positioning for single perspective
  const getPerspectivePosition = (position: string) => {
    if (isMobile || isTablet) {
      return 'relative mt-8 w-full'; // Stack on mobile
    }

    switch (position) {
      case 'top-left':
        return 'absolute -top-20 -left-96 w-80';
      case 'top-right':
        return 'absolute -top-20 -right-96 w-80';
      case 'bottom-left':
        return 'absolute -bottom-20 -left-96 w-80';
      case 'bottom-right':
        return 'absolute -bottom-20 -right-96 w-80';
      default:
        return 'relative mt-8 w-full';
    }
  };

  return (
    <motion.div
      className="relative w-full flex justify-center"
      initial={{ opacity: 0, y: 40 }}
      animate={{ 
        opacity: isVisible ? 1 : 0.6, 
        y: 0,
      }}
      transition={{ 
        delay: 0.2 + eventIndex * 0.1,
        duration: 0.6,
      }}
    >
      {/* Event Container with Single Perspective */}
      <div className={`relative ${isMobile ? 'w-full' : 'w-fit'}`}>
        
        {/* Central Event Card */}
        <motion.div
          className="relative z-20"
          whileHover={{ scale: 1.005 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <TimelineEventCard
            event={event}
            milestone={milestone}
            eventIndex={eventIndex}
            activeEventId={activeEventId}
            activePerspective={activePerspective}
            onEventHover={onEventHover}
            onPerspectiveToggle={setActivePerspective}
            isMilestoneActive={isMilestoneActive}
            isVisible={isVisible}
            availablePerspectives={availablePerspectives}
          />
        </motion.div>

        {/* Single Active Perspective Card */}
        <AnimatePresence mode="wait">
          {activePerspective && activePerspectiveConfig && (
            <motion.div
              key={`${event.id}-${activePerspective}`}
              className={getPerspectivePosition(activePerspectiveConfig.position)}
              initial={{ 
                opacity: 0, 
                x: isMobile ? 0 : activePerspectiveConfig.position.includes('left') ? -30 : 30,
                y: isMobile ? 30 : activePerspectiveConfig.position.includes('top') ? -30 : 30
              }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: 0,
                y: 0
              }}
              exit={{ 
                opacity: 0, 
                x: isMobile ? 0 : activePerspectiveConfig.position.includes('left') ? -30 : 30,
                y: isMobile ? 30 : activePerspectiveConfig.position.includes('top') ? -30 : 30
              }}
              transition={{ 
                duration: 0.4,
                type: 'spring',
                stiffness: 300,
                damping: 25
              }}
            >
              <TimelinePerspectiveCard
                config={activePerspectiveConfig}
                content={event[activePerspectiveConfig.key] as string}
                isHovered={true}
                event={event}
                isDark={isDark}
                colors={colors}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Perspective Available Indicator */}
        {availablePerspectives.length > 0 && !activePerspective && (
          <motion.div
            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-30"
            animate={{
              y: [0, -8, 0],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colors.primary }}
            />
          </motion.div>
        )}
      </div>

      {/* Mobile Perspective Hint */}
      {(isMobile || isTablet) && availablePerspectives.length > 0 && !activePerspective && (
        <motion.div
          className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-xs font-medium" style={{ color: colors.primary }}>
            Tap buttons to explore perspectives
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}