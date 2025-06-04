'use client';

import { motion } from 'framer-motion';
import { VideoMetadata } from '@/app/types/video';
import { getEvaluationColor } from '@/app/helpers/factCheck';
import { formatViewCount, formatTimeAgo } from '@/app/utils/format';
import { Badge } from '@/app/components/ui/badge';
import { Eye, Calendar, ThumbsUp, TrendingUp, Shield, Clock } from 'lucide-react';
import VideoTruthBar from '@/app/sections/feed/VideoTruthBar';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';

interface CompactVideoContentProps {
  video: VideoMetadata;
  isHovered: boolean;
}

const contentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

export function CompactVideoContent({ video, isHovered }: CompactVideoContentProps) {
  const { colors, mounted, isDark } = useLayoutTheme();
  
  // Theme-aware evaluation colors
  const getThemeEvaluationColors = (evaluation: string) => {
    const baseColors = {
      'Fact': isDark ? '#22c55e' : '#16a34a',
      'Mislead': isDark ? '#f59e0b' : '#d97706',
      'Lie': isDark ? '#ef4444' : '#dc2626',
      'Unknown': isDark ? '#9ca3af' : '#6b7280'
    };
    
    return baseColors[evaluation as keyof typeof baseColors] || baseColors.Unknown;
  };

  if (!mounted) {
    return null;
  }

  const evaluationColor = getThemeEvaluationColors(video.factCheck.evaluation || 'Unknown');
  
  return (
    <motion.div 
      className="flex-1 min-w-0 space-y-3"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Title */}
      <motion.div variants={itemVariants}>
        <h4 
          className="font-semibold text-sm line-clamp-2 leading-tight transition-colors duration-200"
          style={{
            color: isHovered ? colors.foreground : colors.mutedForeground
          }}
        >
          {video.title}
        </h4>
      </motion.div>
      
      {/* Channel with Verification */}
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-2"
      >
        <p 
          className="text-xs font-medium transition-colors duration-200"
          style={{
            color: isHovered ? colors.foreground : colors.mutedForeground
          }}
        >
          {video.channelName}
        </p>
        <div 
          className="w-1 h-1 rounded-full"
          style={{ backgroundColor: colors.border }}
        />
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3" style={{ color: colors.primary }} />
          <span 
            className="text-xs font-medium"
            style={{ color: colors.primary }}
          >
            Verified
          </span>
        </div>
      </motion.div>
      
      {/* Enhanced Stats Row */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-3 gap-2 text-xs"
      >
        <motion.div 
          className="flex items-center gap-1.5 transition-colors cursor-pointer"
          style={{ color: colors.mutedForeground }}
          whileHover={{ 
            color: colors.primary,
            scale: 1.02 
          }}
          transition={{ duration: 0.2 }}
        >
          <Eye className="w-3 h-3" />
          <span className="font-medium">{formatViewCount(video.views)}</span>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-1.5 transition-colors cursor-pointer"
          style={{ color: colors.mutedForeground }}
          whileHover={{ 
            color: colors.accent,
            scale: 1.02 
          }}
          transition={{ duration: 0.2 }}
        >
          <ThumbsUp className="w-3 h-3" />
          <span className="font-medium">{formatViewCount(video.likes)}</span>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-1.5 transition-colors cursor-pointer"
          style={{ color: colors.mutedForeground }}
          whileHover={{ 
            color: colors.secondary,
            scale: 1.02 
          }}
          transition={{ duration: 0.2 }}
        >
          <Clock className="w-3 h-3" />
          <span className="font-medium">{formatTimeAgo(video.uploadDate)}</span>
        </motion.div>
      </motion.div>
      
      {/* Enhanced Truth Bar */}
      <motion.div
        variants={itemVariants}
        className="relative"
      >
        <VideoTruthBar 
          factCheck={video.factCheck}
          showLabel={false}
          compact={true}
        />
        
        {/* Truth Bar Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-full blur-sm pointer-events-none"
          style={{ 
            backgroundColor: `${evaluationColor}20`,
            opacity: isHovered ? 0.6 : 0
          }}
          animate={{ opacity: isHovered ? 0.6 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
      
      {/* Bottom Row with Enhanced Styling */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className="text-xs px-2.5 py-1 transition-colors duration-200 hover:scale-105"
            style={{
              backgroundColor: `${colors.muted}80`,
              borderColor: colors.border,
              color: colors.foreground
            }}
          >
            {video.category}
          </Badge>
          
          {/* Trending Indicator */}
          {video.views > 100000 && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="flex items-center gap-1 text-xs"
              style={{ color: colors.accent }}
            >
              <TrendingUp className="w-3 h-3" />
              <span className="font-medium">Trending</span>
            </motion.div>
          )}
        </div>

        {/* Fact check indicator */}
        <motion.div
          className="w-3 h-3 rounded-full border-2"
          style={{
            backgroundColor: evaluationColor,
            borderColor: colors.background
          }}
          whileHover={{ scale: 1.2 }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </motion.div>
  );
}