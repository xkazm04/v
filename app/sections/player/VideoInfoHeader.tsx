'use client';

import { motion } from 'framer-motion';
import { VideoWithTimestamps } from '@/app/types/video_api'; 
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { User, Globe } from 'lucide-react';

interface VideoInfoHeaderProps {
  video: VideoWithTimestamps; 
  className?: string;
}

export function VideoInfoHeader({ video, className }: VideoInfoHeaderProps) {
  const { colors, isDark } = useLayoutTheme();

  const headerColors = {
    background: isDark
      ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)'
      : 'linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 249, 0.95) 100%)',
    border: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.3)',
    title: colors.foreground,
    subtitle: isDark ? 'rgba(148, 163, 184, 0.9)' : 'rgba(100, 116, 139, 0.9)',
    accent: colors.primary,
    iconBackground: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.5)'
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`backdrop-blur-sm border-b ${className}`}
      style={{
        background: headerColors.background,
        borderColor: headerColors.border
      }}
    >
      <div className="p-6">
        <motion.h1 
          className="text-xl lg:text-2xl font-bold mb-3 leading-tight"
          style={{ color: headerColors.title }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {video.video.title || 'Untitled Video'}
        </motion.h1>

        <div className="flex flex-row w-full justify-between gap-10">
          {/* Speaker  */}
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div 
              className="p-1.5 rounded-md"
              style={{ backgroundColor: headerColors.iconBackground }}
            >
              <User className="w-3 h-3" style={{ color: headerColors.accent }} />
            </div>
            <div>
              <div className="text-xs opacity-70" style={{ color: headerColors.subtitle }}>
                Speaker
              </div>
              <div className="text-sm font-medium" style={{ color: headerColors.title }}>
                {video.video.speaker_name || 'Unknown Speaker'}
              </div>
            </div>
          </motion.div>
          {/* Language  */}
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div 
              className="p-1.5 rounded-md"
              style={{ backgroundColor: headerColors.iconBackground }}
            >
              <Globe className="w-3 h-3" style={{ color: headerColors.accent }} />
            </div>
            <div>
              <div className="text-xs opacity-70" style={{ color: headerColors.subtitle }}>
                Language
              </div>
              <div className="text-sm font-medium capitalize" style={{ color: headerColors.title }}>
                {video.video.language_code || 'Unknown'}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}