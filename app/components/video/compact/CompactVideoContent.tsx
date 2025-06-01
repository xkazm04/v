'use client';

import { motion } from 'framer-motion';
import { VideoMetadata } from '@/app/types/video';
import { getEvaluationColor } from '@/app/helpers/factCheck';
import { formatViewCount, formatTimeAgo } from '@/app/utils/format';
import { Badge } from '@/app/components/ui/badge';
import { Eye, Calendar, ThumbsUp, TrendingUp, Shield, Clock } from 'lucide-react';
import VideoTruthBar from '@/app/sections/feed/VideoTruthBar';

interface CompactVideoContentProps {
  video: VideoMetadata;
  isHovered: boolean;
}

export function CompactVideoContent({ video, isHovered }: CompactVideoContentProps) {
  const evaluationColor = getEvaluationColor(video.factCheck.evaluation);
  
  return (
    <div className="flex-1 min-w-0 space-y-3">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h4 className="font-semibold text-sm line-clamp-2 leading-tight text-slate-200 group-hover:text-white transition-colors duration-200">
          {video.title}
        </h4>
      </motion.div>
      
      {/* Channel with Verification */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
        className="flex items-center gap-2"
      >
        <p className="text-xs text-slate-400 font-medium group-hover:text-slate-300 transition-colors">
          {video.channelName}
        </p>
        <div className="w-1 h-1 bg-slate-600 rounded-full" />
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3 text-emerald-400" />
          <span className="text-xs text-emerald-400 font-medium">Verified</span>
        </div>
      </motion.div>
      
      {/* Enhanced Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-2 text-xs"
      >
        <div className="flex items-center gap-1.5 text-slate-400 hover:text-blue-400 transition-colors">
          <Eye className="w-3 h-3" />
          <span className="font-medium">{formatViewCount(video.views)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition-colors">
          <ThumbsUp className="w-3 h-3" />
          <span className="font-medium">{formatViewCount(video.likes)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 hover:text-orange-400 transition-colors">
          <Clock className="w-3 h-3" />
          <span className="font-medium">{formatTimeAgo(video.uploadDate)}</span>
        </div>
      </motion.div>
      
      {/* Enhanced Truth Bar */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="relative"
      >
        <VideoTruthBar 
          factCheck={video.factCheck}
          showLabel={false}
          compact={true}
        />
        
        {/* Truth Bar Glow Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.6 : 0 }}
          className={`absolute inset-0 rounded-full blur-sm ${evaluationColor.replace('text-', 'bg-')}/20`}
        />
      </motion.div>
      
      {/* Bottom Row with Enhanced Styling */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className="text-xs px-2.5 py-1 bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50 transition-colors"
          >
            {video.category}
          </Badge>
          
          {/* Trending Indicator */}
          {video.views > 100000 && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="flex items-center gap-1 text-xs text-orange-400"
            >
              <TrendingUp className="w-3 h-3" />
              <span className="font-medium">Trending</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}