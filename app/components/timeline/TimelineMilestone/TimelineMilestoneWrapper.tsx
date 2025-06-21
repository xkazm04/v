'use client';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { ReactNode } from 'react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useViewport } from '@/app/hooks/useViewport';
import { useTimelineAudioStore } from '@/app/stores/useTimelineAudioStore';
import { Volume2 } from 'lucide-react';
import { Milestone } from '../../../types/timeline';

interface TimelineMilestoneWrapperProps {
  milestone: Milestone;
  index: number;
  activeMilestoneId: string | null;
  scrollProgress: MotionValue<number>;
  children: ReactNode;
}

export default function TimelineMilestoneWrapper({
  milestone,
  index,
  activeMilestoneId,
  scrollProgress,
  children
}: TimelineMilestoneWrapperProps) {
  const { colors } = useLayoutTheme();
  const { isMobile } = useViewport();
  
  // Get playing state from audio store
  const { activeComponentId, activeComponentType, isPlaying, currentTrack } = useTimelineAudioStore();
  
  // Check if this milestone is currently playing
  const isCurrentlyPlaying = activeComponentType === 'milestone' && 
                            activeComponentId === milestone.id && 
                            isPlaying && 
                            currentTrack?.type === 'milestone_context';

  const milestoneProgress = useTransform(
    scrollProgress,
    [index * 0.15, index * 0.15 + 0.1, index * 0.15 + 0.2],
    [0, 0.5, 1]
  );

  const milestoneScale = useTransform(milestoneProgress, [0, 1], [0.95, 1]);
  const milestoneY = useTransform(milestoneProgress, [0, 1], [40, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  return (
    <motion.section
      id={milestone.id}
      data-milestone-id={milestone.id}
      className={`relative ${isMobile ? 'mb-10' : 'mb-16'}`}
      style={{
        opacity: index === 0 ? 1 : milestoneProgress,
        scale: milestoneScale,
        y: milestoneY,
        backgroundColor: isCurrentlyPlaying ? colors.primary + '03' : 'transparent',
        borderRadius: isCurrentlyPlaying ? '16px' : '0px',
        padding: isCurrentlyPlaying ? '16px' : '0px',
        transition: 'all 0.3s ease'
        // REMOVED: scrollSnapAlign and other problematic properties
      }}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {/* Playing Indicator */}
      {isCurrentlyPlaying && (
        <motion.div
          className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full border z-40"
          style={{
            backgroundColor: colors.primary + '10',
            borderColor: colors.primary + '30',
            color: colors.primary
          }}
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Volume2 className="w-3 h-3" />
          </motion.div>
          <span className="text-xs font-medium">Playing</span>
        </motion.div>
      )}

      {/* Main Content Container - ONLY milestone content, no events */}
      <div className="w-full max-w-6xl mx-auto px-4">
        {children}
      </div>
    </motion.section>
  );
}