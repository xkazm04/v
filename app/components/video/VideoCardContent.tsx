'use client';

import { VideoMetadata } from '@/app/types/video';
import { memo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
interface VideoCardContentProps {
  video: VideoMetadata;
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
      ease: 'easeOut'
    }
  }
};

export const VideoCardContent = memo(function VideoCardContent({
  video,
  layout,
  className
}: VideoCardContentProps) {
  const isGrid = layout === 'grid';
  
  return (
    <motion.div
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      className={`${className} ${isGrid ? 'p-5 pt-0' : ''}`}
    >
      <Link href={`/watch?v=${video.id}`} className="block">
        {/* Title */}
        <h3 className={`
          font-bold text-slate-900 dark:text-slate-100 leading-tight mb-3
          line-clamp-2 transition-colors duration-200
          group-hover:text-blue-600 dark:group-hover:text-blue-400
          ${isGrid ? 'text-sm' : 'text-lg'}
        `}>
          {video.title}
        </h3>
        
        {/* Channel Name */}
        <p className={`
          font-medium text-slate-600 dark:text-slate-400 mb-3
          transition-colors duration-200
          group-hover:text-slate-800 dark:group-hover:text-slate-200
          ${isGrid ? 'text-sm' : 'text-base'}
        `}>
          {video.channelName}
        </p>
      
        {/* Description for List Layout */}
        {layout === 'list' && (
          <p className="
            text-sm text-slate-600 dark:text-slate-400 leading-relaxed
            line-clamp-3 mb-4
          ">
            {video.description}
          </p>
        )}
      </Link>
    </motion.div>
  );
});