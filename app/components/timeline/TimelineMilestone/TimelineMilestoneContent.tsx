'use client';
import { motion, MotionValue, Variants } from 'framer-motion';
import { useMemo } from 'react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useViewport } from '@/app/hooks/useViewport';
import { useTimelineAudioStore } from '@/app/stores/useTimelineAudioStore';
import { Milestone } from '../../../types/timeline';
import { GlassContainer } from '@/app/components/ui/containers/GlassContainer';
import TimelineMilestoneDateBadge from './TimelineMilestoneDateBadge';
import TimelineMilestoneImpact from './TimelineMilestoneImpact';

interface TimelineMilestoneContentProps {
  milestone: Milestone;
  index: number;
  activeMilestoneId: string | null;
  headerOpacity: MotionValue<number>;
  contentOpacity: MotionValue<number>;
}

export default function TimelineMilestoneContent({
  milestone,
  index,
  activeMilestoneId,
  headerOpacity,
  contentOpacity
}: TimelineMilestoneContentProps) {
  const { colors, isDark } = useLayoutTheme();
  const { isMobile, isTablet, isDesktop } = useViewport();
  const isActive = activeMilestoneId === milestone.id;
  
  // Get playing state from audio store
  const { activeComponentId, activeComponentType, isPlaying, currentTrack } = useTimelineAudioStore();
  
  // Check if this milestone is currently playing
  const isCurrentlyPlaying = activeComponentType === 'milestone' && 
                            activeComponentId === milestone.id && 
                            isPlaying && 
                            currentTrack?.type === 'milestone_context';

  const nodeStyles = useMemo(() => ({
    active: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      boxShadow: `0 0 50px ${colors.primary}60, 0 0 100px ${colors.primary}20`
    },
    inactive: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      boxShadow: `0 12px 40px ${isDark ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.1)'}`
    },
    playing: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      boxShadow: `0 0 60px ${colors.primary}80, 0 0 120px ${colors.primary}30`
    }
  }), [colors.primary, colors.background, colors.border, isDark]);

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const floatingVariants = {
    idle: { y: 0 },
    floating: {
      y: [-2, 2, -2],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    // FIXED: Remove min-h-screen and centering - just natural content height
    <div className="w-full py-16">
      {/* Milestone Header with Badge */}
      <motion.div
        className={`relative flex items-center justify-center ${isMobile ? 'mb-8' : 'mb-10'}`}
        style={{
          opacity: index === 0 ? 1 : headerOpacity
        }}
        variants={itemVariants}
      >
        <motion.div
          className={`relative z-30 rounded-full border-2 backdrop-blur-md flex items-center justify-center ${
            isMobile ? 'w-16 h-16' : isTablet ? 'w-20 h-20' : 'w-24 h-24'
          }`}
          style={isCurrentlyPlaying ? nodeStyles.playing : (isActive ? nodeStyles.active : nodeStyles.inactive)}
          variants={floatingVariants}
          animate={isActive || isCurrentlyPlaying ? "floating" : "idle"}
          whileHover={{
            scale: 1.1,
            boxShadow: `0 0 60px ${colors.primary}70`,
            transition: { duration: 0.3 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            className={`font-black ${isMobile ? 'text-xl' : isTablet ? 'text-2xl' : 'text-3xl'}`}
            style={{ color: (isActive || isCurrentlyPlaying) ? 'white' : colors.primary }}
            animate={(isActive || isCurrentlyPlaying) ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {index + 1}
          </motion.span>
        </motion.div>

        {(isActive || isCurrentlyPlaying) && (
          <>
            {[1, 2, 3].map((ring) => (
              <motion.div
                key={ring}
                className={`absolute rounded-full border ${
                  isMobile ? 'w-16 h-16' : isTablet ? 'w-20 h-20' : 'w-24 h-24'
                }`}
                style={{ borderColor: colors.primary + '20' }}
                animate={{
                  scale: [1, 2 + ring * 0.3],
                  opacity: [0.8, 0]
                }}
                transition={{
                  duration: 2 + ring * 0.3,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: ring * 0.2
                }}
              />
            ))}
          </>
        )}

        <TimelineMilestoneDateBadge
          date={milestone.date}
          title={milestone.title}
          isActive={isActive || isCurrentlyPlaying}
          colors={colors}
        />
      </motion.div>

      {/* Milestone Content */}
      <motion.div
        className={`relative mx-auto ${isMobile ? 'mb-8' : 'mb-12'} ${
          isDesktop ? 'max-w-4xl' : isMobile ? 'max-w-full' : 'max-w-2xl'
        }`}
        style={{
          opacity: index === 0 ? 1 : contentOpacity
        }}
        variants={itemVariants}
      >
        <motion.div
          animate={(isActive || isCurrentlyPlaying) ? { y: [-1, 1, -1] } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <GlassContainer
            style="crystal"
            border={(isActive || isCurrentlyPlaying) ? "glow" : "visible"}
            shadow="xl"
            rounded="2xl"
            className={isMobile ? 'p-5' : 'p-7'}
            overlay={isActive || isCurrentlyPlaying}
            overlayOpacity={0.08}
          >
            <motion.h2
              className={`font-black tracking-tight leading-tight mb-6 ${
                isMobile ? 'text-xl' : isTablet ? 'text-2xl' : 'text-3xl'
              }`}
              style={{
                color: (isActive || isCurrentlyPlaying) ? colors.primary : colors.foreground,
                letterSpacing: '-0.025em'
              }}
              animate={(isActive || isCurrentlyPlaying) ? {
                textShadow: [
                  `0 0 20px ${colors.primary}40`, 
                  `0 0 30px ${colors.primary}60`, 
                  `0 0 20px ${colors.primary}40`
                ]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {milestone.title}
            </motion.h2>

            {milestone.context && (
              <motion.p
                className={`leading-relaxed font-light opacity-90 mb-8 ${
                  isMobile ? 'text-sm' : 'text-base'
                }`}
                style={{ color: colors.foreground }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 0.9, 
                  y: 0,
                  backgroundColor: isCurrentlyPlaying ? colors.primary + '08' : 'transparent',
                  padding: isCurrentlyPlaying ? '12px' : '0px',
                  borderRadius: isCurrentlyPlaying ? '8px' : '0px'
                }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {milestone.context}
              </motion.p>
            )}

            {milestone.consequence && (
              <motion.div className={`mb-${isMobile ? '8' : '10'}`}>
                <TimelineMilestoneImpact
                  consequence={milestone.consequence}
                  isActive={isActive || isCurrentlyPlaying}
                  isMobile={isMobile}
                  colors={colors}
                />
              </motion.div>
            )}

            {milestone.events && milestone.events.length > 0 && (
              <motion.div
                className="flex items-center justify-center gap-3 mb-6 pb-6 border-b"
                style={{ borderColor: colors.border + '20' }}
              >
                {[0, 1].map((dot) => (
                  <motion.div
                    key={dot}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: colors.primary }}
                    animate={(isActive || isCurrentlyPlaying) ? {
                      scale: [1, 1.4, 1],
                      opacity: [0.6, 1, 0.6]
                    } : {}}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: dot * 0.3,
                      ease: "easeInOut"
                    }}
                  />
                ))}
                <motion.span
                  className={`font-semibold mx-4 ${isMobile ? 'text-sm' : 'text-base'}`}
                  style={{ color: colors.primary }}
                  animate={(isActive || isCurrentlyPlaying) ? {
                    scale: [1, 1.02, 1]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {milestone.events.length} Critical {milestone.events.length === 1 ? 'Event' : 'Events'}
                </motion.span>
              </motion.div>
            )}
          </GlassContainer>
        </motion.div>
      </motion.div>
    </div>
  );
}