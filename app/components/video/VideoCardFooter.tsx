'use client';

import { VideoMetadata } from '@/app/types/video';
import { memo } from 'react';
import { motion } from 'framer-motion';

interface VideoCardFooterProps {
  video: VideoMetadata;
  layout: 'grid' | 'list';
}

const footerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      delay: 0.3,
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

export const VideoCardFooter = memo(function VideoCardFooter({
  video,
  layout
}: VideoCardFooterProps) {
  const isGrid = layout === 'grid';
  
  return (
    <motion.div
      variants={footerVariants}
      initial="hidden"
      animate="visible"
      className={`
        flex items-center justify-between
        border-t border-slate-200/60 dark:border-slate-700/60
        ${isGrid ? 'px-5 py-4' : 'px-5 py-3 mt-auto'}
      `}
    >
      {/* Category Badge */}
      <motion.span
        whileHover={{ scale: 1.05 }}
        className="
          inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold
          bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950
          text-blue-700 dark:text-blue-300
          border border-blue-200/60 dark:border-blue-800/60
          shadow-sm hover:shadow-md transition-shadow duration-200
        "
      >
        {video.category}
      </motion.span>
      
      {/* Confidence Score */}
      <div className="flex items-center gap-2 text-xs">
        <div className="
          flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
          bg-slate-100 dark:bg-slate-800
          border border-slate-200/60 dark:border-slate-700/60
        ">
          <div className={`
            w-2 h-2 rounded-full
            ${video.factCheck.confidence >= 80 
              ? 'bg-green-500' 
              : video.factCheck.confidence >= 60 
                ? 'bg-yellow-500' 
                : 'bg-red-500'
            }
          `} />
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {video.factCheck.confidence}%
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            confidence
          </span>
        </div>
      </div>
    </motion.div>
  );
});