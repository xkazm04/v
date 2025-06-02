'use client';

import { VideoMetadata } from '@/app/types/video';
import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { formatDuration } from '@/app/utils/format';
import { getEvaluationIcon, getEvaluationColor } from '@/app/helpers/factCheck';
import VideoFactOverlay from '@/app/sections/feed/VideoFactOverlay';

interface VideoCardThumbnailProps {
  video: VideoMetadata;
  layout: 'grid' | 'list';
  priority: boolean;
  imageState: { loaded: boolean; error: boolean };
  onImageLoad: () => void;
  onImageError: () => void;
  showOverlay: boolean;
  className?: string;
}

const shimmerVariants = {
  initial: { x: '-100%' },
  animate: { 
    x: '100%',
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatDelay: 1
    }
  }
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      delay: 0.2,
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

export const VideoCardThumbnail = memo(function VideoCardThumbnail({
  video,
  layout,
  priority,
  imageState,
  onImageLoad,
  onImageError,
  showOverlay,
  className
}: VideoCardThumbnailProps) {
  return (
    <Link 
      href={`/watch?v=${video.id}`}
      className={`relative block overflow-hidden rounded-xl ${className}`}
    >
      <div className="relative w-full h-full bg-slate-100 dark:bg-slate-800">
        {/* Image */}
        {!imageState.error && (
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className={`
              object-cover transition-all duration-500 ease-out
              ${imageState.loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
              group-hover:scale-110
            `}
            sizes={
              layout === 'grid' 
                ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                : "320px"
            }
            priority={priority}
            onLoad={onImageLoad}
            onError={onImageError}
          />
        )}
        
        {/* Loading Shimmer */}
        {!imageState.loaded && !imageState.error && (
          <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <motion.div
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              className="
                absolute inset-0 bg-gradient-to-r 
                from-transparent via-white/20 to-transparent
                dark:via-white/10
              "
            />
          </div>
        )}

        {/* Error State */}
        {imageState.error && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
            <div className="text-center text-slate-400 dark:text-slate-500">
              <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Image unavailable</span>
            </div>
          </div>
        )}

        {/* Fact Check Overlay */}
        <AnimatePresence>
          {showOverlay && (
            <VideoFactOverlay 
              factCheck={video.factCheck}
              overlayType="full"
            />
          )}
        </AnimatePresence>

        {/* Duration Badge */}
        <motion.div 
          variants={badgeVariants}
          initial="hidden"
          animate="visible"
          className="
            absolute bottom-3 right-3 z-10
            px-2.5 py-1.5 rounded-lg text-xs font-semibold
            bg-black/80 text-white backdrop-blur-sm
            border border-white/10 shadow-lg
          "
        >
          {formatDuration(video.duration)}
        </motion.div>
        
        {/* Fact Check Badge */}
        <motion.div 
          variants={badgeVariants}
          initial="hidden"
          animate="visible"
          className="
            absolute top-3 left-3 z-10
            flex items-center gap-2 px-2.5 py-1.5 rounded-lg
            bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm
            border border-slate-200/50 dark:border-slate-700/50
            shadow-lg text-xs font-semibold
          "
        >
          {getEvaluationIcon(video.factCheck.evaluation || 'Unknown', 'sm')}
          <span className={getEvaluationColor(video.factCheck.evaluation || 'Unknown')}>
            {video.factCheck.evaluation || 'Unknown'}
          </span>
        </motion.div>

        {/* Play Button Overlay */}
        <div className="
          absolute inset-0 flex items-center justify-center
          opacity-0 group-hover:opacity-100 transition-opacity duration-300
          bg-black/20 backdrop-blur-[1px]
        ">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="
              w-16 h-16 rounded-full bg-white/90 dark:bg-slate-900/90
              flex items-center justify-center shadow-2xl
              border border-white/20 backdrop-blur-sm
            "
          >
            <svg className="w-6 h-6 ml-1 text-slate-700 dark:text-slate-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </motion.div>
        </div>

        {/* Gradient Overlay for Better Text Readability */}
        <div className="
          absolute inset-0 bg-gradient-to-t 
          from-black/20 via-transparent to-transparent
          pointer-events-none
        " />
      </div>
    </Link>
  );
});