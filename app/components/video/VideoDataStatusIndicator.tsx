'use client';

import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import { VideoDataManagerResult, getDataSourceStatus, getVideoCountText } from '@/app/utils/videoDataManager';

interface VideoDataStatusIndicatorProps {
  result: VideoDataManagerResult;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showVideoCount?: boolean;
  className?: string;
}

export function VideoDataStatusIndicator({
  result,
  position = 'top-left',
  showVideoCount = true,
  className = ''
}: VideoDataStatusIndicatorProps) {
  const status = getDataSourceStatus(result);
  
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  return (
    <div className={`absolute ${positionClasses[position]} z-50 flex flex-col gap-2 ${className}`}>
      {/* Status Indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center space-x-2 bg-black/50 rounded-full px-3 py-1 backdrop-blur-sm"
      >
        {status.type === 'loading' && (
          <>
            <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
            <span className="text-xs text-blue-400">{status.message}</span>
          </>
        )}
        {status.type === 'fallback' && (
          <>
            <AlertCircle className="w-3 h-3 text-yellow-400" />
            <span className="text-xs text-yellow-400">{status.message}</span>
          </>
        )}
        {status.type === 'connected' && (
          <>
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-xs text-green-400">{status.message}</span>
          </>
        )}
      </motion.div>

      {/* Video Count Indicator */}
      {showVideoCount && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-black/50 rounded-full px-3 py-1 backdrop-blur-sm"
        >
          <span className="text-xs text-white">
            {getVideoCountText(result.enhancedVideos.length)}
          </span>
        </motion.div>
      )}
    </div>
  );
}