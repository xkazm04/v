'use client';

import { motion } from 'framer-motion';
import { Loader2, AlertCircle, Play } from 'lucide-react';
import { VideoDataManagerResult } from '@/app/utils/videoDataManager';

interface VideoDataStatesProps {
  result: VideoDataManagerResult;
  children: React.ReactNode;
  showStatusIndicator?: boolean;
  containerClassName?: string;
}

export function VideoDataStates({
  result,
  children,
  showStatusIndicator = true,
  containerClassName = "h-screen bg-black"
}: VideoDataStatesProps) {
  const { 
    videosLoading, 
    videosError, 
    enhancedVideos,
    refetchVideos 
  } = result;

  // Loading state (only if no fallback available)
  if (videosLoading && enhancedVideos.length === 0) {
    return (
      <div className={`${containerClassName} flex items-center justify-center`}>
        <motion.div
          className="text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-lg mb-2">Loading videos...</p>
          <p className="text-sm text-gray-400">Fetching from API</p>
        </motion.div>
      </div>
    );
  }

  // Error state (only if no fallback available)
  if (videosError && enhancedVideos.length === 0) {
    return (
      <div className={`${containerClassName} flex items-center justify-center`}>
        <motion.div
          className="text-center text-white p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Unable to Load Videos</h2>
          <p className="text-gray-400 mb-6">
            {videosError instanceof Error ? videosError.message : 'Unknown error occurred'}
          </p>
          <motion.button
            onClick={() => {
              refetchVideos();
              window.location.reload();
            }}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // No videos available
  if (enhancedVideos.length === 0) {
    return (
      <div className={`${containerClassName} flex items-center justify-center`}>
        <motion.div
          className="text-center text-white p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Play className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">No Videos Available</h2>
          <p className="text-gray-400">
            Check back later for new content
          </p>
        </motion.div>
      </div>
    );
  }

  // Success state - render children
  return <>{children}</>;
}