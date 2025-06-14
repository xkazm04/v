'use client';

import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';
import { Video } from '@/app/types/video_api';
import { Clock, User, CheckCircle } from 'lucide-react';

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
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <motion.div
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      className={cn(className, isGrid ? 'p-4 pt-3' : 'p-4')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/watch?v=${video.id}`} className="block group">
        {/* Title */}
        <motion.h3 
          className={cn(
            "font-bold leading-tight mb-2 line-clamp-2 transition-all",
            isGrid ? 'text-sm' : 'text-lg'
          )}
          style={{
            color: isHovered ? colors.primary : colors.foreground
          }}
        >
          {video.title || 'Untitled Video'}
        </motion.h3>
        
        {/* Source and Speaker */}
        <motion.div 
          variants={itemVariants}
          className="flex items-center gap-2 mb-2"
        >
          <span
            className={cn(
              "font-medium transition-colors duration-200",
              isGrid ? 'text-xs' : 'text-sm'
            )}
            style={{
              color: isHovered ? colors.foreground : colors.mutedForeground
            }}
          >
            {video.source}
          </span>
          
          {video.speaker_name && (
            <>
              <div 
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: colors.border }}
              />
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" style={{ color: colors.mutedForeground }} />
                <span
                  className={cn(
                    "transition-colors duration-200 truncate",
                    isGrid ? 'text-xs' : 'text-sm'
                  )}
                  style={{ color: colors.mutedForeground }}
                >
                  {video.speaker_name}
                </span>
              </div>
            </>
          )}
        </motion.div>

        {/* Metadata Row */}
        <motion.div 
          variants={itemVariants}
          className="flex items-center justify-between gap-2"
        >
          {/* Date */}
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" style={{ color: colors.mutedForeground }} />
            <span
              className={cn(
                "transition-colors duration-200",
                isGrid ? 'text-xs' : 'text-sm'
              )}
              style={{ color: colors.mutedForeground }}
            >
              {formatDate(video.created_at)}
            </span>
          </div>

          {/* Research Status */}
          {video.researched && (
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              {!isGrid && (
                <span className="text-xs text-green-600 dark:text-green-400">
                  Fact-checked
                </span>
              )}
            </div>
          )}
        </motion.div>

        {/* Verdict Preview (for researched videos) */}
        {video.verdict && (
          <motion.div
            variants={itemVariants}
            className="mt-2 p-2 rounded-md"
            style={{ backgroundColor: `${colors.muted}50` }}
          >
            <p
              className="text-xs line-clamp-2"
              style={{ color: colors.mutedForeground }}
            >
             Verdict: {video.verdict}
            </p>
          </motion.div>
        )}
      </Link>
    </motion.div>
  );
});