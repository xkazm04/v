'use client';

import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';
import { playButtonVariants } from '../animations/variants/cardVariants';
import { Video, getVideoThumbnailUrl, formatVideoDuration } from '@/app/types/video_api';
interface VideoCardThumbnailProps {
  video: Video;
  className?: string;
}

export const VideoCardThumbnail = memo(function VideoCardThumbnail({
  video,
  className
}: VideoCardThumbnailProps) {
  const { colors, mounted, isDark } = useLayoutTheme();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const thumbnailUrl = getVideoThumbnailUrl(video);
  const duration = formatVideoDuration(video.duration_seconds);

  return (
    <Link 
      href={`/watch?v=${video.id}`}
      className={cn("relative block overflow-hidden rounded-xl group", className)}
    >
      <div 
        className="relative w-full h-full transition-all duration-300"
        style={{ backgroundColor: colors.muted }}
      >
        {/* Video Thumbnail with increased transparency */}
        <div className="relative w-full h-full">
          {!imageError ? (
            <Image
              src={thumbnailUrl}
              alt={video.title || `Video from ${video.source}`}
              fill
              className={cn(
                "object-cover transition-all duration-300 group-hover:scale-105",
                imageLoaded ? "opacity-55" : "opacity-0" 
              )}
              onLoadingComplete={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center opacity-60"
              style={{ backgroundColor: colors.muted }}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-slate-300 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                </div>
                <p className="text-xs text-slate-500">Video</p>
              </div>
            </div>
          )}

          {/* Semi-transparent overlay to enhance StampText visibility */}
          <div 
            className="absolute inset-0"
            style={{
              background: isDark 
                ? 'linear-gradient(45deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.2) 100%)'
                : 'linear-gradient(45deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.3) 100%)'
            }}
          />

          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse" />
          )}
        </div>

        {/* Duration Badge */}
        {video.duration_seconds && (
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-white text-xs rounded backdrop-blur-sm z-30">
            {duration}
          </div>
        )}

        {/* Source Badge */}
        <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-blue-500/90 text-white text-xs rounded backdrop-blur-sm z-30">
          {video.source?.toUpperCase() || 'VIDEO'}
        </div>

        {/* Play Button Overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-25"
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
              backgroundColor: `${colors.background}f0`, 
              borderColor: `${colors.border}80`,
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
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `linear-gradient(to top, ${colors.background}30 0%, transparent 40%, transparent 60%, ${colors.background}15 100%)`
          }}
        />

        {/* Enhanced hover effects */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 z-15"
          style={{
            background: `linear-gradient(45deg, ${colors.primary}15, ${colors.accent}10)`
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </Link>
  );
});