'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { containerVariants } from '@/app/helpers/animation';
import { VideoMetadata, LayoutType } from '@/app/types/video';
import UnifiedFeedLayout from './UnifiedFeedLayout';

interface FeedContainerProps {
  videos: VideoMetadata[];
  layout: LayoutType;
}

const FeedContainer = ({ videos, layout }: FeedContainerProps) => {
  const [imageStates, setImageStates] = useState<Record<string, { loaded: boolean; error: boolean }>>({});

  const handleImageLoad = (videoId: string) => {
    setImageStates(prev => ({
      ...prev,
      [videoId]: { ...prev[videoId], loaded: true }
    }));
  };

  const handleImageError = (videoId: string) => {
    setImageStates(prev => ({
      ...prev,
      [videoId]: { ...prev[videoId], error: true }
    }));
  };

  const getGridClass = () => {
    switch (layout) {
      case 'grid':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr';
      case 'list':
        return 'space-y-6';
      case 'compact':
        return 'space-y-4';
      default:
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr';
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={getGridClass()}
    >
      {videos.map((video, index) => {
        const imageState = imageStates[video.id] || { loaded: false, error: false };
        
        return (
          <UnifiedFeedLayout
            key={video.id}
            imageLoaded={imageState.loaded}
            setImageLoaded={() => handleImageLoad(video.id)}
            imageError={imageState.error}
            setImageError={() => handleImageError(video.id)}
            video={video}
            priority={index < 4}
            layout={layout}
          />
        );
      })}
    </motion.div>
  );
};

export default FeedContainer;