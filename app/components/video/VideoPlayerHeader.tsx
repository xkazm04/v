'use client';

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';
import { FactCheckBadge } from './header/FactCheckBadge';
import { ConfidenceProgressBar } from './header/ConfidenceProgressBar';
import { ShimmerEffect } from './header/ShimmerEffect';
import { BackgroundPattern } from './header/BackgroundPattern';
import { getFactCheckVerdict } from '@/app/utils/videoUtils';
import { headerVariants } from '../animations/variants/playerVariants';
import { VideoWithTimestamps } from '@/app/types/video_api';


interface VideoPlayerHeaderProps {
  video: VideoWithTimestamps;
  isVisible?: boolean;
  isMobile?: boolean;
  className?: string;
}

export const VideoPlayerHeader = memo(function VideoPlayerHeader({
  video,
  isVisible = true,
  isMobile = false,
  className
}: VideoPlayerHeaderProps) {
  const { colors, isDark, mounted } = useLayoutTheme();

  //@ts-expect-error Ignore
  const factCheckInfo = getFactCheckVerdict(video.factCheck);

  // Enhanced glass effect styles
  const glassStyles = {
    background: isDark
      ? `linear-gradient(135deg, 
          rgba(15, 23, 42, 0.85) 0%,
          rgba(30, 41, 59, 0.75) 50%,
          rgba(51, 65, 85, 0.85) 100%
        )`
      : `linear-gradient(135deg, 
          rgba(255, 255, 255, 0.9) 0%,
          rgba(248, 250, 252, 0.85) 50%,
          rgba(241, 245, 249, 0.9) 100%
        )`,
    backdropFilter: 'blur(12px) saturate(1.8)',
    WebkitBackdropFilter: 'blur(12px) saturate(1.8)',
    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'}`,
    boxShadow: isDark
      ? `0 8px 32px rgba(0, 0, 0, 0.3), 
         0 0 0 1px rgba(255, 255, 255, 0.05),
         inset 0 1px 0 rgba(255, 255, 255, 0.1)`
      : `0 8px 32px rgba(0, 0, 0, 0.1), 
         0 0 0 1px rgba(255, 255, 255, 0.2),
         inset 0 1px 0 rgba(255, 255, 255, 0.4)`
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
            "absolute z-30 left-4 right-4 top-4",
            isMobile ? "top-2 left-2 right-2" : "top-4 left-4 right-4",
            className
          )}
        >
          <div className="rounded-2xl overflow-hidden relative" style={glassStyles}>
            {/* Background Pattern */}
            <BackgroundPattern isDark={isDark} />

            <div className={cn("relative p-4", isMobile ? "p-3" : "p-4")}>
              <div className="flex items-center justify-between">
                {/* Left Side - Fact Check Info */}
                <FactCheckBadge 
                  //@ts-expect-error Ignore
                  factCheckInfo={factCheckInfo} video={video}
                  isMobile={isMobile}
                  colors={colors}
                  isDark={isDark}
                />
              </div>

              {/* Progress bar for fact-check confidence */}
              {/* {factCheckInfo && (
                <ConfidenceProgressBar 
                  factCheckInfo={factCheckInfo}
                  colors={colors}
                  isDark={isDark}
                />
              )} */}
            </div>
            <ShimmerEffect />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});