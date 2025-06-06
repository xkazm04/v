'use client';

import { motion } from 'framer-motion';
import { Star, TrendingUp } from 'lucide-react';
import { VideoMetadata } from '@/app/types/video';
import { cn } from '@/app/lib/utils';
import { contentVariants, badgeVariants } from '../../animations/variants/playerVariants';

interface VideoStatsBadgesProps {
  video: VideoMetadata;
  isMobile: boolean;
  colors: any;
  isDark: boolean;
}

export function VideoStatsBadges({ 
  video, 
  isMobile, 
  colors, 
  isDark 
}: VideoStatsBadgesProps) {
  return (
    <motion.div 
      variants={contentVariants}
      className="flex items-center space-x-2 flex-shrink-0"
    >
      {/* High-quality indicator */}
      {video.likes && video.likes > 1000 && (
        <motion.div
          variants={badgeVariants}
          whileHover="hover"
          className="flex items-center space-x-1 px-2 py-1 rounded-full backdrop-blur-sm"
          style={{
            background: isDark 
              ? 'rgba(34, 197, 94, 0.2)' 
              : 'rgba(34, 197, 94, 0.1)',
            border: `1px solid ${isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)'}`
          }}
        >
          <Star 
            className={cn(
              isMobile ? "h-3 w-3" : "h-4 w-4"
            )}
            style={{ color: isDark ? '#4ade80' : '#16a34a' }}
          />
          {!isMobile && (
            <span 
              className="text-xs font-medium"
              style={{ color: isDark ? '#4ade80' : '#16a34a' }}
            >
              Popular
            </span>
          )}
        </motion.div>
      )}

      {/* Trending indicator */}
      {video.views && video.views > 10000 && (
        <motion.div
          variants={badgeVariants}
          whileHover="hover"
          className="flex items-center space-x-1 px-2 py-1 rounded-full backdrop-blur-sm"
          style={{
            background: isDark 
              ? 'rgba(59, 130, 246, 0.2)' 
              : 'rgba(59, 130, 246, 0.1)',
            border: `1px solid ${isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`
          }}
        >
          <TrendingUp 
            className={cn(
              isMobile ? "h-3 w-3" : "h-4 w-4"
            )}
            style={{ color: colors.primary }}
          />
          {!isMobile && (
            <span 
              className="text-xs font-medium"
              style={{ color: colors.primary }}
            >
              Trending
            </span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}