import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';
import { ShimmerEffect } from './header/ShimmerEffect';
import { BackgroundPattern } from './header/BackgroundPattern';
import { getFactCheckVerdict } from '@/app/utils/videoUtils';
import { headerVariants } from '../animations/variants/playerVariants';
import { VideoWithTimestamps } from '@/app/types/video_api';
import { FloatingVerdictIcon } from '../ui/Decorative/FloatingVerdictIcon';
import VideoPlayerVoting from './header/VideoPlayerVoting';

interface VideoPlayerHeaderProps {
  video: VideoWithTimestamps;
  isVisible?: boolean;
  isMobile?: boolean;
  className?: string;
  headerIndex?: number; // For multiple headers
  totalHeaders?: number; // For positioning multiple headers
}


export const VideoPlayerHeader = memo(function VideoPlayerHeader({
  video,
  isVisible = true,
  isMobile = false,
  className,
  headerIndex = 0,
  totalHeaders = 1
}: VideoPlayerHeaderProps) {
  const { colors, isDark } = useLayoutTheme();
  const factCheckInfo = getFactCheckVerdict(video.factCheck);
  const headerSpacing = isMobile ? 220 : 260; // Height + margin
  const topPosition = 16 + (headerIndex * headerSpacing);

  // Enhanced glass effect styles - more compact
  const glassStyles = {
    background: isDark
      ? `linear-gradient(135deg, 
          rgba(15, 23, 42, 0.95) 0%,
          rgba(30, 41, 59, 0.9) 50%,
          rgba(51, 65, 85, 0.95) 100%
        )`
      : `linear-gradient(135deg, 
          rgba(255, 255, 255, 0.98) 0%,
          rgba(248, 250, 252, 0.95) 50%,
          rgba(241, 245, 249, 0.98) 100%
        )`,
    backdropFilter: 'blur(20px) saturate(2)',
    WebkitBackdropFilter: 'blur(20px) saturate(2)',
    border: `2px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.5)'}`,
    boxShadow: isDark
      ? `0 25px 50px rgba(0, 0, 0, 0.5), 
         0 0 0 1px rgba(255, 255, 255, 0.15),
         inset 0 2px 0 rgba(255, 255, 255, 0.2)`
      : `0 25px 50px rgba(0, 0, 0, 0.2), 
         0 0 0 1px rgba(255, 255, 255, 0.4),
         inset 0 2px 0 rgba(255, 255, 255, 0.6)`
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={cn(
            "absolute left-2 right-2 z-50", // Increased z-index from z-40 to z-50
            className
          )}
          style={{ 
            top: `${topPosition}px`,
            minHeight: isMobile ? "180px" : "200px" // Reduced height
          }}
        >
          <div className="rounded-3xl overflow-hidden relative" style={glassStyles}>
            {/* Background Pattern */}
            <BackgroundPattern isDark={isDark} />

            <div className={cn("relative", isMobile ? "p-5" : "p-6")}> {/* Reduced padding */}
              {/* Compact Top Section */}
              <div className="flex items-center gap-4 mb-4"> {/* Reduced gap and margin */}
                {/* Floating Verdict Icon */}
                <div className="flex-shrink-0">
                  <FloatingVerdictIcon
                    size={isMobile ? "md" : "lg"} // Reduced from lg/xl to md/lg
                    confidence={factCheckInfo?.truthPercentage || 75}
                    showConfidenceRing={true}
                    delay={0}
                    autoAnimate={true}
                    colors={{
                      glowColor: colors.primary,
                      ringColor: 'rgba(255,255,255,0.9)',
                      backgroundColor: 'rgba(255,255,255,0.15)'
                    }}
                    className="drop-shadow-2xl"
                  />
                </div>

                {/* Compact Info */}
                <div className="flex-1 min-w-0">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="space-y-2" // Reduced space
                  >
                    {/* Status Badge - Simplified */}
                    <motion.div
                      className="px-3 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider w-fit" // Added w-fit
                      style={{
                        backgroundColor: factCheckInfo ? `${colors.primary}25` : `${colors.muted}50`,
                        color: factCheckInfo ? colors.primary : colors.mutedForeground,
                        border: `2px solid ${factCheckInfo ? colors.primary : colors.border}50`
                      }}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      {factCheckInfo?.status || 'UNVERIFIED'}
                    </motion.div>

                    {/* Simplified Title */}
                    <motion.h2
                      className={cn(
                        "font-bold leading-tight",
                        isMobile ? "text-base" : "text-lg" // Reduced font size
                      )}
                      style={{ color: colors.foreground }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                    >
                      Statement Analysis
                    </motion.h2>
                  </motion.div>
                </div>

                {/* Header Index for Multiple Headers */}
                {totalHeaders > 1 && (
                  <motion.div
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      backgroundColor: `${colors.primary}20`,
                      color: colors.primary,
                      border: `2px solid ${colors.primary}40`
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    {headerIndex + 1}
                  </motion.div>
                )}
              </div>

              {/* Interactive Like/Dislike Section */}
                <VideoPlayerVoting
                  isMobile={isMobile}
                  />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});