import { motion, useTransform, MotionValue } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { Milestone } from '../../../types/timeline';
import TimelineProgressHeader from './TimelineProgressHeader';
import TimelineProgressContent from './TimelineProgressContent';

interface TimelineProgressIndicatorProps {
  scrollProgress: MotionValue<number>;
  milestones: Milestone[];
  activeMilestoneId: string | null;
  activeEventId: string | null;
  onNavigateToMilestone?: (milestoneId: string) => void;
  onNavigateToEvent?: (eventId: string, milestoneId: string) => void;
}

export default function TimelineProgress({
  scrollProgress,
  milestones,
  activeMilestoneId,
  activeEventId,
  onNavigateToMilestone,
  onNavigateToEvent
}: TimelineProgressIndicatorProps) {
  const { colors, isDark } = useLayoutTheme();
  const indicatorOpacity = useTransform(scrollProgress, [0, 0.08, 0.92, 1], [0, 1, 1, 1]);
  const indicatorScale = useTransform(scrollProgress, [0, 0.08], [0.9, 1]);
  const progressPercentage = useTransform(scrollProgress, [0, 1], [0, 100]);
  const progressLineHeight = useTransform(scrollProgress, [0, 1], ['0%', '100%']);

  return (
    <div
      className="fixed right-6 top-1/2 -translate-y-1/2 z-[9999] 2xl:block hidden"
      style={{ 
        position: 'fixed', // Ensure fixed positioning
        right: '1.5rem',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 9999,
        pointerEvents: 'auto',
        isolation: 'isolate' // Create new stacking context
      }}
    >
      <motion.div
        style={{ 
          opacity: indicatorOpacity, 
          scale: indicatorScale,
        }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        {/* Timeline header with FloatingVerdictIcon */}
        <TimelineProgressHeader
          progressPercentage={progressPercentage}
        />
        
        <div 
          className="relative backdrop-blur-md overflow-hidden"
          style={{
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(248, 250, 252, 0.95)',
            borderRadius: '16px',
            border: `1px solid ${colors.border}`,
            borderLeft: 'none',
            willChange: 'transform'
          }}
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
                backgroundColor: colors.primary,
                height: progressLineHeight,
                boxShadow: `2px 0 8px ${colors.primary}30`,
                willChange: 'height'
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 30,
                restDelta: 0.001
              }}
            />
          </div>

          {/* Vertical timeline with improved scrolling */}
          <TimelineProgressContent
            milestones={milestones}
            activeMilestoneId={activeMilestoneId}
            activeEventId={activeEventId}
            onNavigateToMilestone={onNavigateToMilestone}
            onNavigateToEvent={onNavigateToEvent}
          />

          {/* Footer with navigation hint */}
          <div className="px-4 py-2 border-t text-center" style={{ borderColor: colors.border + '30' }}>
            <span className="text-xs opacity-60" style={{ color: colors.foreground }}>
              Click to navigate • Scroll to explore
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}