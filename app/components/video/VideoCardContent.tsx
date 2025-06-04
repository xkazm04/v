'use client';

import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';
import { Video } from '@/app/types/video_api';

interface VideoCardContentProps {
  video: Video;
  layout: 'grid' | 'list';
  className?: string;
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

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

export const VideoCardContent = memo(function VideoCardContent({
  video,
  layout,
  className
}: VideoCardContentProps) {
  const { colors, mounted } = useLayoutTheme();
  const [isHovered, setIsHovered] = useState(false);
  const isGrid = layout === 'grid';

  if (!mounted) {
    return null;
  }
  
  return (
    <motion.div
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      className={cn(className, isGrid ? 'p-5 pt-0' : '')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/watch?v=${video.id}`} className="block group">
        {/* Title */}
        <motion.h3 
          variants={itemVariants}
          className={cn(
            "font-bold leading-tight mb-3 py-2 line-clamp-2 transition-all duration-200",
            isGrid ? 'text-sm' : 'text-lg'
          )}
          style={{
            color: isHovered ? colors.primary : colors.foreground
          }}
          whileHover={{ letterSpacing: '0.01em' }}
          transition={{ duration: 0.2 }}
        >
          {video.title}
        </motion.h3>
        
        {/* Channel Name */}
        <motion.p 
          variants={itemVariants}
          className={cn(
            "font-medium mb-3 transition-colors duration-200",
            isGrid ? 'text-sm' : 'text-base'
          )}
          style={{
            color: isHovered ? colors.foreground : colors.mutedForeground
          }}
        >
          {video.source}
        </motion.p>
      

        {/* Enhanced metadata for grid layout */}
        {layout === 'grid' && (
          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-2 text-xs"
            style={{ color: colors.mutedForeground }}
          >
            {/* <span>{video.views.toLocaleString()} views</span> */}
            <div 
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: colors.border }}
            />
            <span>{new Date(video.created_at).toLocaleDateString()}</span>
          </motion.div>
        )}
      </Link>
    </motion.div>
  );
});