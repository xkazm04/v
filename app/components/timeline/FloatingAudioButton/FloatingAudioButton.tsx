import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2 } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useViewport } from '@/app/hooks/useViewport';
import { useTimelineAudioStore } from '@/app/stores/useTimelineAudioStore';
import { useMemo, useCallback } from 'react';
import { Milestone } from '@/app/types/timeline';

interface FloatingAudioButtonProps {
  isVisible: boolean;
  milestones: Milestone[];
  className?: string;
}

export default function FloatingAudioButton({
  isVisible,
  milestones,
  className = ''
}: FloatingAudioButtonProps) {
  const { colors, isDark } = useLayoutTheme();
  const { isMobile } = useViewport();
  const {
    tracks,
    currentTrackId,
    isPlaying,
    isLoading,
    getTrackByProgressId,
    playTrack,
    pauseTrack
  } = useTimelineAudioStore();

  // Get the first available track for the button
  const firstAvailableTrack = useMemo(() => {
    // Try to get hero track first
    const heroTrack = getTrackByProgressId('hero');
    if (heroTrack) {
      return {
        track: heroTrack,
        title: 'Timeline Summary',
        subtitle: 'Audio overview'
      };
    }

    // Fall back to first milestone
    if (milestones.length > 0) {
      const firstMilestone = milestones[0];
      const milestoneTrack = getTrackByProgressId(firstMilestone.id);
      if (milestoneTrack) {
        return {
          track: milestoneTrack,
          title: firstMilestone.title,
          subtitle: 'Play timeline'
        };
      }
    }

    return null;
  }, [milestones, getTrackByProgressId]);

  // Handle play/pause audio
  const handlePlayAudio = useCallback(async () => {
    if (!firstAvailableTrack) return;

    const track = firstAvailableTrack.track;
    
    if (currentTrackId === track.id && isPlaying) {
      // Pause current track
      pauseTrack();
      window.dispatchEvent(new CustomEvent('timeline-audio-pause'));
    } else {
      // Start/resume track
      playTrack(track.id);
      
      // Dispatch custom event for audio generation
      window.dispatchEvent(new CustomEvent('timeline-audio-play', {
        detail: { track }
      }));
    }
  }, [firstAvailableTrack, currentTrackId, isPlaying, playTrack, pauseTrack]);

  // Don't render if no tracks available
  if (!firstAvailableTrack) {
    return null;
  }

  const isCurrentlyPlaying = currentTrackId === firstAvailableTrack.track.id && isPlaying;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25,
            duration: 0.4 
          }}
          className={`relative z-[9998] ${className}`}
          style={{
            top: isMobile ? '20px' : '24px',
            right: isMobile ? '16px' : '24px',
          }}
        >
          <motion.button
            onClick={handlePlayAudio}
            disabled={isLoading}
            className="group relative overflow-hidden"
            style={{
              backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(248, 250, 252, 0.95)',
              borderRadius: isMobile ? '12px' : '16px',
              border: `1px solid ${colors.border}`,
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: `0 8px 32px ${isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
              willChange: 'transform'
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: `0 12px 40px ${isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.15)'}`
            }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Animated background gradient */}
            <motion.div
              className="absolute inset-0 opacity-20"
              style={{
                background: `linear-gradient(45deg, ${colors.primary}30, ${colors.primary}10)`,
                borderRadius: 'inherit'
              }}
              animate={{
                background: isCurrentlyPlaying 
                  ? `linear-gradient(45deg, ${colors.primary}40, ${colors.primary}20)`
                  : `linear-gradient(45deg, ${colors.primary}30, ${colors.primary}10)`
              }}
              transition={{ duration: 0.3 }}
            />
            
            <div className={`relative flex items-center gap-3 ${isMobile ? 'px-4 py-3' : 'px-5 py-4'}`}>
              {/* Play/Pause Icon */}
              <div className="relative">
                <motion.div
                  className="flex items-center justify-center"
                  style={{
                    width: isMobile ? '24px' : '28px',
                    height: isMobile ? '24px' : '28px',
                    borderRadius: '50%',
                    backgroundColor: colors.primary + '20',
                    color: colors.primary
                  }}
                  animate={{
                    backgroundColor: isCurrentlyPlaying 
                      ? colors.primary + '30' 
                      : colors.primary + '20'
                  }}
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, rotate: 0 }}
                        animate={{ opacity: 1, rotate: 360 }}
                        exit={{ opacity: 0 }}
                        transition={{ 
                          rotate: { repeat: Infinity, duration: 1, ease: "linear" },
                          opacity: { duration: 0.2 }
                        }}
                      >
                        <Volume2 size={isMobile ? 12 : 14} />
                      </motion.div>
                    ) : isCurrentlyPlaying ? (
                      <motion.div
                        key="pause"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Pause size={isMobile ? 12 : 14} fill="currentColor" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="play"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Play size={isMobile ? 12 : 14} fill="currentColor" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Pulsing ring effect when playing */}
                <AnimatePresence>
                  {isCurrentlyPlaying && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2"
                      style={{ borderColor: colors.primary + '60' }}
                      initial={{ scale: 1, opacity: 0.6 }}
                      animate={{ 
                        scale: [1, 1.3, 1], 
                        opacity: [0.6, 0, 0.6] 
                      }}
                      exit={{ scale: 1, opacity: 0 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Text Content - Hide on very small mobile screens */}
              {(!isMobile || window.innerWidth > 375) && (
                <div className="flex flex-col items-start min-w-0">
                  <motion.span
                    className={`font-semibold ${isMobile ? 'text-sm' : 'text-base'} truncate`}
                    style={{ color: colors.foreground }}
                    animate={{
                      color: isCurrentlyPlaying ? colors.primary : colors.foreground
                    }}
                  >
                    {isCurrentlyPlaying ? 'Loading...' : 'Play Audio'}
                  </motion.span>
                  <motion.span
                    className={`${isMobile ? 'text-xs' : 'text-sm'} truncate`}
                    style={{ color: colors.mutedForeground }}
                  >
                    {firstAvailableTrack.subtitle}
                  </motion.span>
                </div>
              )}
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}