'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo, useCallback } from 'react';
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
  onEventHover: (eventId: string | null) => void;
  isMilestoneActive: boolean;
  isVisible: boolean;
}

const PERSPECTIVE_POSITIONS = [
  { x: -420, y: -80, position: 'top-left' },
  { x: 420, y: -80, position: 'top-right' },
  { x: -420, y: 80, position: 'bottom-left' },
  { x: 420, y: 80, position: 'bottom-right' }
];

export default function TimelineEventContainer({
  event,
  milestone,
  eventIndex,
  activeEventId,
  onEventHover,
  isMilestoneActive,
  isVisible
}: TimelineEventContainerProps) {

  const { colors, mounted, isDark } = useLayoutTheme();
  const { isMobile, isTablet, isDesktop } = useViewport();

  const [activePerspectives, setActivePerspectives] = useState<Set<string>>(new Set());

  // Memoized available perspectives
  const availablePerspectives = useMemo(() =>
    PERSPECTIVE_CONFIGS.filter(config =>
      //@ts-expect-error - Type assertion for event perspective keys
      event[config.key] && event[config.key]?.trim()
    ), [event]
  );

  // Initialize perspectives based on device type
  useEffect(() => {
    if (!mounted || !availablePerspectives.length) return;

    if (isDesktop) {
      // Desktop: Enable all perspectives by default
      const allPerspectives = new Set(availablePerspectives.map(config => config.key));
      setActivePerspectives(allPerspectives);
    } else {
      // Mobile/Tablet: Start with no perspectives
      setActivePerspectives(new Set());
    }
  }, [mounted, isDesktop, availablePerspectives]);

  const handlePerspectiveToggle = useCallback((perspective: string) => {
    setActivePerspectives(prev => {
      const newSet = new Set(prev);
      if (newSet.has(perspective)) {
        newSet.delete(perspective);
      } else {
        newSet.add(perspective);
      }
      return newSet;
    });
  }, []);

  const getResponsivePosition = (perspectiveIndex: number) => {
    if (isMobile) {
      return {
        position: 'relative' as const,
        className: 'mt-6 w-full'
      };
    }

    if (isTablet) {
      const isEven = perspectiveIndex % 2 === 0;
      return {
        position: 'absolute' as const,
        className: isEven ? 'absolute -left-80 w-72' : 'absolute -right-80 w-72',
        style: {
          top: `${perspectiveIndex * 120}px`
        }
      };
    }

    // Desktop positioning
    const posConfig = PERSPECTIVE_POSITIONS[perspectiveIndex % PERSPECTIVE_POSITIONS.length];
    return {
      position: 'absolute' as const,
      className: 'absolute w-80',
      style: {
        left: posConfig.x > 0 ? 'auto' : `${posConfig.x}px`,
        right: posConfig.x > 0 ? `${-posConfig.x}px` : 'auto',
        top: `${posConfig.y}px`
      }
    };
  };

  // Simple reveal animation variants
  const perspectiveVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20
    },
    visible: (custom: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: custom * 0.1, // Staggered delay based on perspective index
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    }),
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: { duration: 0.3 }
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
      {/* Event Container */}
      <div className={`relative ${isMobile ? 'w-full' : 'w-fit'} z-20 min-h-[500px]`}>

        {/* Central Event Card */}
        <TimelineEventCard
          event={event}
          milestone={milestone}
          eventIndex={eventIndex}
          activeEventId={activeEventId}
          activePerspectives={activePerspectives}
          onEventHover={onEventHover}
          onPerspectiveToggle={handlePerspectiveToggle}
          isMilestoneActive={isMilestoneActive}
          isVisible={isVisible}
          availablePerspectives={availablePerspectives}
        />

        {/* Multiple Active Perspective Cards */}
        <AnimatePresence mode="sync">
          <div className="flex flex-col h-full justify-between">
            {availablePerspectives.map((config, index) => {
              const isActive = activePerspectives.has(config.key);

              if (!isActive) return null;

              const positioning = getResponsivePosition(index);

              return (
                <motion.div
                  key={`${event.id}-${config.key}`}
                  className={positioning.className}
                  style={positioning.style}
                  variants={perspectiveVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={index}
                >
                  <TimelinePerspectiveCard
                    config={config}
                    content={event[config.key] as string}
                    isHovered={true}
                    event={event}
                    isDark={isDark}
                    colors={colors}
                    revealIndex={index}
                  />
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>

        {/* Desktop Multi-Perspective Indicator */}
        {isDesktop && activePerspectives.size > 1 && (
          <motion.div
            className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <motion.div
              className="px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-md"
              style={{
                backgroundColor: colors.primary + '15',
                borderColor: colors.primary + '30',
                color: colors.primary
              }}
              animate={{
                y: [0, -2, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {activePerspectives.size} perspectives active
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Mobile Perspective Hint */}
      {(isMobile || isTablet) && availablePerspectives.length > 0 && activePerspectives.size === 0 && (
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