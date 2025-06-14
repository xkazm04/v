'use client';

import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';
import { playButtonVariants } from '../animations/variants/cardVariants';
import { Video, getVideoThumbnailUrl, formatVideoDuration } from '@/app/types/video_api';
import { Play } from 'lucide-react';

interface VideoCardThumbnailProps {
  video: Video;
  className?: string;
  priority?: boolean;
}


export const VideoCardThumbnail = memo(function VideoCardThumbnail({
  video,
  className,
  priority = false
}: VideoCardThumbnailProps) {
  const { colors, isDark } = useLayoutTheme();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const thumbnailUrl = getVideoThumbnailUrl(video);
  const duration = formatVideoDuration(video.duration_seconds);

  return (
    <Link 
      href={`/watch?v=${video.id}`}
      className={cn("relative block overflow-hidden rounded-t-xl group", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => e.stopPropagation()} // Prevent parent card click
    >
      <motion.div 
        className="relative w-full h-full transition-all duration-300"
        style={{ backgroundColor: colors.muted }}
      >
        {/* Video Thumbnail with optimized loading */}
        <div className="relative w-full h-full">
          {!imageError ? (
            <Image
              src={thumbnailUrl}
              alt={video.title || `Video from ${video.source}`}
              fill
              className={cn(
                "object-cover transition-all duration-500",
                imageLoaded ? "opacity-85 blur-0" : "opacity-0 blur-sm"
              )}
              onLoadingComplete={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={priority}
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center opacity-60"
              style={{ backgroundColor: colors.muted }}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-slate-300 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                  <Play className="w-8 h-8 text-slate-500" />
                </div>
                <p className="text-xs text-slate-500">Video</p>
              </div>
            </div>
          )}

          {/* Enhanced overlay for better content visibility */}
          <div 
            className="absolute inset-0"
            style={{
              background: isDark 
                ? 'linear-gradient(45deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)'
                : 'linear-gradient(45deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.2) 100%)'
            }}
          />

          {/* Loading shimmer */}
          {!imageLoaded && !imageError && (
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          )}
        </div>
        <div 
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `linear-gradient(to top, ${colors.background}40 0%, transparent 30%, transparent 70%, ${colors.background}20 100%)`
          }}
        />
      </motion.div>
    </Link>
  );
});