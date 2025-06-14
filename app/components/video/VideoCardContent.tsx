'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';
import { Video } from '@/app/types/video_api';
import { User } from 'lucide-react';
import VideoCardContentMetadata from './VideoCardContentMetadata';
import { itemVariants } from '@/app/helpers/animation';
import VideoCardContentClickable from './VideoCardContentClickable';

interface VideoCardContentProps {
  video: Video;
  layout: 'grid' | 'list';
  className?: string;
  isCardHovered?: boolean;
}

const contentVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1,
      duration: 0.4,
      ease: 'easeOut',
      staggerChildren: 0.05
    }
  }
};

export const VideoCardContent = memo(function VideoCardContent({
  video,
  layout,
  className,
  isCardHovered = false
}: VideoCardContentProps) {
  const { colors } = useLayoutTheme();
  const isGrid = layout === 'grid';

  return (
    <motion.div
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      className={cn(className, isGrid ? 'p-4 pt-3' : 'p-4')}
    >
      {/* Title - Non-clickable but important */}
      <motion.h3
        variants={itemVariants}
        className={cn(
          "font-bold leading-tight mb-3 line-clamp-2 transition-all duration-200",
          isGrid ? 'text-sm' : 'text-lg'
        )}
        style={{ color: colors.foreground }}
      >
        {video.title || 'Untitled Video'}
      </motion.h3>

      {/* Interactive Elements Row */}
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-2 mb-3 flex-wrap"
      >
        <VideoCardContentClickable
          video={video}
        />
        {/* Speaker */}
        {video.speaker_name && (
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-1"
          >
            <div
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: colors.border }}
            />
            <User className="w-3 h-3" style={{ color: colors.mutedForeground }} />
            <span
              className={cn(
                "transition-colors duration-200 truncate max-w-24",
                isGrid ? 'text-xs' : 'text-sm'
              )}
              style={{ color: colors.mutedForeground }}
            >
              {video.speaker_name}
            </span>
          </motion.div>
        )}
      </motion.div>


      {/* Metadata Row */}
      <VideoCardContentMetadata video={video} />
    </motion.div>
  );
});