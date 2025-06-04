'use client';

import { VideoMetadata } from '@/app/types/video';
import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { formatDuration } from '@/app/utils/format';
import VideoFactOverlay from '@/app/sections/feed/VideoFactOverlay';
import { VideoThumbnailPlaceholder } from './VideoThumbnailPlaceholder';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';
import { badgeVariants, playButtonVariants, shimmerVariants } from '../animations/variants/cardVariants';

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
  const { colors, mounted } = useLayoutTheme();
  
  // Check if this is a placeholder URL
  const isPlaceholder = video.thumbnailUrl.includes('/api/placeholder/');

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
        {/* Use placeholder component if no real thumbnail */}
        {isPlaceholder ? (
          <VideoThumbnailPlaceholder 
            title={video.title}
            source={video.category}
            className="w-full h-full"
          />
        ) : (
          <>
            {/* Real Image */}
            {!imageState.error && (
              <Image
                src={video.thumbnailUrl}
                alt={video.title}
                fill
                className={cn(
                  "object-cover transition-all duration-500 ease-out",
                  imageState.loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105',
                  "group-hover:scale-110"
                )}
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
              <div 
                className="absolute inset-0 overflow-hidden"
                style={{ backgroundColor: colors.muted }}
              >
                <motion.div
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${colors.background}40, transparent)`
                  }}
                />
              </div>
            )}

            {/* Error State - fallback to placeholder */}
            {imageState.error && (
              <VideoThumbnailPlaceholder 
                title={video.title}
                source={video.category}
                className="w-full h-full"
              />
            )}
          </>
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
          className="absolute bottom-3 rounded-xl right-3 z-10 px-2.5 py-1.5 text-xs font-semibold border shadow-lg backdrop-blur-sm"
          style={{
            backgroundColor: `${colors.background}e6`, // 90% opacity
            color: colors.foreground,
            borderColor: colors.border
          }}
        >
          {formatDuration(video.duration)}
        </motion.div>

        {/* Play Button Overlay - only show if not using placeholder */}
        {!isPlaceholder && (
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
        )}

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