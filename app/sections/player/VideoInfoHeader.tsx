'use client';

import { motion } from 'framer-motion';
import { VideoDetail } from '@/app/types/video_api';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { Clock, User, Globe, BarChart3 } from 'lucide-react';

interface VideoInfoHeaderProps {
  video: VideoDetail;
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

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return isDark ? '#10b981' : '#059669'; // Green
    if (rate >= 50) return isDark ? '#f59e0b' : '#d97706'; // Orange
    return isDark ? '#ef4444' : '#dc2626'; // Red
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
        {/* Main Title */}
        <motion.h1 
          className="text-xl lg:text-2xl font-bold mb-3 leading-tight"
          style={{ color: headerColors.title }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {video.title}
        </motion.h1>

        {/* Metadata Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Speaker */}
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
                {video.speaker}
              </div>
            </div>
          </motion.div>

          {/* Duration */}
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div 
              className="p-1.5 rounded-md"
              style={{ backgroundColor: headerColors.iconBackground }}
            >
              <Clock className="w-3 h-3" style={{ color: headerColors.accent }} />
            </div>
            <div>
              <div className="text-xs opacity-70" style={{ color: headerColors.subtitle }}>
                Duration
              </div>
              <div className="text-sm font-medium" style={{ color: headerColors.title }}>
                {formatDuration(video.duration)}
              </div>
            </div>
          </motion.div>

          {/* Language */}
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
                {video.language}
              </div>
            </div>
          </motion.div>

          {/* Fact-check Progress */}
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div 
              className="p-1.5 rounded-md"
              style={{ backgroundColor: headerColors.iconBackground }}
            >
              <BarChart3 className="w-3 h-3" style={{ color: headerColors.accent }} />
            </div>
            <div>
              <div className="text-xs opacity-70" style={{ color: headerColors.subtitle }}>
                Fact-checked
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium" style={{ color: headerColors.title }}>
                  {video.researchedStatements}/{video.totalStatements}
                </div>
                <div 
                  className="text-xs font-bold px-1.5 py-0.5 rounded"
                  style={{ 
                    color: getCompletionColor(video.completionRate),
                    backgroundColor: `${getCompletionColor(video.completionRate)}20`
                  }}
                >
                  {video.completionRate.toFixed(0)}%
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <motion.div 
          className="mt-4"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="flex items-center justify-between text-xs mb-1" style={{ color: headerColors.subtitle }}>
            <span>Research Progress</span>
            <span>{video.completionRate.toFixed(1)}% Complete</span>
          </div>
          <div 
            className="h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: headerColors.iconBackground }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ 
                backgroundColor: getCompletionColor(video.completionRate),
                width: `${video.completionRate}%`
              }}
              initial={{ width: 0 }}
              animate={{ width: `${video.completionRate}%` }}
              transition={{ delay: 1, duration: 0.8 }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}