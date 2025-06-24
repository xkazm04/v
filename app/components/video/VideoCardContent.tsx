'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';
import { Video } from '@/app/types/video_api';
import VideoCardContentMetadata from './VideoCardContentMetadata';
import { itemVariants } from '@/app/helpers/animation';
import { contentVariants } from '../animations/variants/placeholderVariants';
import TopicBadge from '../shared/TopicBadge';

interface VideoCardContentProps {
  video: Video;
  layout: 'grid' | 'list';
  className?: string;
  isCardHovered?: boolean;
}

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
      className={cn(className, isGrid ? 'p-4 pt-3 relative' : 'p-4 relative')}
    >
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

        <TopicBadge 
          data={video} 
        />
      
      <VideoCardContentMetadata video={video} />
      

    </motion.div>
  );
});