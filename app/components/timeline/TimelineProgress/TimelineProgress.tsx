import { motion, useTransform, MotionValue } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { Milestone } from '../../../types/timeline';
import TimelineProgressHeader from './TimelineProgressHeader';
import TimelineProgressContent from './TimelineProgressContent';
import TimelineProgressFooter from './TimelineProgressFooter';
import { useViewport } from '@/app/hooks/useViewport';
import { useMemo, useCallback } from 'react';

interface TimelineProgressProps {
  scrollProgress: MotionValue<number>;
  milestones: Milestone[];
  activeMilestoneId: string | null;
  activeEventId: string | null;
  onNavigateToMilestone?: (milestoneId: string) => void;
  onNavigateToEvent?: (eventId: string, milestoneId: string) => void;
  hasScrolled?: boolean;
}

export default function TimelineProgress({
  scrollProgress,
  milestones,
  activeMilestoneId,
  activeEventId,
  onNavigateToMilestone,
  onNavigateToEvent,
  hasScrolled = false
}: TimelineProgressProps) {
  const { colors, isDark } = useLayoutTheme();
  const { isHd } = useViewport();
  
  // Move all useTransform calls to top level - FIXED!
  const indicatorOpacity = useTransform(
    scrollProgress, 
    [0, 0.02, 0.08, 0.92, 1], 
    [0, hasScrolled ? 0.8 : 0, 1, 1, 1]
  );
  
  const indicatorScale = useTransform(scrollProgress, [0, 0.08], [0.9, 1]);
  
  const scrollProgressPercentage = useTransform(scrollProgress, [0, 1], [0, 100]);
  
  const progressLineHeight = useTransform(scrollProgress, [0, 1], ['0%', '100%']);

  // Stable callback handlers
  const handleNavigateToMilestone = useCallback((milestoneId: string) => {
    onNavigateToMilestone?.(milestoneId);
  }, [onNavigateToMilestone]);

  const handleNavigateToEvent = useCallback((eventId: string, milestoneId: string) => {
    onNavigateToEvent?.(eventId, milestoneId);
  }, [onNavigateToEvent]);


  // Memoize style objects (no hooks inside!)
  const progressContainerStyle = useMemo(() => ({
    backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(248, 250, 252, 0.95)',
    borderRadius: '16px',
    border: `1px solid ${colors.border}`,
    borderLeft: 'none',
    borderBottom: 'none',
    willChange: 'transform'
  }), [isDark, colors.border]);

  const progressLineStyle = useMemo(() => ({
    backgroundColor: colors.primary,
    boxShadow: `2px 0 8px ${colors.primary}30`,
    willChange: 'height'
  }), [colors.primary]);

  return (
    <>
      <div
        className={`fixed right-6 -translate-y-1/2 z-[9999] 2xl:block hidden isolate
            ${isHd ? 'pr-[10%] top-[50%]' : 'pr-6 top-[30%]'}
          `}
      >
        <motion.div
          style={{
            opacity: indicatorOpacity,
            scale: indicatorScale,
          }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ 
            opacity: hasScrolled ? 1 : 0, 
            x: hasScrolled ? 0 : 50 
          }}
          transition={{ 
            delay: hasScrolled ? 0.3 : 0, 
            duration: 0.6,
            ease: "easeOut"
          }}
          className='relative'
        >
          <div
            className="relative backdrop-blur-md overflow-hidden"
            style={progressContainerStyle}
          >
            {/* Progress line as left border */}
            <div className="absolute left-0 top-0 bottom-0 w-1">
              <div
                className="absolute inset-0 w-full"
                style={{ backgroundColor: colors.border }}
              />

              {/* Animated progress line */}
              <motion.div
                className="absolute top-0 left-0 w-full origin-top"
                style={{
                  ...progressLineStyle,
                  height: progressLineHeight,
                }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 30,
                  restDelta: 0.001
                }}
              />
            </div>

            {/* Vertical timeline with audio controls */}
            <TimelineProgressContent
              milestones={milestones}
              activeMilestoneId={activeMilestoneId}
              activeEventId={activeEventId}
              onNavigateToMilestone={handleNavigateToMilestone}
              onNavigateToEvent={handleNavigateToEvent}
            />
          </div>

          <TimelineProgressFooter />
          <TimelineProgressHeader
            scrollProgressPercentage={scrollProgressPercentage}
          />
        </motion.div>
      </div>
    </>
  );
}