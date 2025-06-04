'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';
import { playButtonVariants,  } from '../animations/variants/cardVariants';
import { Video } from '@/app/types/video_api';

interface VideoCardThumbnailProps {
  video: Video
  showOverlay: boolean;
  className?: string;
}

export const VideoCardThumbnail = memo(function VideoCardThumbnail({
  video,
  showOverlay,
  className
}: VideoCardThumbnailProps) {
  const { colors, mounted } = useLayoutTheme();
  
  if (!mounted) {
    return null;
  }

  return (
    <Link 
      href={`/watch?v=${video.id}`}
      className={cn("relative block overflow-hidden rounded-xl group", className)}
    >
      <div 
        className="relative w-full h-full transition-all duration-300"
        style={{ backgroundColor: colors.muted }}
      >

          <motion.div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ backgroundColor: `${colors.background}20` }}
            initial="hidden"
            whileHover="visible"
          >
            <motion.div
              variants={playButtonVariants}
              whileHover="hover"
              whileTap="tap"
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl border backdrop-blur-sm"
              style={{
                backgroundColor: `${colors.background}f0`, // 94% opacity
                borderColor: `${colors.border}80`, // 50% opacity
                color: colors.foreground
              }}
            >
              <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </motion.div>
          </motion.div>

        {/* Gradient Overlay for Better Text Readability */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to top, ${colors.background}20 0%, transparent 40%, transparent 60%, ${colors.background}10 100%)`
          }}
        />

        {/* Enhanced hover effects */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
          style={{
            background: `linear-gradient(45deg, ${colors.primary}15, ${colors.accent}10)`
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </Link>
  );
});